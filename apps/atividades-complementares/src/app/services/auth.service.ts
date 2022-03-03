import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { ErrorService } from './error.service';
import { NotifyService } from './notify.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import firebase from 'firebase/compat/app';

import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private router: Router,
    private notify: NotifyService,
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private errorService: ErrorService,
    private userService: UserService
  ) {
    this.user$ = this.fireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async logOut() {
    await this.fireAuth.signOut();

    this.router.navigate(['/']);
  }

  // Sends email allowing user to reset password
  async resetPassword(email: string) {
    try {
      await this.fireAuth.sendPasswordResetEmail(email);

      this.notify.update('info', 'Atualização de senha enviada por e-mail');
    } catch (error) {
      return this.errorService.handleErrorByCode(error.code);
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const credential = await this.fireAuth.signInWithEmailAndPassword(
        email,
        password
      );

      if (credential) {
        this.successAndRedirect();
      }
    } catch (error) {
      return this.errorService.handleErrorByCode(error.code);
    }
  }

  async createUserWithEmailAndPassword(user: User, password: string) {
    try {
      const credential = await this.fireAuth.createUserWithEmailAndPassword(
        user.email,
        password
      );

      user.uid = credential.user.uid;

      return this.userService.update(user.uid, user);
    } catch (error) {
      return this.errorService.handleErrorByCode(error.code);
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
      const credential = await this.fireAuth.signInWithPopup(provider);
      const user = this.authCredentialToUser(credential.user);
      await this.userService.update(user.uid, user);
      this.successAndRedirect();
    } catch (e) {
      return this.errorService.handleErrorByCode(e.code);
    }
  }

  private authCredentialToUser(credentialUser: firebase.UserInfo) {
    const dataUser: User = {
      uid: credentialUser.uid,
      email: credentialUser.email,
      displayName: credentialUser.displayName || 'nameless',
      photoURL: credentialUser.photoURL,
      status: 'A',
      roles: { student: true },
      createdAt: new Date(),
    };

    return dataUser;
  }

  private successAndRedirect() {
    this.router.navigate(['/dashboard']);
    this.notify.update('success', 'Bem vindo!');
  }
}
