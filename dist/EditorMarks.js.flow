import {Schema} from 'prosemirror-model';

import CodeMarkSpec from './CodeMarkSpec';
import DocNodeSpec from './DocNodeSpec';
import EMMarkSpec from './EMMarkSpec';
import FontSizeMarkSpec from './FontSizeMarkSpec';
import FontTypeMarkSpec from './FontTypeMarkSpec';
import LinkMarkSpec from './LinkMarkSpec';
import * as MarkNames from './MarkNames';
import {DOC, PARAGRAPH, TEXT} from './NodeNames';
import ParagraphNodeSpec from './ParagraphNodeSpec';
import SpacerMarkSpec from './SpacerMarkSpec';
import StrikeMarkSpec from './StrikeMarkSpec';
import StrongMarkSpec from './StrongMarkSpec';
import TextColorMarkSpec from './TextColorMarkSpec';
import TextHighlightMarkSpec from './TextHighlightMarkSpec';
import TextNoWrapMarkSpec from './TextNoWrapMarkSpec';
import TextNodeSpec from './TextNodeSpec';
import TextSelectionMarkSpec from './TextSelectionMarkSpec';
import TextSuperMarkSpec from './TextSuperMarkSpec';
import TextUnderlineMarkSpec from './TextUnderlineMarkSpec';

const {
  MARK_CODE,
  MARK_EM,
  MARK_FONT_SIZE,
  MARK_FONT_TYPE,
  MARK_LINK,
  MARK_NO_BREAK,
  MARK_STRIKE,
  MARK_STRONG,
  MARK_SUPER,
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_TEXT_SELECTION,
  MARK_UNDERLINE,
  MARK_SPACER,
} = MarkNames;

// These nodes are required to build basic marks.
const nodes = {
  [DOC]: DocNodeSpec,
  [PARAGRAPH]: ParagraphNodeSpec,
  [TEXT]: TextNodeSpec,
};

const marks = {
  [MARK_CODE]: CodeMarkSpec,
  [MARK_EM]: EMMarkSpec,
  [MARK_FONT_SIZE]: FontSizeMarkSpec,
  [MARK_FONT_TYPE]: FontTypeMarkSpec,
  [MARK_LINK]: LinkMarkSpec,
  [MARK_SPACER]: SpacerMarkSpec,
  [MARK_STRIKE]: StrikeMarkSpec,
  [MARK_STRONG]: StrongMarkSpec,
  [MARK_SUPER]: TextSuperMarkSpec,
  [MARK_TEXT_COLOR]: TextColorMarkSpec,
  [MARK_TEXT_HIGHLIGHT]: TextHighlightMarkSpec,
  [MARK_TEXT_SELECTION]: TextSelectionMarkSpec,
  [MARK_UNDERLINE]: TextUnderlineMarkSpec,
  [MARK_NO_BREAK]: TextNoWrapMarkSpec,
};

const schema = new Schema({nodes, marks});

const EditorMarks = schema.spec.marks;

export default EditorMarks;
