import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { sortBy } from '../utils/utils';

export const sort = (iteratees, order) => <T>(source: Observable<T>) => {
    return source.pipe(map(collection => sortBy(collection, iteratees, order)));
}
