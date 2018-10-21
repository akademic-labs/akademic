import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Institution } from '../models/institution.interface';
import { ErrorService } from './error.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  institutionCollection: AngularFirestoreCollection<Institution>;

  constructor(private _afs: AngularFirestore, private _notify: NotifyService, private _error: ErrorService) {
    this.institutionCollection = _afs.collection('institutions');
  }

  get(): Observable<Institution[]> {
    return this.institutionCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => ({ uid: action.payload.doc.id, ...action.payload.doc.data() }));
      })
    );
  }

  post(content: Institution) {
    this._afs.collection('institutions').add(content)
      .then(() => this._notify.update('success', 'Instituição adicionada com sucesso!'))
      .catch(e => this.handleError(e));
  }

  put(uid: string, content: Institution) {
    this._afs.collection('institutions').doc(uid).set(content)
      .then(() => this._notify.update('success', 'Instituição atualizada com sucesso!'))
      .catch(e => this.handleError(e));
  }

  delete(uid: string) {
    this._afs.collection('institutions').doc(uid).delete()
      .then(() => this._notify.update('success', 'Instituição removida com sucesso!'))
      .catch(e => this.handleError(e));
  }

  private handleError(error) {
    this._notify.update('danger', this._error.printErrorByCode(error.code));
  }
}
