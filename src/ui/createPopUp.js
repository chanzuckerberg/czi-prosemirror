// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid/v1';

type PopUpProps = {
  View: Function,
  onClose: Function,
  viewProps: {
    autoDismiss?: ?boolean,
    position: 'right' | null,
    target: string | HTMLElement,
  },
};

export type PopUpHandle = {
  update: (props: Object) => void,
  dispose: Function,
};

function mapToHTMLElement(obj: any): ?HTMLElement {
  if (typeof obj === 'string') {
    return document.getElementById(obj);
  } else if (obj instanceof HTMLElement) {
    return obj;
  }
  return null;
}

class PopUp extends React.PureComponent {

  props: PopUpProps;

  _id = uuid();
  _rafId = NaN;
  _transform = '';
  _unmounted = false;

  render(): React.Element<any> {
    const {View, viewProps, onClose} = this.props;
    const {autoDismiss, target, position, ...restProps} = viewProps;
    return (
      <div data-pop-up-id={this._id} id={this._id}>
        <View
          {...restProps}
          onClose={onClose}
        />
      </div>
    );
  }

  componentDidMount(): void {
    this._syncPosition();
    document.addEventListener('click', this._onDucumentClick, false);
  }

  componentWillUnmount(): void {
    this._unmounted = true;
    this._rafId && cancelAnimationFrame(this._rafId);
    document.removeEventListener('click', this._onDucumentClick, false);
  }

  _onDucumentClick = (e: Event): void => {
    const {autoDismiss, target} = this.props.viewProps;
    const {onClose} = this.props;
    if (!autoDismiss) {
      return;
    }
    const targetEl = mapToHTMLElement(target);
    const popUpEl = mapToHTMLElement(this._id);
    if (targetEl && popUpEl) {
      const clicked: any = e.target;
      if (
        targetEl === clicked ||
        popUpEl === clicked ||
        targetEl.contains(clicked) ||
        popUpEl.contains(clicked)
      ) {
        return;
      }
    }
    onClose();
  };

  _syncPosition = (): void => {
    this._rafId && cancelAnimationFrame(this._rafId);
    this._rafId = requestAnimationFrame(this._requestPosition);
  };

  _requestPosition = (): void => {
    this._rafId = 0;
    const {target} = this.props.viewProps;
    const targetEl = mapToHTMLElement(target);
    const popUpEl = mapToHTMLElement(this._id);
    if (targetEl && popUpEl) {
      this._moveToElement(targetEl, popUpEl);
      this._syncPosition();
    } else if (!this._unmounted) {
      throw new Error(`Unable to find PopUp elements`);
    }
  };

  _moveToElement(targetEl: HTMLElement, popUpEl: HTMLElement): void {
    const {onClose} = this.props;
    const {position} = this.props.viewProps;
    const targetRect = targetEl.getBoundingClientRect();
    let x = 0;
    let y = 0;
    const w = targetRect.width;
    const h = targetRect.height;
    if (!w && !h) {
      const body = document.body;
      if (!body || !body.contains(targetEl)) {
        onClose();
        return;
      }
    }
    if (position === 'right') {
      x = Math.round(targetRect.left + w);
      y = Math.round(targetRect.top);
    } else {
      x = Math.round(targetRect.left);
      y = Math.round(targetRect.top + h);
    }

    const transform = `translate(${x}px, ${y}px)`;
    if (transform !== this._transform) {
      this._transform = transform;
      popUpEl.style.transform = transform;
    }
  }
}

function getRootElement(id: string, forceCreation: boolean): ?HTMLElement {
  const root: any = document.body || document.documentElement;
  let element = mapToHTMLElement(id);
  if (!element && forceCreation) {
    element = document.createElement('div');
  }

  if (!element) {
    return null;
  }

  element.style.cssText = `position: fixed; top: 0; left: 0; z-index: 99999`;
  element.id = id;
  // Populates the default ARIA attributes here.
  // http://accessibility.athena-ict.com/aria/examples/dialog.shtml
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  if (!element.parentElement) {
    root.appendChild(element);
  }
  return element;
}

function renderPopUp(rootId: string, popUpProps: PopUpProps): void {
  const rootNode = getRootElement(rootId, true);
  if (rootNode) {
    const component = <PopUp {...popUpProps} />;
    ReactDOM.render(component, rootNode);
  }
}

function unrenderPopUp(rootId: string): void {
  const rootNode = getRootElement(rootId, false);
  if (rootNode) {
    ReactDOM.unmountComponentAtNode(rootNode);
    rootNode.parentElement && rootNode.parentElement.removeChild(rootNode);
  }
}

export default function createPopUp(
  View: Function,
  viewProps: Object,
): PopUpHandle {
  const rootId = uuid();

  let dismissed = false;
  let onClose = viewProps.onClose;

  const dispose = () => {
    if (dismissed) {
      return;
    }
    dismissed = true;
    unrenderPopUp(rootId);
    onClose && onClose();
  };

  renderPopUp(rootId, {
    View,
    onClose: dispose,
    viewProps,
  });

  return {
    dispose: dispose,
    update: (nextViewProps) => {
      onClose = nextViewProps.onClose;
      renderPopUp(rootId, {
        View,
        onClose: dispose,
        viewProps: nextViewProps,
      });
    },
  };
}
