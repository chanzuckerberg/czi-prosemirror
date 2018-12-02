'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


// https://github.com/mathquill/mathquill/blob/23a0e88c80c79514ffc30ead490bd880306bce2a/src/commands/math/basicSymbols.js
// http://math.chapman.edu/~jipsen/mathquill/test/MathQuillsymbolsMathJax.html
// https://inspera.atlassian.net/wiki/spaces/KB/pages/62062830/MathQuill+symbols

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_MathQuillEditorSymbol', {
  value: require('prop-types').shape({
    label: require('prop-types').string.isRequired,
    latex: require('prop-types').string.isRequired,
    description: require('prop-types').string.isRequired,
    cmd: require('prop-types').string.isRequired
  })
});
var ABSOLUTE = { 'label': '|x|', 'latex': '|', 'description': 'Absolute Value', 'cmd': 'cmd' };
var ANGLE = { 'label': '\\angle', 'latex': '\\angle', 'description': 'Angle', 'cmd': 'write' };
var APPROX = { 'label': '\\approx', 'latex': '\\approx', 'description': 'Approx', 'cmd': 'cmd' };
var ARCCOS = { 'label': '\\arccos', 'latex': '\\arccos', 'description': 'Arc Cos', 'cmd': 'write' };
var ARCSIN = { 'label': '\\arcsin', 'latex': '\\arcsin', 'description': 'Arc Sin', 'cmd': 'write' };
var ARCTAN = { 'label': '\\arctan', 'latex': '\\arctan', 'description': 'Arc Tan', 'cmd': 'write' };
var BRACKETS = { 'label': '[x]', 'latex': '[', 'description': 'Brackets', 'cmd': 'cmd' };
var CENT = { 'label': '¢', 'latex': '¢', 'description': 'Cent', 'cmd': 'write' };
var COS = { 'label': '\\cos', 'latex': '\\cos', 'description': 'Cos', 'cmd': 'write' };
var DEGREES = { 'label': '\\deg', 'latex': '\\deg', 'description': 'Degrees', 'cmd': 'write' };
var DIVIDE = { 'label': '\xF7', 'latex': '\\divide', 'description': 'Division', 'cmd': 'cmd' };
var DOLLAR = { 'label': '$', 'latex': '$', 'description': 'Dollar', 'cmd': 'write' };
var EQUAL = { 'label': '=', 'latex': '=', 'description': 'Equal', 'cmd': 'cmd' };
var EXPONENT = { 'label': 'x^{2}', 'latex': '^{2}', 'description': 'Exponent', 'cmd': 'write' };
var FRAC = { 'label': '\\frac {x}{y}', 'latex': '\\frac', 'description': 'Fraction', 'cmd': 'cmd' };
var GT = { 'label': '>', 'latex': '>', 'description': 'Greater Than', 'cmd': 'cmd' };
var GTE = { 'label': '\\ge', 'latex': '\\ge', 'description': 'Greater Than or Equal To', 'cmd': 'cmd' };
var IMAGINARY = { 'label': 'i', 'latex': 'i', 'description': 'Imaginary Number', 'cmd': 'write' };
var INFINITY = { 'label': '\\infty', 'latex': '\\infty', 'description': 'Infinity', 'cmd': 'write' };
var INT = { 'label': '\\int', 'latex': '\\int', 'description': 'Integral', 'cmd': 'cmd' };
var INT01 = { 'label': '\\int_{0}^{1}', 'latex': '\\int_{0}^{1}', 'description': 'Integral', 'cmd': 'write' };
var LT = { 'label': '<', 'latex': '<', 'description': 'Less Than', 'cmd': 'cmd' };
var LTE = { 'label': '\\le', 'latex': 'le', 'description': 'Less Than or Equal To', 'cmd': 'cmd' };
var MINUS = { 'label': '-', 'latex': '-', 'description': 'Subtraction', 'cmd': 'cmd' };
var OVERLINE = { 'label': '\\overline{over}', 'latex': '\\overline{over}', 'description': 'Overline', 'cmd': 'write' };
var PARENS = { 'label': '(x)', 'latex': '(', 'description': 'Parentheses', 'cmd': 'cmd' };
var PHI = { 'label': '\\phi', 'latex': '\\phi', 'description': 'Phi', 'cmd': 'write' };
var PI = { 'label': '\\pi', 'latex': '\\pi', 'description': 'Pi', 'cmd': 'write' };
var PLUS = { 'label': '+', 'latex': '+', 'description': 'Addition', 'cmd': 'cmd' };
var PM = { 'label': '\\pm', 'latex': '\\pm', 'description': 'Plus-Minus', 'cmd': 'cmd' };
var SIN = { 'label': '\\sin', 'latex': '\\sin', 'description': 'Sin', 'cmd': 'write' };
var SQRT2 = { 'label': '\\sqrt[x]{y}', 'latex': '\\sqrt[x]{y}', 'description': 'Square Root Alt', 'cmd': 'write' };
var SQRT = { 'label': '\\sqrt x', 'latex': '\\sqrt', 'description': 'Square Root', 'cmd': 'cmd' };
var SUBSCRIPT = { 'label': 'x_{2}', 'latex': '_{2}', 'description': 'Subscript', 'cmd': 'write' };
var SUM = { 'label': '\\sum', 'latex': '\\sum', 'description': 'Summation', 'cmd': 'cmd' };
var SUPERSCRIPT = { 'label': 'x^{super}', 'latex': '^{super}', 'description': 'Exponent', 'cmd': 'write' };
var TAN = { 'label': '\\tan', 'latex': '\\tan', 'description': 'Tan', 'cmd': 'write' };
var THETA = { 'label': '\\theta', 'latex': '\\theta', 'description': 'Theta', 'cmd': 'write' };
var TIMES = { 'label': '\\times', 'latex': '\\times', 'description': 'Multiplication', 'cmd': 'cmd' };
var TRIANGLE = { 'label': '\\bigtriangleup', 'latex': '\\bigtriangleup', 'description': 'Triangle', 'cmd': 'write' };
var X = { 'label': 'x', 'latex': 'x', 'description': 'x', 'cmd': 'write' };
var Y = { 'label': 'y', 'latex': 'y', 'description': 'y', 'cmd': 'write' };

var OPERATORS = exports.OPERATORS = {
  title: 'Operators',
  symbols: [PLUS, MINUS, TIMES, DIVIDE, EQUAL, PM, LT, GT, LTE, GTE]
};

var STRUCTURE = exports.STRUCTURE = {
  title: 'Structure',
  symbols: [SUM, FRAC, PARENS, BRACKETS, EXPONENT, SUBSCRIPT, ABSOLUTE, INT01]
};

var SYMBOLS = exports.SYMBOLS = {
  title: 'Symbols',
  symbols: [PI, SQRT, SQRT2, IMAGINARY, DEGREES, THETA, PHI]
};

var TRIG = exports.TRIG = {
  title: 'Trigonometry',
  symbols: [SIN, COS, TAN, ARCSIN, ARCCOS, ARCTAN]
};

var VARIABLES = exports.VARIABLES = {
  title: 'Variables',
  symbols: [X, Y]
};