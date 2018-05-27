import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { User } from 'app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  public updateUserData(data: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${data.uid}`);
    // study set of firestore !URGENT
    return userRef.set(data);
  }
}
