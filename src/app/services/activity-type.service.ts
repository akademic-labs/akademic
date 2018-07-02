import { ActivityType } from './../models/activity-type.interface';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityTypeService {
  actTypeCollection: AngularFirestoreCollection<ActivityType>;

  constructor(private afs: AngularFirestore) {
    this.actTypeCollection = this.afs.collection('activityTypes');
  }

  getTypes(): Observable<ActivityType[]> {
    return this.actTypeCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }
}
