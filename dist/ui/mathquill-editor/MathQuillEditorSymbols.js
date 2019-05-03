'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_MathQuillEditorSymbol', {
  value: require('prop-types').shape({
    label: require('prop-types').string.isRequired,
    latex: require('prop-types').string.isRequired,
    description: require('prop-types').string.isRequired,
    cmd: require('prop-types').string.isRequired
  })
});


// It's hard to find a full list of latex symbols that we could use.
// Here's are some references that might be helpful.
// https://github.com/mathquill/mathquill/blob/23a0e88c80c79514ffc30ead490bd880306bce2a/src/commands/math/basicSymbols.js
// http://math.chapman.edu/~jipsen/mathquill/test/MathQuillsymbolsMathJax.html
// https://inspera.atlassian.net/wiki/spaces/KB/pages/62062830/MathQuill+symbols
// https://www.rapidtables.com/math/symbols/Basic_Math_Symbols.html
// https://www.math.uci.edu/~xiangwen/pdf/LaTeX-Math-Symbols.pdf

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_SymbolDefination', {
  value: require('prop-types').shape({
    label: require('prop-types').string.isRequired,
    latex: require('prop-types').string.isRequired,
    cmd: require('prop-types').oneOf(['cmd', 'write']).isRequired,
    description: require('prop-types').string.isRequired
  })
});
var ABSOLUTE = exports.ABSOLUTE = {
  label: '|x|',
  latex: '|',
  description: 'Absolute Value',
  cmd: 'cmd'
};
var ANGLE = exports.ANGLE = {
  label: '\\angle',
  latex: '\\angle',
  description: 'Angle',
  cmd: 'write'
};
var APPROX = exports.APPROX = {
  label: '\\approx',
  latex: '\\approx',
  description: 'Approximation',
  cmd: 'cmd'
};
var ARCCOS = exports.ARCCOS = {
  label: '\\arccos',
  latex: '\\arccos',
  description: 'Arc Cos',
  cmd: 'write'
};
var ARCSIN = exports.ARCSIN = {
  label: '\\arcsin',
  latex: '\\arcsin',
  description: 'Arc Sin',
  cmd: 'write'
};
var ARCTAN = exports.ARCTAN = {
  label: '\\arctan',
  latex: '\\arctan',
  description: 'Arc Tan',
  cmd: 'write'
};
var ARROWLL = exports.ARROWLL = {
  label: '\\Longleftarrow',
  latex: '\\Longleftarrow',
  description: 'Long Left Arrow',
  cmd: 'write'
};
var ARROWRL = exports.ARROWRL = {
  label: '\\Longrightarrow',
  latex: '\\Longrightarrow',
  description: 'Long Right Arrow',
  cmd: 'write'
};
var ARROWLLR = exports.ARROWLLR = {
  label: '\\Longleftrightarrow',
  latex: '\\Longleftrightarrow',
  description: 'Long Left Right Arrow',
  cmd: 'write'
};
var BRACKETS = exports.BRACKETS = {
  label: '[x]',
  latex: '[',
  description: 'Brackets',
  cmd: 'cmd'
};
var CENT = exports.CENT = { label: '¢', latex: '¢', description: 'Cent', cmd: 'write' };
var COS = exports.COS = {
  label: '\\cos',
  latex: '\\cos',
  description: 'Cos',
  cmd: 'write'
};
var CONG = exports.CONG = {
  label: '\\cong',
  latex: '\\cong',
  description: 'Congruent To',
  cmd: 'write'
};
var CTIMES = exports.CTIMES = {
  label: '\\otimes',
  latex: '\\otimes',
  description: 'Tensor Product',
  cmd: 'write'
};

var DEGREES = exports.DEGREES = {
  label: '\\deg',
  latex: '\\deg',
  description: 'Degrees',
  cmd: 'write'
};
var DIVIDE = exports.DIVIDE = {
  label: '\xF7',
  latex: '\\divide',
  description: 'Division',
  cmd: 'cmd'
};
var DOLLAR = exports.DOLLAR = {
  label: '$',
  latex: '$',
  description: 'Dollar',
  cmd: 'write'
};

