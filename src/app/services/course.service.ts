import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { leftJoinDocument } from 'app/utils/joinOperators';

import { Course } from '../models/course.interface';
import { ErrorService } from './error.service';
import { FirestoreService } from './firestore.service';
import { NotifyService } from './notify.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(
    private _afs: AngularFirestore,
    private _notify: NotifyService,
    private dbService: FirestoreService,
    private _error: ErrorService
  ) {
  }

  get() {
    return this.dbService.colWithId$<Course>('courses');
  }

  post(content: Course) {
    this._afs.collection('courses').add(content)
      .then(() => this._notify.update('success', 'Curso adicionado com sucesso!'))
      .catch(e => this.handleError(e));
  }

  put(uid: string, content: Course) {
    this._afs.collection('courses').doc(uid).set(content)
      .then(() => this._notify.update('success', 'Curso atualizado com sucesso!'))
      .catch(e => this.handleError(e));
  }

  delete(uid: string) {
    this._afs.collection('courses').doc(uid).delete()
      .then(() => this._notify.update('success', 'Curso removido com sucesso!'))
      .catch(e => this.handleError(e));
  }

  private handleError(error) {
    this._notify.update('danger', this._error.printErrorByCode(error.code));
  }
}
