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

  getAll(): Observable<User[]> {
    return this.afs.collection<User>('users').snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getById(id: string) {
    return this.afs.doc<User>(`users/${id}`);
  }

  getByRole(role: 'student' | 'controller' | 'institution') {
    return this.dbService.colWithId$<User>('users', ref => ref.where(`roles.${role}`, '==', true));
  }

  getControllerByInstitution(institutionUid: string) {
    return this.dbService.colWithId$<User>('users', ref => ref.where('roles.controller', '==', true).where('institution', '==', institutionUid));
  }

  // fires new user cloud function
  addNew(data: User) {
    return this.dbService.add<User>('newUsers', data);
  }

  update(id: string, data: User) {
    return this.getById(id).set(data, { merge: true });
  }

  delete(id: string) {
    return this.getById(id).delete();
  }
}
