// @flow
import cx from 'classnames';
import React from 'react';

import './czi-editor-frameset.css';

export type EditorFramesetProps  = {
  body:  ?React.Element<any>,
  className: ?string,
  embedded: ?boolean,
  header: ?React.Element<any>,
  header: ?React.Element<any>,
  height: ?(string | number),
  toolbar: ?React.Element<any>,
  toolbar: ?React.Element<any>,
  width: ?(string | number),
};

function toCSS(val: ?(number|string)): string {
  if (typeof val === 'number') {
    return val + 'px';
  }
  if (val === undefined || val === null) {
    return 'auto';
  }
  return String(val);
}

class EditorFrameset extends React.PureComponent<any, any, any> {

  props: EditorFramesetProps;

  render(): React.Element<any> {

    const {
      body,
      className,
      embedded,
      header,
      height,
      toolbar,
      width,
    } = this.props;

    const useFixedLayout = width !== undefined || height !== undefined;

    const mainClassName = cx(className, {
      'czi-editor-frameset': true,
      'with-fixed-layout': useFixedLayout,
      'embedded': embedded,
    });

    const mainStyle = {
      width: toCSS(width === undefined && useFixedLayout ? 'auto' : width),
      height: toCSS(height === undefined && useFixedLayout ? 'auto' : height),
    };

    return (
      <div className={mainClassName} style={mainStyle}>
        <div className="czi-editor-frame-main">
          <div className="czi-editor-frame-head">
            {header}
            {toolbar}
          </div>
          <div className="czi-editor-frame-body">
            <div className="czi-editor-frame-body-scroll">
              {body}
            </div>
          </div>
          <div className="czi-editor-frame-footer" />
        </div>
      </div>
    );
  }
}

export default EditorFrameset;