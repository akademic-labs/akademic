import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Activity } from '../models/activity.interface';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  activityCollection: AngularFirestoreCollection<Activity>;
  task: AngularFireUploadTask;

  constructor(
    private afs: AngularFirestore,
    private _auth: AuthService,
    private _notify: NotifyService,
    private _storage: AngularFireStorage,
    private _router: Router
  ) {
    this.activityCollection = this.afs.collection('activities');
  }

  getActivitiesToApprove(id: string) {
    const actReference = this.afs.collection<Activity>('activities',
      ref => ref.where('status', '==', 'P').where('user.uid', '==', id));

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
  async createActivity(content: Activity, attachs, uploads) {
    // input defaut status = 'P' (Pending)
    content.status = 'P';
    content.attachment = attachs;
    this._auth.user.subscribe(user => {
      content.user = { uid: user.uid, displayName: user.displayName, lastName: user.lastName, email: user.email }
      return this.activityCollection.add(content)
        .then(() => {
          // Upload Attachments
          // for (let i = 0; i < uploads.length; i++) {
          // tslint:disable-next-line:max-line-length
          // this.task = this._storage.upload(uploads[i].path, uploads[i].file, uploads[i].metadata);
          // }
          this._notify.update('success', 'Atividade criada com sucesso!');
          // this._router.navigate(['/dashboard']);
          // Progress monitoring
        })
        .catch(() => this._notify.update('danger', 'Houve um erro na requisição!'));
    });
    // return this.task.percentageChanges();
  }

  updateActivity(id: string, data: any, msg: string) {
    return this.getActivityDocument(id).update(data).then(() => this._notify.update('success', `Atividade ${msg} com sucesso!`))
      .catch(() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }

  deleteActivity(id: string) {
    return this.getActivityDocument(id).delete().then(() => this._notify.update('success', 'Atividade deletada com sucesso!'))
      .catch(() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }
}
