// @flow

declare module 'prosemirror' {

  declare type NodeSpec = {
    name: string,
    content: string,
    group?: ?string,
    parseDOM: Array<any>,
    toDOM: () => Array<any>,
  };
}
