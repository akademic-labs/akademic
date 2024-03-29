import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Activity } from '../models/activity.interface';
import { documentJoin } from '../operators/document-join.operator';
import { leftJoinDocument } from '../operators/left-join-document.operator';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(
    private _afs: AngularFirestore,
    private _auth: AuthService,
    private _errorService: ErrorService,
    private _dbService: FirestoreService
  ) {}

  getActivitiesToApprove(): Observable<Activity[]> {
    return this._dbService
      .colWithId$<Activity>('activities', (ref) =>
        ref.where('status', '==', 'Pendente')
      )
      .pipe(leftJoinDocument(this._afs, 'user', 'users'));
  }

  getActivitiesStudent(uid: string, page: number, sort: string, size: number) {
    return this._dbService.colWithId$<Activity>('activities', (ref) =>
      ref
        .where('user', '==', uid)
        // .endAt(4)
        .orderBy(sort, 'asc')
        // .startAt('asd')
        .limit(size)
    );
  }

  getCount(uid: string, page: number, sort: string, size: number) {
    // this._afs.collection('activities').get().toPromise().then(snap => {
    //   console.log(snap.size);
    // });
    // this._afs.collection('activities').get().then(function (querySnapshot) {
    //   querySnapshot.forEach(function (doc) {
    //     // doc.data() is never undefined for query doc snapshots
    //     console.log(doc.id, ' => ', doc.data());
    //   });
    // });
  }

  getActivityDocument(uid: string): AngularFirestoreDocument<Activity> {
    return this._afs.doc<Activity>(`activities/${uid}`);
  }

  getActivityById(uid: string): Observable<Activity> {
    return this._dbService
      .docWithId$<Activity>(`activities/${uid}`)
      .pipe(
        documentJoin(this._afs, { user: 'users' }),
        documentJoin(this._afs, { controller: 'users' })
      );
  }

  create(content: Activity, attachments) {
    content.attachments = attachments;
    return this._dbService.add<Activity>('activities', content);
  }

  update(content: Activity, uid: string, attachments) {
    content.attachments = attachments;
    return this._dbService.set<Activity>(`activities/${uid}`, content);
  }

  async onApprove(data: Activity) {
    data.user = data.user.uid;
    const controller = await this._auth.user$.pipe(take(1)).toPromise();
    data.controller = controller.uid;

    try {
      return this.getActivityDocument(data.uid).update(data);
    } catch (error) {
      return this._errorService.handleErrorByCode(error.code);
    }
  }

  async deleteActivity(id: string) {
    try {
      return this.getActivityDocument(id).delete();
    } catch (error) {
      return this._errorService.handleErrorByCode(error.code);
    }
  }
}
