// @flow

import {Schema} from 'prosemirror-model';
import {DOMParser} from 'prosemirror-model';
import {EditorState} from 'prosemirror-state';
import {Plugin} from 'prosemirror-state';

import {getAttrs} from './DocNodeSpec';
import EditorPlugins from './EditorPlugins';
import EditorSchema from './EditorSchema';

export default function convertFromDOMElement(
  el: HTMLElement,
  schema: ?Schema,
  plugins: ?Array<Plugin>
): EditorState {
  const effectiveSchema = schema || EditorSchema;
  const effectivePlugins = plugins || EditorPlugins;
  const bodyEl = el.querySelector('body');

  // https://prosemirror.net/docs/ref/#model.ParseOptions.preserveWhitespace
  const doc = DOMParser.fromSchema(effectiveSchema).parse(el, {
    preserveWhitespace: true,
  });

  if (bodyEl) {
    // Unfortunately the root node `doc` does not supoort `parseDOM`, thus
    // we'd have to assign its `attrs` manually.
    doc.attrs = getAttrs(bodyEl);
  }

  return EditorState.create({
    doc,
    plugins: effectivePlugins,
  });
}
