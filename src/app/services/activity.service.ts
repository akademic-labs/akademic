import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Activity } from '../models/activity.interface';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  activityCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
    this.activityCollection = this.afs.collection('activities');
  }

  getActivities(): Observable<any[]> {
    // ['added', 'modified', 'removed']
    return this.activityCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getActivityById(id: string) {
    return this.afs.doc<any>(`activities/${id}`);
  }

  createActivity(content: Activity) {
    return this.activityCollection.add(content);
  }

  updateActivity(id: string, data: any) {
    return this.getActivityById(id).update(data);
  }

  deleteActivity(id: string) {
    return this.getActivityById(id).delete();
  }
}
