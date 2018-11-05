import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Rules } from '../models/rules.interface';
import { ErrorService } from './error.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class Ruleservice {

  rulesCollection: AngularFirestoreCollection<Rules>;

  constructor(
    private _afs: AngularFirestore,
    private _notify: NotifyService,
    private _errorService: ErrorService
  ) {
    this.rulesCollection = _afs.collection('rules');
  }

  get(): Observable<Rules[]> {
    return this.rulesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => ({ uid: action.payload.doc.id, ...action.payload.doc.data() }));
      })
    );
  }

  post(content: Rules) {
    this._afs.collection('rules').add(content)
      .then(() => this._notify.update('success', 'Regra adicionada com sucesso!'))
      .catch(error => this._errorService.handleErrorByCode(error.code));
  }

  put(uid: string, content: Rules) {
    this._afs.collection('rules').doc(uid).set(content)
      .then(() => this._notify.update('success', 'Regra atualizada com sucesso!'))
      .catch(error => this._errorService.handleErrorByCode(error.code));
  }

  delete(uid: string) {
    this._afs.collection('rules').doc(uid).delete()
      .then(() => this._notify.update('success', 'Regra removida com sucesso!'))
      .catch(error => this._errorService.handleErrorByCode(error.code));
  }
}
