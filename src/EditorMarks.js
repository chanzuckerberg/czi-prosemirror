
import {DOC, PARAGRAPH, TEXT} from './NodeNames';
import DocNodeSpec from './DocNodeSpec';

import * as MarkNames from './MarkNames';
import CodeMarkSpec from './CodeMarkSpec';
import EMMarkSpec from './EMMarkSpec';
import FontSizeMarkSpec from './FontSizeMarkSpec';
import FontTypeMarkSpec from './FontTypeMarkSpec';
import LinkMarkSpec from './LinkMarkSpec';
import StrikeMarkSpec from './StrikeMarkSpec';
import StrongMarkSpec from './StrongMarkSpec';
import TextColorMarkSpec from './TextColorMarkSpec';
import TextHighlightMarkSpec from './TextHighlightMarkSpec';
import TextNodeSpec from './TextNodeSpec';
import TextSelectionMarkSpec from './TextSelectionMarkSpec';
import TextUnderlineMarkSpec from './TextUnderlineMarkSpec';
import {Schema} from 'prosemirror-model';
import ParagraphNodeSpec from './ParagraphNodeSpec';

const {
  MARK_CODE,
  MARK_EM,
  MARK_FONT_SIZE,
  MARK_FONT_TYPE,
  MARK_LINK,
  MARK_STRIKE,
  MARK_STRONG,
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_TEXT_SELECTION,
  MARK_UNDERLINE,
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
  [MARK_STRIKE]: StrikeMarkSpec,
  [MARK_STRONG]: StrikeMarkSpec,
  [MARK_TEXT_COLOR]: TextColorMarkSpec,
  [MARK_TEXT_HIGHLIGHT]: TextHighlightMarkSpec,
  [MARK_TEXT_SELECTION]: TextSelectionMarkSpec,
  [MARK_UNDERLINE]: TextUnderlineMarkSpec,
};

const schema = new Schema({nodes, marks});

const EditorMarks = schema.spec.marks;

export default EditorMarks;
