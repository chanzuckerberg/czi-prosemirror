// @flow

import React from 'react';

export type NodeSpec = {
  attrs?: ?{[key: string]: any},
  content?: ?string,
  draggable?: ?boolean,
  group?: ?string,
  inline?: ?boolean,
  parseDOM?: ?Array<any>,
  toDOM?: ?(node: any) => Array<any>,
};

export type MarkSpec = {
  attrs?: ?{[key: string]: any},
  parseDOM: Array<any>,
  toDOM: (node: any) => Array<any>,
};

export type EditorProps = {
  // TODO: Fill the interface.
  // https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
};

export type DirectEditorProps = EditorProps & {
  // TODO: Fill the interface.
  // https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
};

export type RenderCommentProps = {
  commentThreadId: string,
  isActive: boolean,
  requestCommentThreadDeletion: Function,
  requestCommentThreadReflow: Function,
};

export type ImageLike = {
  height: number,
  id: string,
  src: string,
  width: number,
};

export type EditorRuntime = {
  // Image Proxy
  canProxyImageSrc?: (src: string) => boolean,
  getProxyImageSrc?: (src: string) => string,

  // Image Upload
  canUploadImage?: () => boolean;
  uploadImage?: (obj: Blob) => Promise<ImageLike>,

  // Comments
  canComment?: () => boolean,
  createCommentThreadID?: () => string,
  renderComment?: (props: RenderCommentProps) => ?React.Element<any>,

  // External HTML
  canLoadHTML?: () => boolean;
  loadHTML?: () => Promise<?string>,
};

export type EditorState = any;
