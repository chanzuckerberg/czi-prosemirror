// @flow

export type MathQuillEditorSymbol = {
  label: string,
  latex: string,
  description: string,
  cmd: string,
};

// https://github.com/mathquill/mathquill/blob/23a0e88c80c79514ffc30ead490bd880306bce2a/src/commands/math/basicSymbols.js
// http://math.chapman.edu/~jipsen/mathquill/test/MathQuillsymbolsMathJax.html
// https://inspera.atlassian.net/wiki/spaces/KB/pages/62062830/MathQuill+symbols

const ABSOLUTE = {
  label: '|x|',
  latex: '|',
  description: 'Absolute Value',
  cmd: 'cmd',
};
const ANGLE = {
  label: '\\angle',
  latex: '\\angle',
  description: 'Angle',
  cmd: 'write',
};
const APPROX = {
  label: '\\approx',
  latex: '\\approx',
  description: 'Approx',
  cmd: 'cmd',
};
const ARCCOS = {
  label: '\\arccos',
  latex: '\\arccos',
  description: 'Arc Cos',
  cmd: 'write',
};
const ARCSIN = {
  label: '\\arcsin',
  latex: '\\arcsin',
  description: 'Arc Sin',
  cmd: 'write',
};
const ARCTAN = {
  label: '\\arctan',
  latex: '\\arctan',
  description: 'Arc Tan',
  cmd: 'write',
};
const BRACKETS = {
  label: '[x]',
  latex: '[',
  description: 'Brackets',
  cmd: 'cmd',
};
const CENT = {label: '¢', latex: '¢', description: 'Cent', cmd: 'write'};
const COS = {label: '\\cos', latex: '\\cos', description: 'Cos', cmd: 'write'};
const DEGREES = {
  label: '\\deg',
  latex: '\\deg',
  description: 'Degrees',
  cmd: 'write',
};
const DIVIDE = {
  label: '\u00F7',
  latex: '\\divide',
  description: 'Division',
  cmd: 'cmd',
};
const DOLLAR = {label: '$', latex: '$', description: 'Dollar', cmd: 'write'};
const EQUAL = {label: '=', latex: '=', description: 'Equal', cmd: 'cmd'};
const EXPONENT = {
  label: 'x^{2}',
  latex: '^{2}',
  description: 'Exponent',
  cmd: 'write',
};
const FRAC = {
  label: '\\frac {x}{y}',
  latex: '\\frac',
  description: 'Fraction',
  cmd: 'cmd',
};
const GT = {label: '>', latex: '>', description: 'Greater Than', cmd: 'cmd'};
const GTE = {
  label: '\\ge',
  latex: '\\ge',
  description: 'Greater Than or Equal To',
  cmd: 'cmd',
};
const IMAGINARY = {
  label: 'i',
  latex: 'i',
  description: 'Imaginary Number',
  cmd: 'write',
};
const INFINITY = {
  label: '\\infty',
  latex: '\\infty',
  description: 'Infinity',
  cmd: 'write',
};
const INT = {
  label: '\\int',
  latex: '\\int',
  description: 'Integral',
  cmd: 'cmd',
};
const INT01 = {
  label: '\\int_{0}^{1}',
  latex: '\\int_{0}^{1}',
  description: 'Integral',
  cmd: 'write',
};
const LT = {label: '<', latex: '<', description: 'Less Than', cmd: 'cmd'};
const LTE = {
  label: '\\le',
  latex: 'le',
  description: 'Less Than or Equal To',
  cmd: 'cmd',
};
const MINUS = {label: '-', latex: '-', description: 'Subtraction', cmd: 'cmd'};
const OVERLINE = {
  label: '\\overline{over}',
  latex: '\\overline{over}',
  description: 'Overline',
  cmd: 'write',
};
const PARENS = {
  label: '(x)',
  latex: '(',
  description: 'Parentheses',
  cmd: 'cmd',
};
const PHI = {label: '\\phi', latex: '\\phi', description: 'Phi', cmd: 'write'};
const PI = {label: '\\pi', latex: '\\pi', description: 'Pi', cmd: 'write'};
const PLUS = {label: '+', latex: '+', description: 'Addition', cmd: 'cmd'};
const PM = {
  label: '\\pm',
  latex: '\\pm',
  description: 'Plus-Minus',
  cmd: 'cmd',
};
const SIN = {label: '\\sin', latex: '\\sin', description: 'Sin', cmd: 'write'};
const SQRT2 = {
  label: '\\sqrt[x]{y}',
  latex: '\\sqrt[x]{y}',
  description: 'Square Root Alt',
  cmd: 'write',
};
const SQRT = {
  label: '\\sqrt x',
  latex: '\\sqrt',
  description: 'Square Root',
  cmd: 'cmd',
};
const SUBSCRIPT = {
  label: 'x_{2}',
  latex: '_{2}',
  description: 'Subscript',
  cmd: 'write',
};
const SUM = {
  label: '\\sum',
  latex: '\\sum',
  description: 'Summation',
  cmd: 'cmd',
};
const SUPERSCRIPT = {
  label: 'x^{super}',
  latex: '^{super}',
  description: 'Exponent',
  cmd: 'write',
};
const TAN = {label: '\\tan', latex: '\\tan', description: 'Tan', cmd: 'write'};
const THETA = {
  label: '\\theta',
  latex: '\\theta',
  description: 'Theta',
  cmd: 'write',
};
const TIMES = {
  label: '\\times',
  latex: '\\times',
  description: 'Multiplication',
  cmd: 'cmd',
};
const TRIANGLE = {
  label: '\\bigtriangleup',
  latex: '\\bigtriangleup',
  description: 'Triangle',
  cmd: 'write',
};
const X = {label: 'x', latex: 'x', description: 'x', cmd: 'write'};
const Y = {label: 'y', latex: 'y', description: 'y', cmd: 'write'};

export const OPERATORS = {
  title: 'Operators',
  symbols: [PLUS, MINUS, TIMES, DIVIDE, EQUAL, PM, LT, GT, LTE, GTE],
};

export const STRUCTURE = {
  title: 'Structure',
  symbols: [SUM, FRAC, PARENS, BRACKETS, EXPONENT, SUBSCRIPT, ABSOLUTE, INT01],
};

export const SYMBOLS = {
  title: 'Symbols',
  symbols: [PI, SQRT, SQRT2, IMAGINARY, DEGREES, THETA, PHI],
};

export const TRIG = {
  title: 'Trigonometry',
  symbols: [SIN, COS, TAN, ARCSIN, ARCCOS, ARCTAN],
};

export const VARIABLES = {
  title: 'Variables',
  symbols: [X, Y],
};

export const MISC = {
  title: 'Miscellaneous',
  symbols: [
    ANGLE,
    APPROX,
    CENT,
    DOLLAR,
    INFINITY,
    INT,
    OVERLINE,
    SUPERSCRIPT,
    TRIANGLE,
  ],
};
