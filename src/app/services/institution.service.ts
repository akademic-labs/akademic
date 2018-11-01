import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Course } from 'app/models/course.interface';
import { Observable } from 'rxjs';

import { Institution } from '../models/institution.interface';
import { ErrorService } from './error.service';
import { FirestoreService } from './firestore.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  constructor(
    private _afs: AngularFirestore,
    private _notify: NotifyService,
    private _errorService: ErrorService,
    private dbService: FirestoreService
  ) { }

  get(): Observable<Institution[]> {
    return this.dbService.colWithId$<Institution>('institutions');
  }

  getInstitutionByUF(uf: string) {
    return this.dbService.colWithId$<Institution>('institutions', ref => ref.where('uf', '==', uf));
  }

  getInstitutionCourses(institutionUid: string) {
    return this.dbService.col$<Course>(`institutions/${institutionUid}/courses`);
  }

  post(content: Institution) {
    this._afs.collection('institutions').add(content)
      .then(() => this._notify.update('success', 'Instituição adicionada com sucesso!'))
      .catch(error => this._errorService.handleErrorByCode(error.code));
  }

  put(uid: string, content: Institution) {
    this._afs.collection('institutions').doc(uid).set(content)
      .then(() => this._notify.update('success', 'Instituição atualizada com sucesso!'))
      .catch(error => this._errorService.handleErrorByCode(error.code));
  }

  delete(uid: string) {
    this._afs.collection('institutions').doc(uid).delete()
      .then(() => this._notify.update('success', 'Instituição removida com sucesso!'))
      .catch(error => this._errorService.handleErrorByCode(error.code));
  }
}
