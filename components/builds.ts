import { name } from 'components/name';

const buldify = (items: number[]): any[] => items.map(num => ({dmg: num, name: name()}));

export const D = buldify([4, ]);
export const XB = buldify([1, 1, 1, 3, 8]).concat([{name: name(), "effect": 'x2'}]);
export const XT =  buldify([1, 1, 2, 6, 6, +2]).concat([{name: name(), "effect": '+2'}]);

