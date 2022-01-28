import { AngularFirestore } from 'angularfire2/firestore';
import { combineLatest, defer, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

// usage => .pipe(leftJoinDocument(afs, 'user', 'users'))

export const leftJoinDocument =
  (afs: AngularFirestore, fieldToJoin, collection) =>
  <T>(source: Observable<T[]>) =>
    defer(() => {
      // Operator state
      let collectionData;
      const cache = new Map();

      return source.pipe(
        switchMap((data) => {
          // Clear mapping on each emitted val ;
          cache.clear();

          // Save the parent data state
          collectionData = data as any[];

          const reads$ = [];
          let i = 0;
          for (const doc of collectionData) {
            // Skip if doc field does not exist or is already in cache
            if (!doc[fieldToJoin] || cache.get(doc[fieldToJoin])) {
              continue;
            }

            // Push doc read to Array
            reads$.push(
              afs.collection(collection).doc(doc[fieldToJoin]).valueChanges()
            );
            cache.set(doc[fieldToJoin], i);
            i++;
          }

          return reads$.length ? combineLatest(reads$) : of([]);
        }),
        map((joins) => {
          return collectionData.map((v, i) => {
            const joinIndex = cache.get(v[fieldToJoin]);
            return { ...v, [fieldToJoin]: joins[joinIndex] || null };
          });
        })
        // tap(final =>
        //     console.log(
        //         `Queried ${(final as any).length}, Joined ${cache.size} docs`
        //     )
        // )
      );
    });
