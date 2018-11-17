
import * as MarkNames from './MarkNames';
import FontSizeMarkSpec from './FontSizeMarkSpec';
import FontTypeMarkSpec from './FontTypeMarkSpec';
import LinkMarkSpec from './LinkMarkSpec';
import StrikeMarkSpec from './StrikeMarkSpec';
import TextColorMarkSpec from './TextColorMarkSpec';
import TextHighlightMarkSpec from './TextHighlightMarkSpec';
import TextSelectionMarkSpec from './TextSelectionMarkSpec';
import TextUnderlineMarkSpec from './TextUnderlineMarkSpec';
import {Schema} from 'prosemirror-model';
import {schema} from 'prosemirror-schema-basic';

const {
  MARK_FONT_SIZE,
  MARK_FONT_TYPE,
  MARK_LINK,
  MARK_STRIKE,
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_TEXT_SELECTION,
  MARK_UNDERLINE,
} = MarkNames;

const EditorMarks = schema.spec.marks.append({
  [MARK_FONT_SIZE]: FontSizeMarkSpec,
  [MARK_FONT_TYPE]: FontTypeMarkSpec,
  [MARK_STRIKE]: StrikeMarkSpec,
  [MARK_TEXT_COLOR]: TextColorMarkSpec,
  [MARK_TEXT_HIGHLIGHT]: TextHighlightMarkSpec,
  [MARK_TEXT_SELECTION]: TextSelectionMarkSpec,
  [MARK_UNDERLINE]: TextUnderlineMarkSpec,
}).update(MARK_LINK, LinkMarkSpec);

export default EditorMarks;
