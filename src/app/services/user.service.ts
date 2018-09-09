import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { User } from 'app/models/user.interface';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserInfo } from 'firebase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore, private _router: Router) {
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

  createUser(content: User) {
    return this.userCollection.add(content);
  }

  updateUser(id: string, data: any) {
    return this.getUser(id).update(data);
  }

  public createUserData(authUser: UserInfo) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${authUser.uid}`);

    userRef.snapshotChanges().pipe(take(1)).subscribe(d => {
      if (!d.payload.exists) {
        // save the user
        const data: User = {
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName.substr(0, authUser.displayName.indexOf(' ')) || 'nameless',
          lastName: authUser.displayName.substr(authUser.displayName.indexOf(' ') + 1),
          photoURL: authUser.photoURL,
          status: 'A',
          roles: {
            student: true
          },
          createdAt: new Date()
        };
        userRef.set(data);
      }

      this._router.navigate(['/dashboard']);
    })
  }

  deleteUser(id: string) {
    return this.getUser(id).delete();
  }
}
