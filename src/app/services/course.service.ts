import { NotifyService } from './notify.service';
import { AngularFirestoreCollection, AngularFirestore } from "angularfire2/firestore";
import { Injectable } from "@angular/core";
import { Course } from "../models/course.interface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CourseService {

  courseCollection: AngularFirestoreCollection<Course>;

  constructor(private _afs: AngularFirestore, private _notify: NotifyService) {
    this.courseCollection = _afs.collection('courses');
  }

  get(): Observable<Course[]> {
    return this.courseCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => ({ uid: action.payload.doc.id, ...action.payload.doc.data() }));
      })
    );
  }

  post(content: Course){
    this._afs.collection('courses').add(content)
      .then (() => this._notify.update('success', 'Curso adicionado com sucesso!'))
      .catch (() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }

  put(uid: string, content: Course){
    this._afs.collection('courses').doc(uid).set(content)
      .then (() => this._notify.update('success', 'Curso atualizado com sucesso!'))
      .catch (() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }

  delete(uid: string){
    this._afs.collection('courses').doc(uid).delete()
      .then (() => this._notify.update('success', 'Curso removido com sucesso!'))
      .catch (() => this._notify.update('danger', 'Houve um erro na requisição!'));
  }

}