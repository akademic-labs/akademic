import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryFn,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private afs: AngularFirestore) {}

  // firebase server timestamp
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  /* **************
    Get a reference
  * **************/

  col<T>(
    ref: CollectionPredicate<T>,
    queryFn?: QueryFn
  ): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  /* **************
    returns an observable - usage:
      this.db.doc$('notes/id')
      this.db.col$('notes', ref => ref.where('user', '==', 'Patrick'))
  * **************/
  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          return doc.payload.data() as T;
        })
      );
  }

  col$<T>(ref: CollectionPredicate<T>, queryFn?: QueryFn): Observable<T[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((docs) => {
          return docs.map((a) => a.payload.doc.data()) as T[];
        })
      );
  }

  colWithId$<T>(
    ref: CollectionPredicate<T>,
    queryFn?: QueryFn
  ): Observable<T[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const uid = a.payload.doc.id;
            return { uid, ...(<any>data) };
          });
        })
      );
  }

  public docWithId$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data = a.payload.data();
          const uid = a.payload.id;
          return { uid, ...(<any>data) };
        })
      );
  }

  // this.db.upsert('notes/xyz', { content: 'hello world'})
  async upsert<T>(ref: DocPredicate<T>, data: any) {
    const doc = this.doc(ref).snapshotChanges().pipe(take(1)).toPromise();

    const snap = await doc;
    return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
  }

  /* **************
     db.update('items/ID', data) }) // adds updatedAt field
     db.set('items/ID', data) })    // adds createdAt field
     db.add('items', data) })       // adds createdAt field
  *  **************/

  update<T>(ref: DocPredicate<T>, data: any) {
    return this.doc(ref).update({
      ...data,
      updatedAt: this.timestamp,
    });
  }

  delete<T>(ref: DocPredicate<T>) {
    return this.doc(ref).delete();
  }

  set<T>(ref: DocPredicate<T>, data: any) {
    const timestamp = this.timestamp;
    return this.doc(ref).set({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp,
    });
  }

  add<T>(ref: CollectionPredicate<T>, data) {
    const timestamp = this.timestamp;
    return this.col(ref).add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp,
    });
  }

  /* **************
    this.db.inspectDoc('notes/xyz');
    this.db.inspectCol('notes');
  * **************/
  inspectDoc(ref: DocPredicate<any>): void {
    const tick = new Date().getTime();
    this.doc(ref)
      .snapshotChanges()
      .pipe(
        take(1),
        tap((d) => {
          const tock = new Date().getTime() - tick;
          console.log(`Loaded Document in ${tock}ms`, d);
        })
      )
      .subscribe();
  }

  inspectCol(ref: CollectionPredicate<any>): void {
    const tick = new Date().getTime();
    this.col(ref)
      .snapshotChanges()
      .pipe(
        take(1),
        tap((c) => {
          const tock = new Date().getTime() - tick;
          console.log(`Loaded Collection in ${tock}ms`, c);
        })
      )
      .subscribe();
  }

  // returns a document references mapped to AngularFirestoreDocument
  docWithRefs$<T>(ref: DocPredicate<T>) {
    return this.doc$(ref).pipe(
      map((doc) => {
        for (const k of Object.keys(doc)) {
          if (doc[k] instanceof firebase.firestore.DocumentReference) {
            doc[k] = this.doc(doc[k].path);
          }
        }
        return doc;
      })
    );
  }

  // batch
  batch(updates: any, type: string) {
    const batch = firebase.firestore().batch();
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        const path = key;
        const data = updates[key];
        const ref = firebase.firestore().doc(path);
        switch (type) {
          case 'set':
            batch.set(ref, {
              ...data,
            });
            console.log('batch set: ' + path);
            break;
          case 'delete':
            batch.delete(ref);
            console.log('batch delete: ' + path);
            break;
        }
      }
    }
    return batch.commit();
  }
}
