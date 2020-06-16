// @flow

import invariant from 'invariant';

export function number(val: any, name: string): void {
  invariant(
    typeof val === 'number' && !isNaN(val),
    name + '(' + String(val) + ') is not a number',
  );
}

export function present(val: any, name: string): void {
  invariant(
    val !== null && val !== undefined && val !== '',
    name + '(' + String(val) + ') is not present',
  );
}

export function object(val: any, name: string): void {
  invariant(
    typeof val === 'object' && val !== null,
    name + '(' + String(val) + ') is not an Object',
  );
}

export function array(val: any, name: string): void {
  invariant(
    Array.isArray(val),
    name + '(' + String(val) + ') is not an Array',
  );
}