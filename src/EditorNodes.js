// @flow

import * as NodeNames from './NodeNames';
import * as ProsemirrorTables from 'prosemirror-tables';
import BulletListNodeSpec from './BulletListNodeSpec';
import HeadingNodeSpec from './HeadingNodeSpec';
import ImageNodeSpec from './ImageNodeSpec';
import ListItemNodeSpec from './ListItemNodeSpec';
import OrderedListNodeSpec from './OrderedListNodeSpec';
import ParagraphNodeSpec from './ParagraphNodeSpec';
import TableNodesSpecs from './TableNodesSpecs';
import {schema} from 'prosemirror-schema-basic';

const {
  BULLET_LIST,
  HEADING,
  IMAGE,
  LIST_ITEM,
  ORDERED_LIST,
  PARAGRAPH,
} = NodeNames;

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js

const EditorNodes = schema.spec.nodes
  .update(HEADING, HeadingNodeSpec)
  .update(IMAGE, ImageNodeSpec)
  .update(PARAGRAPH, ParagraphNodeSpec)
  .append({
    [BULLET_LIST]: BulletListNodeSpec,
    [LIST_ITEM]: ListItemNodeSpec,
    [ORDERED_LIST]: OrderedListNodeSpec,
  })
  .append(TableNodesSpecs);

export default EditorNodes;
