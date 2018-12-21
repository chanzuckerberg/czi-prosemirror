// @flow

import {tableNodes} from 'prosemirror-tables';

import toHexColor from './ui/toHexColor';

const TableNodesSpecs = tableNodes({
  // https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    borderColor: {
      default: null,
      getFromDOM(dom) {
        const {borderColor} = dom.style;
        return (borderColor && toHexColor(borderColor)) || null;
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
