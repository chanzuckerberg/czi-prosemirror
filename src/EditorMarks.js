
import * as MarkNames from './MarkNames';
import FontSizeMarkSpec from './FontSizeMarkSpec';
import FontTypeMarkSpec from './FontTypeMarkSpec';
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
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_TEXT_SELECTION,
  MARK_UNDERLINE,
  MARK_STRIKE,
} = MarkNames;

const EditorMarks = schema.spec.marks.append({
  [MARK_FONT_SIZE]: FontSizeMarkSpec,
  [MARK_FONT_TYPE]: FontTypeMarkSpec,
  [MARK_STRIKE]: StrikeMarkSpec,
  [MARK_TEXT_COLOR]: TextColorMarkSpec,
  [MARK_TEXT_HIGHLIGHT]: TextHighlightMarkSpec,
  [MARK_TEXT_SELECTION]: TextSelectionMarkSpec,
  [MARK_UNDERLINE]: TextUnderlineMarkSpec,
});

export default EditorMarks;
