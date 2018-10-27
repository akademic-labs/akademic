import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Controller } from '../models/controller.interace';
import { ErrorService } from './error.service';
import { NotifyService } from './notify.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  ControllerCollection: AngularFirestoreCollection<Controller>;

  constructor(private _afs: AngularFirestore, private _notify: NotifyService,
    private _message: MessageService, private _error: ErrorService) {
    this.ControllerCollection = _afs.collection('controllers');
  }

  get(): Observable<Controller[]> {
    return this.ControllerCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => ({ uid: action.payload.doc.id, ...action.payload.doc.data() }));
      })
    );
  }

  post(content: Controller) {
    this._afs.collection('controllers').add(content)
      .then(() => this._message.add({ severity: 'success', summary: `Controlador '${content.name}' adicionado com sucesso!` }))
      .catch (e => this.handleError(e));
  }

  put(uid: string, content: Controller) {
    this._afs.collection('controllers').doc(uid).set(content)
      .then(() => this._notify.update('success', 'Controlador atualizado com sucesso!'))
      .catch(e => this.handleError(e));
  }

  delete(uid: string) {
    this._afs.collection('controllers').doc(uid).delete()
      .then(() => this._notify.update('success', 'Controlador removido com sucesso!'))
      .catch(e => this.handleError(e));
  }

  private handleError(error) {
    this._notify.update('danger', this._error.printErrorByCode(error.code));
  }

}
