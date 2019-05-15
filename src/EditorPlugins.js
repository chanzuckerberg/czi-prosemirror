// @flow

import EditorSchema from './EditorSchema';
import buildEditorPlugins from './buildEditorPlugins';

// Plugin
const EditorPlugins = buildEditorPlugins(EditorSchema);
export default EditorPlugins;
