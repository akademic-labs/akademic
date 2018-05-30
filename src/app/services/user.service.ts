import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from 'app/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
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

  public updateUserData(data: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${data.uid}`);
    // study set of firestore !URGENT
    return userRef.set(data);
  }

  deleteUser(id: string) {
    return this.getUser(id).delete();
  }
}
