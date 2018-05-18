import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { NotifyService } from './notify.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ErrorService } from './error.service';

import { of, Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User | null>;

  constructor(
    private _router: Router, private _notify: NotifyService,
    private afAuth: AngularFireAuth, private afs: AngularFirestore,
    private _error: ErrorService) {

    this.user = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this._router.navigate(['/dashboard']);
        // return this.updateUserData(user); // if using firestore
      })
      .catch((error) => this.handleError(error));
  }

  logOut() {
    this.afAuth.auth.signOut().then(() => {
      this._router.navigate(['./']);
    });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth.sendPasswordResetEmail(email)
      .then(() => this._notify.update('info', 'Atualização de senha enviada por e-mail'))
      .catch((error) => this.handleError(error));
  }

  // Sets user data to firestore after succesful login
  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'nameless user',
      photoURL: user.photoURL || 'https://goo.gl/Fz9nrQ',
    };
    return userRef.set(data);
  }

  emailSignUp(email: string, senha: string) {
    this._router.navigate(['./']);
  }

  // If error, notify user
  private handleError(error) {
    console.log(error);
    this._notify.update('danger', this._error.printErrorByCode(error.code));
  }
}
