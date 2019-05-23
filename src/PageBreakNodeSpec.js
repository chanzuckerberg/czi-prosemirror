// @flow

import {Node} from 'prosemirror-model';

export const DOM_ATTRIBUTE_PAGE_BREAK = 'data-page-break';

function getAttrs(dom: HTMLElement) {
  if (
    !dom.getAttribute(DOM_ATTRIBUTE_PAGE_BREAK) &&
    !dom.style.pageBreakBefore === 'always'
  ) {
    // Google Doc exports page break as HTML:
    // `<hr style="page-break-before:always;display:none; />`.
    return false;
  }
}

const PageBreakNodeSpec = {
  group: 'block',
  parseDOM: [{tag: 'hr', getAttrs}],
  toDOM(node: Node): Array<any> {
    return [
      'div',
      {
        DOM_ATTRIBUTE_PAGE_BREAK: true,
      },
    ];
  },
};

export default PageBreakNodeSpec;
