// @flow

import * as NodeNames from './NodeNames';
import * as ProsemirrorTables from 'prosemirror-tables';
import BulletListNodeSpec from './BulletListNodeSpec';
import EditorMarks from './EditorMarks';
import ImageNodeSpec from './ImageNodeSpec';
import ListItemNodeSpec from './ListItemNodeSpec';
import OrderedListNodeSpec from './OrderedListNodeSpec';
import {Schema} from 'prosemirror-model';
import {schema} from 'prosemirror-schema-basic';

const {
  tableNodes,
} = ProsemirrorTables;

const {
  BULLET_LIST,
  HEADING,
  IMAGE,
  LIST_ITEM,
  ORDERED_LIST,
  PARAGRAPH,
} = NodeNames;

const nodes = schema.spec.nodes
  .update(IMAGE, ImageNodeSpec)
  .append({
    [BULLET_LIST]: BulletListNodeSpec,
    [LIST_ITEM]: ListItemNodeSpec,
    [ORDERED_LIST]: OrderedListNodeSpec,
  })
  .append(tableNodes({
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
  }));

const EditorSchema = new Schema({
  nodes,
  marks: EditorMarks,
});

export default EditorSchema;
