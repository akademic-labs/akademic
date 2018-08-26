import { NotifyService } from './notify.service';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Controller } from '../models/controller.interace';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  ControllerCollection: AngularFirestoreCollection<Controller>;

  constructor(private _afs: AngularFirestore, private _notify: NotifyService) {
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
      .then (() => this._notify.update('success', 'Controlador adicionado com sucesso!'))
      .catch (() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }

  put(uid: string, content: Controller) {
    this._afs.collection('controllers').doc(uid).set(content)
      .then (() => this._notify.update('success', 'Controlador atualizado com sucesso!'))
      .catch (() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }

  delete(uid: string) {
    this._afs.collection('controllers').doc(uid).delete()
      .then (() => this._notify.update('success', 'Controlador removido com sucesso!'))
      .catch (() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }

}
