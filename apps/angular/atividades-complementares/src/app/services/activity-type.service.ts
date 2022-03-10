import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ActivityType } from './../models/activity-type.interface';
import { ErrorService } from './error.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityTypeService {
  actTypeCollection: AngularFirestoreCollection<ActivityType>;

  constructor(
    private _afs: AngularFirestore,
    private _notify: NotifyService,
    private _errorService: ErrorService
  ) {
    this.actTypeCollection = this._afs.collection('activityTypes');
  }

  get(): Observable<ActivityType[]> {
    return this.actTypeCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { uid: a.payload.doc.id, ...data };
        });
      })
    );
  }

  post(content: ActivityType) {
    this._afs
      .collection('activityTypes')
      .add(content)
      .then(() =>
        this._notify.update(
          'success',
          'Tipo de atividade adicionada com sucesso!'
        )
      )
      .catch((error) => this._errorService.handleErrorByCode(error.code));
  }

  put(uid: string, content: ActivityType) {
    this._afs
      .collection('activityTypes')
      .doc(uid)
      .set(content)
      .then(() =>
        this._notify.update(
          'success',
          'Tipo de atividade atualizada com sucesso!'
        )
      )
      .catch((error) => this._errorService.handleErrorByCode(error.code));
  }

  delete(uid: string) {
    this._afs
      .collection('activityTypes')
      .doc(uid)
      .delete()
      .then(() =>
        this._notify.update(
          'success',
          'Tipo de atividade removida com sucesso!'
        )
      )
      .catch((error) => this._errorService.handleErrorByCode(error.code));
  }
}
