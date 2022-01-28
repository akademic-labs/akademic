import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Course } from '../models/course.interface';
import { sort } from '../operators/sort-by.operator';
import { ErrorService } from './error.service';
import { FirestoreService } from './firestore.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(
    private _afs: AngularFirestore,
    private _notify: NotifyService,
    private dbService: FirestoreService,
    private _errorService: ErrorService
  ) {}

  get() {
    return this.dbService
      .colWithId$<Course>('courses')
      .pipe(sort('name', 'asc'));
  }

  post(content: Course) {
    this._afs
      .collection('courses')
      .add(content)
      .then(() =>
        this._notify.update('success', 'Curso adicionado com sucesso!')
      )
      .catch((error) => this._errorService.handleErrorByCode(error.code));
  }

  put(uid: string, content: Course) {
    this._afs
      .collection('courses')
      .doc(uid)
      .set(content)
      .then(() =>
        this._notify.update('success', 'Curso atualizado com sucesso!')
      )
      .catch((error) => this._errorService.handleErrorByCode(error.code));
  }

  delete(uid: string) {
    this._afs
      .collection('courses')
      .doc(uid)
      .delete()
      .then(() => this._notify.update('success', 'Curso removido com sucesso!'))
      .catch((error) => this._errorService.handleErrorByCode(error.code));
  }
}
