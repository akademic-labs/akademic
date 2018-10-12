import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Activity } from '../models/activity.interface';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  activityCollection: AngularFirestoreCollection<Activity>;

  constructor(
    private _afs: AngularFirestore,
    private _auth: AuthService,
    private _router: Router,
    private _notify: NotifyService
  ) {
    this.activityCollection = this._afs.collection('activities');
  }

  getActivitiesToApprove() {
    const actReference = this._afs.collection<Activity>('activities',
      ref => ref.where('status', '==', 'Pendente'));

    return actReference.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          data.uid = a.payload.doc.id;
          return data;
        })
      }));
  }

  getActivitiesStudent(id: string) {
    const actReference = this._afs.collection<Activity>('activities',
      ref => ref.where('userUid', '==', id));

    return actReference.snapshotChanges()
      .pipe(map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          data.uid = a.payload.doc.id;
          return data;
        })
      }));
  }

  getActivityDocument(id: string): AngularFirestoreDocument<Activity> {
    return this._afs.doc<Activity>(`activities/${id}`);
  }

  getActivityById(uid: string): Observable<Activity> {
    return this._afs.doc<Activity>(`activities/${uid}`).valueChanges()
  }

  async createActivity(content: Activity, attach) {
    content.attachment = attach;
    this._auth.user$.subscribe(user => {
      content.userUid = user.uid;
      return this.activityCollection.add(content)
        .then(() => {
          this._notify.update('success', 'Atividade criada com sucesso!');
        })
        .catch(() => this._notify.update('danger', 'Houve um erro na requisição!'));
    });
  }

  async updateActivity(id: string, data: any, msg: string) {
    try {
      await this.getActivityDocument(id).update(data);
      this._notify.update('success', `Atividade ${msg} com sucesso!`);
      this._router.navigate(['/dashboard']);
    } catch (e) {
      return this._notify.update('danger', 'Houve um erro na requisição!');
    }
  }

  async deleteActivity(id: string) {
    try {
      await this.getActivityDocument(id).delete();
      this._notify.update('success', 'Atividade deletada com sucesso!');
      this._router.navigate(['/dashboard']);
    } catch (e) {
      return this._notify.update('danger', 'Houve um erro na requisição!');
    }
  }
}
