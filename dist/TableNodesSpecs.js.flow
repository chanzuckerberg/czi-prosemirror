// @flow

import {tableNodes} from 'prosemirror-tables';

import toCSSColor from './ui/toCSSColor';

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

export default TableNodesSpecs;
