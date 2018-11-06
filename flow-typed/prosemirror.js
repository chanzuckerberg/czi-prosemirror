// @flow

declare module 'prosemirror' {
  declare type NodeSpec = {
    content: string,
    group?: ?string,
    parseDOM: Array<any>,
    toDOM: () => Array<any>,
  };

  declare type MarkSpec = {
    attrs: {[key: string]: string},
    parseDOM: Array<any>,
    toDOM: (node: any) => Array<any>,
  };
}
