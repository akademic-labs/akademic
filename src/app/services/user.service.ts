import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { User } from 'app/models/user.interface';

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

  public updateUserData(authUser: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${authUser.uid}`);

    const data: User = {
      uid: authUser.uid,
      email: authUser.email,
      firstName: authUser.firstName || 'nameless',
      lastName: authUser.lastName || 'user',
      photo: 'https://goo.gl/Fz9nrQ',
      registration: '2015000595',
      birthday: new Date('05/06/1996'),
      course: {
        uid: 1,
        name: 'Sistemas de Informação'
      },
      status: 'A',
      type: {
        user: true
      },
      createdAt: new Date(),
      phone: '(41) 997315752'
    };
    return userRef.set(data);
  }

  deleteUser(id: string) {
    return this.getUser(id).delete();
  }
}
