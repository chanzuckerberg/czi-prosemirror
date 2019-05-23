// @flow

import {Node} from 'prosemirror-model';

import {
  DOM_ATTRIBUTE_PAGE_BREAK,
} from './PageBreakNodeSpec';

function getAttrs(dom: HTMLElement) {
  if (
    dom.getAttribute(DOM_ATTRIBUTE_PAGE_BREAK) ||
    dom.style.pageBreakBefore === 'always'
  ) {
    // Google Doc exports page break as HTML:
    // `<hr style="page-break-before:always;display:none; />`.
    // These <hr> elements are parsed by PageBreakNodeSpec.
    return false;
  }
}

const HorizontalRuleNode = {
  group: 'block',

  parseDOM: [{tag: 'hr', getAttrs}],

  toDOM(node: Node): Array<any> {
    const domAttrs = {};
    if (node.attrs.pageBreak) {
      domAttrs[DOM_ATTRIBUTE_PAGE_BREAK] = 'true';
    }
    return ['hr', domAttrs];
  },
};

export default HorizontalRuleNode;
