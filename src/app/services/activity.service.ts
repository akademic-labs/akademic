import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Activity } from '../models/activity.interface';
import { documentJoin } from './../operators/document-join.operator';
import { leftJoinDocument } from './../operators/left-join-document.operator';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';
import { FirestoreService } from './firestore.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router,
    private notify: NotifyService,
    private errorService: ErrorService,
    private dbService: FirestoreService
  ) { }

  getActivitiesToApprove(): Observable<Activity[]> {
    return this.dbService.colWithId$<Activity>('activities', ref => ref.where('status', '==', 'Pendente'))
      .pipe(
        leftJoinDocument(this.afs, 'user', 'users')
      );
  }

  getActivitiesStudent(uid: string) {
    return this.dbService.colWithId$<Activity>('activities', ref => ref.where('user', '==', uid));
  }

  getActivityDocument(uid: string): AngularFirestoreDocument<Activity> {
    return this.afs.doc<Activity>(`activities/${uid}`);
  }

  getActivityById(uid: string): Observable<Activity> {
    return this.dbService.docWithId$('activities/' + uid).pipe(
      documentJoin(this.afs, { user: 'users' })
    );
  }

  async createActivity(content: Activity, attachments) {
    content.attachments = attachments;
    const user = await this.auth.user$.pipe(take(1)).toPromise();
    content.user = user.uid;
    await this.dbService.add<Activity>('activities', content);
    this.notify.update('success', 'Atividade cadastrada com sucesso!');
  }

  async updateActivity(content: Activity, uid: string, attachments) {
    content.attachments = attachments;
    const user = await this.auth.user$.pipe(take(1)).toPromise();
    content.user = user.uid;
    await this.dbService.set<Activity>(`activities/${uid}`, content);
    this.notify.update('success', 'Atividade atualizada com sucesso!');
  }

  async onApprove(data: Activity, msg: string) {
    try {
      await this.getActivityDocument(data.uid).update(data);
      this.notify.update('success', `Atividade ${msg} com sucesso!`);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      return this.errorService.handleErrorByCode(error.code)
    }
  }

  async deleteActivity(id: string) {
    try {
      await this.getActivityDocument(id).delete();
      this.notify.update('success', 'Atividade deletada com sucesso!');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      return this.errorService.handleErrorByCode(error.code)
    }
  }
}
