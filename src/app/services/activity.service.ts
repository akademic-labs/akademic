import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Activity } from '../models/activity.interface';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';

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
      ref => ref.where('user.uid', '==', id));

    return actReference.snapshotChanges()
      .pipe(map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          data.uid = a.payload.doc.id;
          return data;
        })
      }));
  }

  getActivityDocument(id: string) {
    return this._afs.doc<any>(`activities/${id}`);
  }

  getActivityById(uid: string) {
    return this._afs.doc<Activity>(`activities/${uid}`).valueChanges()
  }

  async createActivity(content: Activity, attach) {
    content.status = 'Pendente';
    content.attachment = attach;
    this._auth.user$.subscribe(user => {
      content.user = { uid: user.uid, displayName: user.displayName, email: user.email }
      return this.activityCollection.add(content)
        .then(() => {
          this._notify.update('success', 'Atividade criada com sucesso!');
          this._router.navigate(['/dashboard']);
        })
        .catch(() => this._notify.update('danger', 'Houve um erro na requisição!'));
    });
  }

  updateActivity(id: string, data: any, msg: string) {
    return this.getActivityDocument(id).update(data)
      .then(() => {
        this._notify.update('success', `Atividade ${msg} com sucesso!`);
        this._router.navigate(['/dashboard']);
      })
      .catch(() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }

  deleteActivity(id: string) {
    return this.getActivityDocument(id).delete()
      .then(() => {
        this._notify.update('success', 'Atividade deletada com sucesso!');
        this._router.navigate(['/dashboard']);
      })
      .catch(() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }
}
