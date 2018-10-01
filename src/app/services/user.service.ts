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

  userCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore, private _router: Router, private _notify: NotifyService) {
    this.userCollection = this.afs.collection('users', (ref) => ref.orderBy('time', 'desc').limit(5));
  }

  getData(): Observable<any[]> {
    // ['added', 'modified', 'removed']
    return this.userCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getUser(id: string) {
    return this.afs.doc<any>(`users/${id}`);
  }

  updateUser(id: string, data: any) {
    return this.getUser(id).update(data);
  }

  public createUserData(user: User) {
    // sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    userRef.set(user, { merge: true });

    this._router.navigate(['/dashboard']);
    this._notify.update('success', 'Bem vindo!');
  }

  deleteUser(id: string) {
    return this.getUser(id).delete();
  }
}
