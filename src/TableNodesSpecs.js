// @flow

import {tableNodes} from 'prosemirror-tables';


const TableNodesSpecs = tableNodes({
  // https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    background: {
      default: null,
      // TODO: Move these to a table helper.
      getFromDOM(dom) {
        return dom.style.backgroundColor || null;
      },
      setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + `background-color: ${value};`;
        }
      },
    },
  },
});

export default TableNodesSpecs;
