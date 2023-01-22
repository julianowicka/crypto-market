export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export type Order = 'asc' | 'desc';

type ComparatorReturnType<Key extends string> = (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number

export const getComparator = <Key extends string>(
    order: Order,
    orderBy: Key,
): ComparatorReturnType<Key> => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}