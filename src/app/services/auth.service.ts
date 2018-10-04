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
    private _router: Router, private _notify: NotifyService,
    private afAuth: AngularFireAuth, private afs: AngularFirestore,
    private _error: ErrorService, private _userService: UserService) {

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

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(credential => {
        const dataUser = this.authCredentialToUser(credential.user);
        this._userService.createUserData(dataUser);
      })
      .catch((error) => this.handleError(error));
  }

  createUser(user: User, password: string) {
    console.log(user);
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, password)
      .then(credential => {
        user.uid = credential.user.uid;
        this._userService.createUserData(user);
      });
  }

  // OAuth Methods

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  logOut() {
    this.afAuth.auth.signOut().then(() => {
      this._router.navigate(['/']);
    });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => this._notify.update('info', 'Atualização de senha enviada por e-mail'))
      .catch((error) => this.handleError(error));
  }

  private oAuthLogin(provider: any) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then(credential => {
        const dataUser = this.authCredentialToUser(credential.user);
        this._userService.createUserData(dataUser);
      })
      .catch(error => this.handleError(error));
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

  // If error, notify user
  private handleError(error) {
    this._notify.update('danger', this._error.printErrorByCode(error.code));
  }
}
