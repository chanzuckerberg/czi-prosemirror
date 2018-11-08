// @flow

declare module 'prosemirror' {
  declare type NodeSpec = {
    attrs?: ?{[key: string]: any},
    content?: ?string,
    draggable?: boolean,
    group?: ?string,
    inline?: boolean,
    parseDOM: Array<any>,
    toDOM: (node: any) => Array<any>,
  };

  declare type MarkSpec = {
    attrs: {[key: string]: any},
    parseDOM: Array<any>,
    toDOM: (node: any) => Array<any>,
  };
}
