import { Attachment } from './../models/attachment.interface';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Activity } from '../models/activity.interface';

import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  activityCollection: AngularFirestoreCollection<Activity>;

  constructor(private afs: AngularFirestore, private _auth: AuthService, private _notify: NotifyService) {
    this.activityCollection = this.afs.collection('activities');
  }

  getActivitiesToApprove(id: string) {
    const actReference = this.afs.collection<Activity>('activities',
      ref => ref.where('status', '==', 'A').where('user.uid', '==', id));

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

  // async createActivity(content: Activity, attach: Attachment) {
  async createActivity(content: Activity, attach) {
    content.status = 'A';
    content.attachment = attach;
    this._auth.user.subscribe(user => {
      content.user = { uid: user.uid, firstName: user.firstName, lastName: user.lastName, email: user.email }
      return this.activityCollection.add(content)
        .then(() => this._notify.update('success', 'Atividade criada com sucesso!'))
        .catch(() => this._notify.update('danger', 'Houve um erro na requisição!'));
    });
  }

  updateActivity(id: string, data: any) {
    return this.getActivityDocument(id).update(data).then(() => this._notify.update('success', 'Atividade atualizada com sucesso!'))
      .catch(() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }

  deleteActivity(id: string) {
    return this.getActivityDocument(id).delete().then(() => this._notify.update('success', 'Atividade atualizada com sucesso!'))
      .catch(() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }
}