var DOTM = exports.DOTM = {
  label: '\\cdot',
  latex: '\\cdot',
  description: 'Dot for Multiplication',
  cmd: 'write'
};

var EQUAL = exports.EQUAL = { label: '=', latex: '=', description: 'Equal', cmd: 'cmd' };
var FRAC = exports.FRAC = {
  label: '\\frac {x}{y}',
  latex: '\\frac',
  description: 'Fraction',
  cmd: 'cmd'
};
var GT = exports.GT = {
  label: '>',
  latex: '>',
  description: 'Greater Than',
  cmd: 'cmd'
};
var GTE = exports.GTE = {
  label: '\\ge',
  latex: '\\ge',
  description: 'Greater Than or Equal To',
  cmd: 'cmd'
};
var IMAGINARY = exports.IMAGINARY = {
  label: 'i',
  latex: 'i',
  description: 'Imaginary Number',
  cmd: 'write'
};
var INFINITY = exports.INFINITY = {
  label: '\\infty',
  latex: '\\infty',
  description: 'Infinity',
  cmd: 'write'
};
var INT = exports.INT = {
  label: '\\int',
  latex: '\\int',
  description: 'Integral',
  cmd: 'cmd'
};
var INTERSECT = exports.INTERSECT = {
  label: '\\cap',
  latex: '\\cap',
  description: 'Intersection',
  cmd: 'write'
};
var INTXY = exports.INTXY = {
  label: '\\int_{x}^{y}',
  latex: '\\int_{x}^{y}',
  description: 'Integral',
  cmd: 'write'
};
var LOG_E = exports.LOG_E = {
  label: '\\log',
  latex: '\\log',
  description: 'Log',
  cmd: 'cmd'
};
var LT = exports.LT = {
  label: '<',
  latex: '<',
  description: 'Less Than',
  cmd: 'cmd'
};
var LTE = exports.LTE = {
  label: '\\le',
  latex: 'le',
  description: 'Less Than or Equal To',
  cmd: 'cmd'
};
var MINUS = exports.MINUS = {
  label: '-',
  latex: '-',
  description: 'Subtraction',
  cmd: 'cmd'
};

var NEQ = exports.NEQ = {
  label: '\\neq',
  latex: '\\neq',
  description: 'Not Equal',
  cmd: 'write'
};

