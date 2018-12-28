// @node-only

const invariant = require('invariant');

function number(val, name) {
  invariant(
    typeof val === 'number' && !isNaN(val),
    name + '(' + String(val) + ') is not a number',
  );
}

function present(val, name) {
  invariant(
    val !== null && val !== undefined && val !== '',
    name + '(' + String(val) + ') is not present',
  );
}

function object(val, name) {
  invariant(
    typeof val === 'object' && val !== null,
    name + '(' + String(val) + ') is not an Object',
  );
}

function array(val, name) {
  invariant(
    Array.isArray(val),
    name + '(' + String(val) + ') is not an Array',
  );
}

module.exports = {
  number,
  present,
  object,
  array,
};