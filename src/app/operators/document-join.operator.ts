import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, defer, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export const documentJoin =
  (afs: AngularFirestore, paths: { [key: string]: string }) =>
  <T>(source: Observable<T>) =>
    defer(() => {
      let parent;
      const keys = Object.keys(paths);

      return source.pipe(
        switchMap((data) => {
          // Save the parent data state
          parent = data;

          // Map each path to an Observable
          const docs$ = keys.map((k) => {
            const fullPath = `${paths[k]}/${parent[k]}`;
            return afs.doc(fullPath).valueChanges();
          });

          // return combineLatest, it waits for all reads to finish
          return combineLatest(docs$);
        }),
        map((arr) => {
          // We now have all the associated documents
          // Reduce them to a single object based on the parent's keys
          const joins = keys.reduce((acc, cur, idx) => {
            return { ...acc, [cur]: arr[idx] };
          }, {});

          // Return the parent doc with the joined objects
          return { ...parent, ...joins };
        })
      );
    });
