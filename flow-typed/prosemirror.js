// @flow

declare module 'prosemirror' {
  declare type NodeSpec = {
    attrs?: ?{[key: string]: any},
    content?: ?string,
    draggable?: ?boolean,
    group?: ?string,
    inline?: ?boolean,
    parseDOM?: ?Array<any>,
    toDOM?: ?(node: any) => Array<any>,
  };

  declare type MarkSpec = {
    attrs?: ?{[key: string]: any},
    parseDOM: Array<any>,
    toDOM: (node: any) => Array<any>,
  };

  declare type EditorProps = {
    // TODO: Fill the interface.
    // https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
  };

  declare type DirectEditorProps = EditorProps & {
    // TODO: Fill the interface.
    // https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
  };
}
