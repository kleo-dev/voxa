export type StringMap<T> = {
  [key: string]: T;
};

export function narrow<T>(s: T, defd: T, ...allowed: T[]): T {
    if (allowed.includes(s) || s == defd) {
        return s;
    } else {
        return defd;
    }
}