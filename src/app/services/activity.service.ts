import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { leftJoinDocument } from 'app/utils/joinOperators';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Activity } from '../models/activity.interface';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';
import { FirestoreService } from './firestore.service';
import { NotifyService } from './notify.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  activityCollection: AngularFirestoreCollection<Activity>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router,
    private notify: NotifyService,
    private userService: UserService,
    private error: ErrorService,
    private fsService: FirestoreService
  ) {
    this.activityCollection = this.afs.collection('activities');
  }

  getActivitiesToApprove(): Observable<Activity[]> {
    return this.fsService.colWithId$<Activity>('activities', ref => ref.where('status', '==', 'Pendente'))
      .pipe(
        leftJoinDocument(this.afs, 'userUid', 'users', 'user')
      ) as Observable<Activity[]>;
  }

  getActivitiesStudent(uid: string) {
    return this.fsService.colWithId$<Activity>('activities', ref => ref.where('userUid', '==', uid));
  }

  getActivityDocument(uid: string): AngularFirestoreDocument<Activity> {
    return this.afs.doc<Activity>(`activities/${uid}`);
  }

  getActivityById(uid: string): Observable<Activity> {
    return this.afs.doc<Activity>(`activities/${uid}`).valueChanges()
  }

  async createActivity(content: Activity, attach) {
    content.attachment = attach;
    const user = await this.auth.user$.pipe(take(1)).toPromise();
    content.userUid = user.uid;
    await this.activityCollection.add(content);
    this.notify.update('success', 'Atividade criada com sucesso!');
  }

  async updateActivity(id: string, data: any, msg: string) {
    try {
      await this.getActivityDocument(id).update(data);
      this.notify.update('success', `Atividade ${msg} com sucesso!`);
      this.router.navigate(['/dashboard']);
    } catch (e) {
      return this.handleError(e)
    }
  }

  async deleteActivity(id: string) {
    try {
      await this.getActivityDocument(id).delete();
      this.notify.update('success', 'Atividade deletada com sucesso!');
      this.router.navigate(['/dashboard']);
    } catch (e) {
      return this.handleError(e)
    }
  }

  private handleError(error) {
    this.notify.update('danger', this.error.printErrorByCode(error.code));
  }
}
