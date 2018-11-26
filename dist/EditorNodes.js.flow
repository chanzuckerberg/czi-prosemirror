// @flow

import * as NodeNames from './NodeNames';
import * as ProsemirrorTables from 'prosemirror-tables';
import BlockquoteNodeSpec from './BlockquoteNodeSpec';
import BulletListNodeSpec from './BulletListNodeSpec';
import CodeBlockNodeSpec from './CodeBlockNodeSpec';
import DocNodeSpec from './DocNodeSpec';
import HardBreakNodeSpec from './HardBreakNodeSpec';
import HeadingNodeSpec from './HeadingNodeSpec';
import HorizontalRuleNodeSpec from './HorizontalRuleNodeSpec';
import ImageNodeSpec from './ImageNodeSpec';
import ListItemNodeSpec from './ListItemNodeSpec';
import OrderedListNodeSpec from './OrderedListNodeSpec';
import BodyNodeSpec from './BodyNodeSpec';
import ParagraphNodeSpec from './ParagraphNodeSpec';
import TableNodesSpecs from './TableNodesSpecs';
import TextNodeSpec from './TextNodeSpec';
import {Schema} from 'prosemirror-model';

const {
  BLOCKQUOTE,
  BULLET_LIST,
  CODE_BLOCK,
  DOC,
  HARD_BREAK,
  HEADING,
  HORIZONTAL_RULE,
  IMAGE,
  LIST_ITEM,
  ORDERED_LIST,
  BODY,
  PARAGRAPH,
  TEXT,
} = NodeNames;

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js

// Be careful with the order of these nodes, which may effect the parsing
// outcome.
const nodes = {
  [DOC]: DocNodeSpec,
  [BODY]: BodyNodeSpec,

  [PARAGRAPH]: ParagraphNodeSpec,
  [BLOCKQUOTE]: BlockquoteNodeSpec,
  [HORIZONTAL_RULE]: HorizontalRuleNodeSpec,
  [HEADING]: HeadingNodeSpec,
  [CODE_BLOCK]: CodeBlockNodeSpec,
  [TEXT]: TextNodeSpec,
  [IMAGE]: ImageNodeSpec,
  [HARD_BREAK]: HardBreakNodeSpec,

  [BULLET_LIST]: BulletListNodeSpec,
  [ORDERED_LIST]: OrderedListNodeSpec,
  [LIST_ITEM]: ListItemNodeSpec,
};

const marks = {};
const schema = new Schema({nodes, marks});

const EditorNodes = schema.spec.nodes.append(TableNodesSpecs);

export default EditorNodes;
