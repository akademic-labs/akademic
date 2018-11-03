import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.interface';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore, private dbService: FirestoreService) {
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

  getUserById(id: string) {
    return this.afs.doc<User>(`users/${id}`);
  }

  updateUser(id: string, data: User) {
    return this.getUserById(id).set(data, { merge: true });
  }

  deleteUser(id: string) {
    return this.getUserById(id).delete();
  }
}
