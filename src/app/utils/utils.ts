export const sortBy = (array: any, key: string, order: 'asc' | 'desc') =>
  array.sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
    const x = a[key],
      y = b[key];
    if (order === 'asc') {
      return x < y ? -1 : x > y ? 1 : 0;
    }

    return x > y ? -1 : x < y ? 1 : 0;
  });

export const groupBy = (array: any[], grouper: string, aggregator: string) =>
  array
    .reduce(
      (res, obj) => {
        if (!(obj[grouper] in res)) {
          res.__array.push((res[obj[grouper]] = obj));
        } else {
          res[obj[grouper]][aggregator] += obj[aggregator];
        }
        return res;
      },
      { __array: [] }
    )
    .__array.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) =>
        b[aggregator] - a[aggregator]
    );
