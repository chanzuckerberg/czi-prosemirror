// @flow

import toCSSColor from './ui/toCSSColor';
import {Node} from 'prosemirror-model';
import {tableNodes} from 'prosemirror-tables';

const NO_VISIBLE_BORDER_WIDTH = new Set(['0pt', '0px']);

// https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
const TableNodesSpecs = tableNodes({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    borderColor: {
      default: null,
      getFromDOM(dom) {
        const {borderColor, borderWidth} = dom.style;

        if (NO_VISIBLE_BORDER_WIDTH.has(borderWidth)) {
          return 'transparent';
        }

        return (borderColor && toCSSColor(borderColor)) || null;
      },
      setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + `;border-color: ${value};`;
        }
      },
    },
    background: {
      default: null,
      // TODO: Move these to a table helper.
      getFromDOM(dom) {
        return dom.style.backgroundColor || null;
      },
      setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + `;background-color: ${value};`;
        }
      },
    },
  },
});

// Override the default table node spec to support custom attributes.
const TableNodeSpec = Object.assign({}, TableNodesSpecs.table, {
  attrs: {
    marginLeft: {default: null},
  },
  parseDOM: [
    {
      tag: 'table',
      getAttrs(dom: HTMLElement): ?Object {
        const {marginLeft} = dom.style;
        if (marginLeft && /\d+px/.test(marginLeft)) {
          return {marginLeft: parseFloat(marginLeft)};
        }
        return undefined;
      },
    },
  ],
  toDOM(node: Node): Array<any> {
    // Normally, the DOM structure of the table node is rendered by
    // `TableNodeView`. This method is only called when user selects a
    // table node and copies it, which triggers the "serialize to HTML" flow
    //  that calles this method.
    const {marginLeft} = node.attrs;
    const domAttrs = {};
    if (marginLeft) {
      domAttrs.style = `margin-left: ${marginLeft}px`;
    }
    return ['table', domAttrs, 0];
  },
});
Object.assign(TableNodesSpecs, {table: TableNodeSpec});

export default TableNodesSpecs;
