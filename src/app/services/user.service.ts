import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { User } from 'app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  public updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'nameless user',
      photoURL: user.photoURL || 'https://goo.gl/Fz9nrQ',
    };
    // study set of firestore !URGENT
    return userRef.set(data);
  }
}
