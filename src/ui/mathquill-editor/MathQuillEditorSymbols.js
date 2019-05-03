// @flow

export type MathQuillEditorSymbol = {
  label: string,
  latex: string,
  description: string,
  cmd: string,
};

export type SymbolDefination = {
  // The label shown at the command button.
  label: string,
  // The latex to use
  latex: string,
  // The mathquill command to perform.
  // http://docs.mathquill.com/en/latest/Api_Methods/#writelatex_string
  // "write": Write the given LaTeX at the current cursor position. If the
  //   cursor does not have focus, writes to last position the cursor occupied
  //   in the editable field.
  // "cmd": Enter a LaTeX command at the current cursor position or with the
  //   current selection. If the cursor does not have focus, it writes it to
  //   last position the cursor occupied in the editable field.
  cmd: 'cmd' | 'write',
  // the description of the command.
  description: string,
};

// It's hard to find a full list of latex symbols that we could use.
// Here's are some references that might be helpful.
// https://github.com/mathquill/mathquill/blob/23a0e88c80c79514ffc30ead490bd880306bce2a/src/commands/math/basicSymbols.js
// http://math.chapman.edu/~jipsen/mathquill/test/MathQuillsymbolsMathJax.html
// https://inspera.atlassian.net/wiki/spaces/KB/pages/62062830/MathQuill+symbols
// https://www.rapidtables.com/math/symbols/Basic_Math_Symbols.html
// https://www.math.uci.edu/~xiangwen/pdf/LaTeX-Math-Symbols.pdf

export const ABSOLUTE = {
  label: '|x|',
  latex: '|',
  description: 'Absolute Value',
  cmd: 'cmd',
};
export const ANGLE = {
  label: '\\angle',
  latex: '\\angle',
  description: 'Angle',
  cmd: 'write',
};
export const APPROX = {
  label: '\\approx',
  latex: '\\approx',
  description: 'Approximation',
  cmd: 'cmd',
};
export const ARCCOS = {
  label: '\\arccos',
  latex: '\\arccos',
  description: 'Arc Cos',
  cmd: 'write',
};
export const ARCSIN = {
  label: '\\arcsin',
  latex: '\\arcsin',
  description: 'Arc Sin',
  cmd: 'write',
};
export const ARCTAN = {
  label: '\\arctan',
  latex: '\\arctan',
  description: 'Arc Tan',
  cmd: 'write',
};
export const ARROWLL = {
  label: '\\Longleftarrow',
  latex: '\\Longleftarrow',
  description: 'Long Left Arrow',
  cmd: 'write',
};
export const ARROWRL = {
  label: '\\Longrightarrow',
  latex: '\\Longrightarrow',
  description: 'Long Right Arrow',
  cmd: 'write',
};
export const ARROWLLR = {
  label: '\\Longleftrightarrow',
  latex: '\\Longleftrightarrow',
  description: 'Long Left Right Arrow',
  cmd: 'write',
};
export const BRACKETS = {
  label: '[x]',
  latex: '[',
  description: 'Brackets',
  cmd: 'cmd',
};
export const CENT = {label: '¢', latex: '¢', description: 'Cent', cmd: 'write'};
export const COS = {
  label: '\\cos',
  latex: '\\cos',
  description: 'Cos',
  cmd: 'write',
};
export const CONG = {
  label: '\\cong',
  latex: '\\cong',
  description: 'Congruent To',
  cmd: 'write',
};
export const CTIMES = {
  label: '\\otimes',
  latex: '\\otimes',
  description: 'Tensor Product',
  cmd: 'write',
};

export const DEGREES = {
  label: '\\deg',
  latex: '\\deg',
  description: 'Degrees',
  cmd: 'write',
};
export const DIVIDE = {
  label: '\u00F7',
  latex: '\\divide',
  description: 'Division',
  cmd: 'cmd',
};
export const DOLLAR = {
  label: '$',
  latex: '$',
  description: 'Dollar',
  cmd: 'write',
};

export const DOTM = {
  label: '\\cdot',
  latex: '\\cdot',
  description: 'Dot for Multiplication',
  cmd: 'write',
};

export const EQUAL = {label: '=', latex: '=', description: 'Equal', cmd: 'cmd'};
export const FRAC = {
  label: '\\frac {x}{y}',
  latex: '\\frac',
  description: 'Fraction',
  cmd: 'cmd',
};
export const GT = {
  label: '>',
  latex: '>',
  description: 'Greater Than',
  cmd: 'cmd',
};
export const GTE = {
  label: '\\ge',
  latex: '\\ge',
  description: 'Greater Than or Equal To',
  cmd: 'cmd',
};
export const IMAGINARY = {
  label: 'i',
  latex: 'i',
  description: 'Imaginary Number',
  cmd: 'write',
};
export const INFINITY = {
  label: '\\infty',
  latex: '\\infty',
  description: 'Infinity',
  cmd: 'write',
};
export const INT = {
  label: '\\int',
  latex: '\\int',
  description: 'Integral',
  cmd: 'cmd',
};
export const INTERSECT = {
  label: '\\cap',
  latex: '\\cap',
  description: 'Intersection',
  cmd: 'write',
};
export const INTXY = {
  label: '\\int_{x}^{y}',
  latex: '\\int_{x}^{y}',
  description: 'Integral',
  cmd: 'write',
};
export const LOG_E = {
  label: '\\log',
  latex: '\\log',
  description: 'Log',
  cmd: 'cmd',
};
export const LT = {
  label: '<',
  latex: '<',
  description: 'Less Than',
  cmd: 'cmd',
};
export const LTE = {
  label: '\\le',
  latex: 'le',
  description: 'Less Than or Equal To',
  cmd: 'cmd',
};
export const MINUS = {
  label: '-',
  latex: '-',
  description: 'Subtraction',
  cmd: 'cmd',
};

