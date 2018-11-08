export const sortBy = (array, key, order) =>
    array.sort((a, b) => {
        const x = a[key], y = b[key];
        if (order === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        } else if (order === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    })

export const groupBy = (array, grouper, aggregator) =>
    array.reduce((res, obj) => {
        if (!(obj[grouper] in res)) {
            res.__array.push((res[obj[grouper]] = obj));
        } else {
            res[obj[grouper]][aggregator] += obj[aggregator];
        }
        return res;
    },
        { __array: [] }
    ).__array.sort((a, b) => b[aggregator] - a[aggregator])
