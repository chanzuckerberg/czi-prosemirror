// @flow

import type {NodeSpec} from './Types';

function getAttrs(dom: HTMLElement) {
  let align = dom.getAttribute('data-align') || dom.getAttribute('align');
  if (align) {
    align = /(left|right|center)/.test(align) ? align : null;
  }

  return {
    align,
    latex: dom.getAttribute('data-latex') || null,
  };
}

const MathNodeSpec: NodeSpec = {
  inline: true,
  attrs: {
    align: {default: null},
    latex: {default: ''},
  },
  group: 'inline',
  draggable: true,
  parseDOM: [
    {tag: 'math[data-latex]', getAttrs},
    {tag: 'span[data-latex]', getAttrs},
  ],
  toDOM(node) {
    // Normally, the DOM structure of the math node is rendered by
    // `MathNodeView`. This method is only called when user select the
    // math node and copy it, which triggers the "serialize to HTML" flow, and
    // this method will be called.
    const {align, latex} = node.attrs;
    const domAttrs = {};
    if (align) {
      domAttrs.align = align;
    }
    if (latex) {
      domAttrs['data-latex'] = latex;
    }
    return ['span', domAttrs];
  },
};

export default MathNodeSpec;
