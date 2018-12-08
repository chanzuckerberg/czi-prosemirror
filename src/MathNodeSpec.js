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
    return ['span', node.attrs];
  },
};

export default MathNodeSpec;
