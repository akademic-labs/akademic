import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { User } from 'app/models/user.interface';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore, private _router: Router, private _notify: NotifyService) {
  }

  getAllUsers(): Observable<User[]> {
    // ['added', 'modified', 'removed']
    return this.afs.collection<User>('users').snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getUserDocById(id: string) {
    return this.afs.doc<User>(`users/${id}`);
  }

  updateUser(id: string, data: User) {
    return this.getUserDocById(id).set(data, { merge: true });
  }

  public createUserData(user: User) {
    // sets user data to firestore
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    userRef.set(user, { merge: true });

    this._router.navigate(['/dashboard']);
    this._notify.update('success', 'Bem vindo!');
  }

  deleteUser(id: string) {
    return this.getUserDocById(id).delete();
  }
}
