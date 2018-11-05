import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { ErrorService } from './error.service';
import { NotifyService } from './notify.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as firebase from 'firebase/app';

import { User } from 'app/models/user.interface';
import { UserInfo } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private _router: Router,
    private _notify: NotifyService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private _errorService: ErrorService,
    private _userService: UserService
  ) {

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  logOut() {
    this.afAuth.auth.signOut().then(() => {
      this._router.navigate(['/']);
    });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => this._notify.update('info', 'Atualização de senha enviada por e-mail'))
      .catch(error => this._errorService.handleErrorByCode(error.code));
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const credential = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      if (credential) { this.successAndRedirect() };
    } catch (error) {
      return this._errorService.handleErrorByCode(error.code);
    }
  }

  async createUserWithEmailAndPassword(user: User, password: string) {
    try {
      const credential = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, password);
      user.uid = credential.user.uid;
      await this._userService.updateUser(user.uid, user);
      this.successAndRedirect();
    } catch (error) {
      return this._errorService.handleErrorByCode(error.code);
    }
  }

  // OAuth Methods

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    this.oAuthLogin(provider);
  }

  private async oAuthLogin(provider: any) {
    try {
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      const user = this.authCredentialToUser(credential.user);
      await this._userService.updateUser(user.uid, user);
      this.successAndRedirect();
    } catch (e) {
      return this._errorService.handleErrorByCode(e.code);
    }
  }

  private authCredentialToUser(credentialUser: UserInfo) {
    const dataUser: User = {
      uid: credentialUser.uid,
      email: credentialUser.email,
      displayName: credentialUser.displayName || 'nameless',
      photoURL: credentialUser.photoURL,
      status: 'A',
      roles: { student: true },
      createdAt: new Date()
    };

    return dataUser;
  }

  private successAndRedirect() {
    this._router.navigate(['/dashboard']);
    this._notify.update('success', 'Bem vindo!');
  }
}
