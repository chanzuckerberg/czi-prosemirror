// @flow

declare module 'prosemirror' {

  declare type NodeSpec = {
    content: string,
    group?: ?string,
    parseDOM: Array<any>,
    toDOM: () => Array<any>,
  };
}
