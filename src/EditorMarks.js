
import * as MarkNames from './MarkNames';
import TextColorMarkSpec from './TextColorMarkSpec';
import TextHighlightMarkSpec from './TextHighlightMarkSpec';
import TextSelectionMarkSpec from './TextSelectionMarkSpec';
import {Schema} from 'prosemirror-model';
import {schema} from 'prosemirror-schema-basic';

const {
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_TEXT_SELECTION,
} = MarkNames;

const EditorMarks = schema.spec.marks.append({
  [MARK_TEXT_COLOR]: TextColorMarkSpec,
  [MARK_TEXT_HIGHLIGHT]: TextHighlightMarkSpec,
  [MARK_TEXT_SELECTION]: TextSelectionMarkSpec,
});

export default EditorMarks;
