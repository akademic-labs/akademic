import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Controller } from '../models/controller.interace';
import { ErrorService } from './error.service';
import { NotifyService } from './notify.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ControllerService {
  ControllerCollection: AngularFirestoreCollection<Controller>;

  constructor(
    private _afs: AngularFirestore,
    private _notify: NotifyService,
    private _message: MessageService,
    private _errorService: ErrorService
  ) {
    this.ControllerCollection = _afs.collection('controllers');
  }

  get(): Observable<Controller[]> {
    return this.ControllerCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((action) => ({
          uid: action.payload.doc.id,
          ...action.payload.doc.data(),
        }));
      })
    );
  }

  post(content: Controller) {
    this._afs
      .collection('controllers')
      .add(content)
      .then(() =>
        this._message.add({
          severity: 'success',
          summary: `Controlador '${content.name}' adicionado com sucesso!`,
        })
      )
      .catch((error) => this._errorService.handleErrorByCode(error.code));
  }

  put(uid: string, content: Controller) {
    this._afs
      .collection('controllers')
      .doc(uid)
      .set(content)
      .then(() =>
        this._notify.update('success', 'Controlador atualizado com sucesso!')
      )
      .catch((error) => this._errorService.handleErrorByCode(error.code));
  }

  delete(uid: string) {
    this._afs
      .collection('controllers')
      .doc(uid)
      .delete()
      .then(() =>
        this._notify.update('success', 'Controlador removido com sucesso!')
      )
      .catch((error) => this._errorService.handleErrorByCode(error.code));
  }
}