var OVERLINE = exports.OVERLINE = {
  label: '\\overline\u3000',
  latex: '\\overline',
  description: 'Overline',
  cmd: 'cmd'
};
var PARENS = exports.PARENS = {
  label: '(x)',
  latex: '(',
  description: 'Parentheses',
  cmd: 'cmd'
};
var PERP = exports.PERP = {
  label: '\\perp',
  latex: '\\perp',
  description: 'Perpendicular Lines',
  cmd: 'write'
};
var PHI = exports.PHI = {
  label: '\\phi',
  latex: '\\phi',
  description: 'Phi',
  cmd: 'write'
};
var PI = exports.PI = {
  label: '\\pi',
  latex: '\\pi',
  description: 'Pi',
  cmd: 'write'
};
var PLUS = exports.PLUS = {
  label: '+',
  latex: '+',
  description: 'Addition',
  cmd: 'cmd'
};
var PM = exports.PM = {
  label: '\\pm',
  latex: '\\pm',
  description: 'Plus-Minus',
  cmd: 'cmd'
};
var POWER = exports.POWER = {
  label: 'x^{y}',
  latex: '^',
  description: 'Power',
  cmd: 'cmd'
};
var SIMEQ = exports.SIMEQ = {
  label: '\\simeq',
  latex: '\\simeq',
  description: 'Approximately Equal',
  cmd: 'write'
};
var SIM = exports.SIM = {
  label: '\\sim',
  latex: '\\sim',
  description: 'Similarity',
  cmd: 'write'
};
var SIN = exports.SIN = {
  label: '\\sin',
  latex: '\\sin',
  description: 'Sin',
  cmd: 'write'
};
var SMALLE = exports.SMALLE = {
  label: '\u212F',
  latex: '\u212F',
  description: 'Script Small E',
  cmd: 'write'
};
var SQR = exports.SQR = {
  label: 'x^{2}',
  latex: '^{2}',
  description: 'Square',
  cmd: 'write'
};
var SQRT2 = exports.SQRT2 = {
  label: '\\sqrt[x]{y}',
  latex: '\\sqrt[x]{y}',
  description: 'Square Root Alt',
  cmd: 'write'
};
var SQRT = exports.SQRT = {
  label: '\\sqrt x',
  latex: '\\sqrt',
  description: 'Square Root',
  cmd: 'cmd'
};
var SUBSCRIPT = exports.SUBSCRIPT = {
  label: 'x_{2}',
  latex: '_{2}',
  description: 'Subscript',
  cmd: 'write'
};
var SUBSET = exports.SUBSET = {
  label: '\\sub',
  latex: '\\sub',
  description: 'Subset',
  cmd: 'write'
};
var SUBSETEQ = exports.SUBSETEQ = {
  label: '\\sube',
  latex: '\\sube',
  description: 'Subset or Equal',
  cmd: 'write'
};
var SUM = exports.SUM = {
  label: '\\sum',
  latex: '\\sum',
  description: 'Summation',
  cmd: 'cmd'
};
var SUPERSET = exports.SUPERSET = {
  label: '\\supset',
  latex: '\\supset',
  description: 'Superset',
  cmd: 'write'
};
var SUPERSETEQ = exports.SUPERSETEQ = {
  label: '\\supe',
  latex: '\\supe',
  description: 'Superset or Equal',
  cmd: 'write'
};
var TAN = exports.TAN = {
  label: '\\tan',
  latex: '\\tan',
  description: 'Tan',
  cmd: 'write'
};
var THETA = exports.THETA = {
  label: '\\theta',
  latex: '\\theta',
  description: 'Theta',
  cmd: 'write'
};
var TIMES = exports.TIMES = {
  label: '\\times',
  latex: '\\times',
  description: 'Multiplication',
  cmd: 'cmd'
};
var TRIANGLE = exports.TRIANGLE = {
  label: '\\bigtriangleup',
  latex: '\\bigtriangleup',
  description: 'Triangle',
  cmd: 'write'
};
var UNDERLINE = exports.UNDERLINE = {
  label: '\\underline\u3000',
  latex: '\\underline',
  description: 'Underline',
  cmd: 'cmd'
};
var UNION = exports.UNION = {
  label: '\\cup',
  latex: '\\cup',
  description: 'Union',
  cmd: 'write'
};
var VDASH = exports.VDASH = {
  label: '\\vdash',
  latex: '\\vdash',
  description: 'Vertical and Dash Line',
  cmd: 'write'
};
var VERT = exports.VERT = {
  label: '\\vert',
  latex: '\\vert',
  description: 'Vertical Line',
  cmd: 'write'
};
var OPERATORS = exports.OPERATORS = {
  title: 'Operators',
  symbols: [PLUS, MINUS, TIMES, DOTM, DIVIDE, EQUAL, APPROX, SIM, SIMEQ, CONG, NEQ, PM, LT, GT, LTE, GTE, UNION, INTERSECT, SUBSET, SUBSETEQ, SUPERSET, SUPERSETEQ, VERT, CTIMES]
};

var STRUCTURE = exports.STRUCTURE = {
  title: 'Structure',
  symbols: [SUM, FRAC, PARENS, BRACKETS, SQR, SUBSCRIPT, ABSOLUTE, INTXY, OVERLINE, UNDERLINE, POWER, INT, SQRT, SQRT2, LOG_E]
};

var SYMBOLS = exports.SYMBOLS = {
  title: 'Symbols',
  symbols: [SMALLE, ANGLE, PI, IMAGINARY, DEGREES, THETA, PHI, TRIANGLE, INFINITY, DOLLAR, CENT, VDASH, PERP, ARROWLL, ARROWRL, ARROWLLR]
};

var TRIG = exports.TRIG = {
  title: 'Trigonometry',
  symbols: [SIN, COS, TAN, ARCSIN, ARCCOS, ARCTAN]
};