export const NEQ = {
  label: '\\neq',
  latex: '\\neq',
  description: 'Not Equal',
  cmd: 'write',
};

export const OVERLINE = {
  label: '\\overline\u3000',
  latex: '\\overline',
  description: 'Overline',
  cmd: 'cmd',
};
export const PARENS = {
  label: '(x)',
  latex: '(',
  description: 'Parentheses',
  cmd: 'cmd',
};
export const PERP = {
  label: '\\perp',
  latex: '\\perp',
  description: 'Perpendicular Lines',
  cmd: 'write',
};
export const PHI = {
  label: '\\phi',
  latex: '\\phi',
  description: 'Phi',
  cmd: 'write',
};
export const PI = {
  label: '\\pi',
  latex: '\\pi',
  description: 'Pi',
  cmd: 'write',
};
export const PLUS = {
  label: '+',
  latex: '+',
  description: 'Addition',
  cmd: 'cmd',
};
export const PM = {
  label: '\\pm',
  latex: '\\pm',
  description: 'Plus-Minus',
  cmd: 'cmd',
};
export const POWER = {
  label: 'x^{y}',
  latex: '^',
  description: 'Power',
  cmd: 'cmd',
};
export const SIMEQ = {
  label: '\\simeq',
  latex: '\\simeq',
  description: 'Approximately Equal',
  cmd: 'write',
};
export const SIM = {
  label: '\\sim',
  latex: '\\sim',
  description: 'Similarity',
  cmd: 'write',
};
export const SIN = {
  label: '\\sin',
  latex: '\\sin',
  description: 'Sin',
  cmd: 'write',
};
export const SQR = {
  label: 'x^{2}',
  latex: '^{2}',
  description: 'Square',
  cmd: 'write',
};
export const SQRT2 = {
  label: '\\sqrt[x]{y}',
  latex: '\\sqrt[x]{y}',
  description: 'Square Root Alt',
  cmd: 'write',
};
export const SQRT = {
  label: '\\sqrt x',
  latex: '\\sqrt',
  description: 'Square Root',
  cmd: 'cmd',
};
export const SUBSCRIPT = {
  label: 'x_{2}',
  latex: '_{2}',
  description: 'Subscript',
  cmd: 'write',
};
export const SUBSET = {
  label: '\\sub',
  latex: '\\sub',
  description: 'Subset',
  cmd: 'write',
};
export const SUBSETEQ = {
  label: '\\sube',
  latex: '\\sube',
  description: 'Subset or Equal',
  cmd: 'write',
};
export const SUM = {
  label: '\\sum',
  latex: '\\sum',
  description: 'Summation',
  cmd: 'cmd',
};
export const SUPERSET = {
  label: '\\supset',
  latex: '\\supset',
  description: 'Superset',
  cmd: 'write',
};
export const SUPERSETEQ = {
  label: '\\supe',
  latex: '\\supe',
  description: 'Superset or Equal',
  cmd: 'write',
};
export const TAN = {
  label: '\\tan',
  latex: '\\tan',
  description: 'Tan',
  cmd: 'write',
};
export const THETA = {
  label: '\\theta',
  latex: '\\theta',
  description: 'Theta',
  cmd: 'write',
};
export const TIMES = {
  label: '\\times',
  latex: '\\times',
  description: 'Multiplication',
  cmd: 'cmd',
};
export const TRIANGLE = {
  label: '\\bigtriangleup',
  latex: '\\bigtriangleup',
  description: 'Triangle',
  cmd: 'write',
};
export const UNDERLINE = {
  label: '\\underline\u3000',
  latex: '\\underline',
  description: 'Underline',
  cmd: 'cmd',
};
export const UNION = {
  label: '\\cup',
  latex: '\\cup',
  description: 'Union',
  cmd: 'write',
};
export const VDASH = {
  label: '\\vdash',
  latex: '\\vdash',
  description: 'Vertical and Dash Line',
  cmd: 'write',
};
export const VERT = {
  label: '\\vert',
  latex: '\\vert',
  description: 'Vertical Line',
  cmd: 'write',
};
export const OPERATORS = {
  title: 'Operators',
  symbols: [
    PLUS,
    MINUS,
    TIMES,
    DOTM,
    DIVIDE,
    EQUAL,
    APPROX,
    SIM,
    SIMEQ,
    CONG,
    NEQ,
    PM,
    LT,
    GT,
    LTE,
    GTE,
    UNION,
    INTERSECT,
    SUBSET,
    SUBSETEQ,
    SUPERSET,
    SUPERSETEQ,
    VERT,
    CTIMES,
  ],
};

export const STRUCTURE = {
  title: 'Structure',
  symbols: [
    SUM,
    FRAC,
    PARENS,
    BRACKETS,
    SQR,
    SUBSCRIPT,
    ABSOLUTE,
    INTXY,
    OVERLINE,
    UNDERLINE,
    POWER,
    INT,
    SQRT,
    SQRT2,
    LOG_E,
  ],
};

export const SYMBOLS = {
  title: 'Symbols',
  symbols: [
    ANGLE,
    PI,
    IMAGINARY,
    DEGREES,
    THETA,
    PHI,
    TRIANGLE,
    INFINITY,
    DOLLAR,
    CENT,
    VDASH,
    PERP,
    ARROWLL,
    ARROWRL,
    ARROWLLR,
  ],
};

export const TRIG = {
  title: 'Trigonometry',
  symbols: [SIN, COS, TAN, ARCSIN, ARCCOS, ARCTAN],
};
