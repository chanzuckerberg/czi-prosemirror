// @flow

import * as NodeNames from './NodeNames';
import * as ProsemirrorTables from 'prosemirror-tables';
import BulletListNodeSpec from './BulletListNodeSpec';
import ImageNodeSpec from './ImageNodeSpec';
import ListItemNodeSpec from './ListItemNodeSpec';
import OrderedListNodeSpec from './OrderedListNodeSpec';
import {schema} from 'prosemirror-schema-basic';

import TableNodesSpecs from './TableNodesSpecs';

const {
  BULLET_LIST,
  HEADING,
  IMAGE,
  LIST_ITEM,
  ORDERED_LIST,
  PARAGRAPH,
} = NodeNames;

const EditorNodes = schema.spec.nodes
  .update(IMAGE, ImageNodeSpec)
  .append({
    [BULLET_LIST]: BulletListNodeSpec,
    [LIST_ITEM]: ListItemNodeSpec,
    [ORDERED_LIST]: OrderedListNodeSpec,
  })
  .append(TableNodesSpecs);

export default EditorNodes;
