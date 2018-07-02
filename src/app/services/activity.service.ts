import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AuthService } from './auth.service';
import { Activity } from '../models/activity.interface';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  activityCollection: AngularFirestoreCollection<Activity>;

  constructor(private afs: AngularFirestore, private _auth: AuthService) {
    this.activityCollection = this.afs.collection('activities');
  }

  getActivitiesToApprove(id: string) {
    const actReference = this.afs.collection<Activity>('activities',
      ref => ref.where('status', '==', 'A').where('userId', '==', id));

    return actReference.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          data.uid = a.payload.doc.id;
          return data;
        })
      }));
  }

  getActivityDocument(id: string) {
    return this.afs.doc<any>(`activities/${id}`);
  }

  getActivityById(uid: string) {
    return this.afs.doc<Activity>(`activities/${uid}`).valueChanges()
  }

  createActivity(content: Activity) {
    content.status = 'A';
    this._auth.user.subscribe(us => content.userId = us.uid);
    return this.activityCollection.add(content);
  }

  updateActivity(id: string, data: any) {
    return this.getActivityDocument(id).update(data);
  }

  deleteActivity(id: string) {
    return this.getActivityDocument(id).delete();
  }
}
