// @flow

import './czi-mathquill-editor.css';
import React from 'react';
import Loadable from 'react-loadable';

class MathQuillEditorShimmer extends React.PureComponent {
  render() {
    return (
      <div className="czi-mathquill-editor">
        <div className="czi-mathquill-editor-main" />
        <div className="czi-mathquill-editor-side" />
      </div>
    );
  }
}

const MathQuillEditorLoadable = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "czi_prosemirror_mathquill_editor" */ './MathQuillEditor'
    ),
  loading: () => <MathQuillEditorShimmer />,
});

export default MathQuillEditorLoadable;
