import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { NotifyService } from './notify.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ErrorService } from './error.service';

import { of, Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from 'app/models/user.model';

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
    return this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => this._notify.update('info', 'Atualização de senha enviada por e-mail'))
      .catch((error) => this.handleError(error));
  }

  // should maybe be implemented
  emailSignUp(email: string, senha: string) {
    this._router.navigate(['./']);
  }

  // If error, notify user
  private handleError(error) {
    console.log(error);
    this._notify.update('danger', this._error.printErrorByCode(error.code));
  }
}
