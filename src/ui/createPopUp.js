// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid/v1';

type ViewProps = {
  autoDismiss?: ?boolean,
  onClose?: (val: any) => void,
  position?: 'right' | null,
  target: string | HTMLElement,
};

type PopUpProps = {
  View: Function,
  closePopUp: (val: any) => void,
  viewProps: ViewProps,
};

export type PopUpHandle = {
  update: (props: Object) => void,
  dispose: Function,
};

type Rect = {
  h: number,
  w: number,
  x: number,
  y: number,
};

function toRect(el: HTMLElement): Rect  {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    w: rect.width,
    h: rect.height,
  };
}

function isInRect(mx: number, my: number, rect: Rect): boolean {
  const padding = 2;
  return (
    (rect.w > 0) &&
    (rect.h > 0) &&
    (mx >= (rect.x - padding)) &&
    (mx <= (rect.x + rect.w + padding)) &&
    (my >= (rect.y - padding)) &&
    (my <= (rect.y + rect.h + padding ))
  );
}

class PopUpManager {

  _components = new Map();
  _transforms = new Map();
  _mx = 0;
  _my = 0;
  _rafID = 0;

  register(component): void {
    this._components.set(component, Date.now());
    this._transforms.set(component, null);
    if (this._components.size === 1) {
      this._observe();
    }
    this._rafID = requestAnimationFrame(this._syncPosition);
  }

  unregister(component): void {
    this._components.delete(component);
    this._transforms.delete(component);
    if (this._components.size === 0) {
      this._unobserve();
    }
    this._rafID && cancelAnimationFrame(this._rafID);
  }

  _observe(): void {
    document.addEventListener('mousemove', this._onMouseChange, false);
    document.addEventListener('mouseup', this._onMouseChange, false);
  }

  _unobserve(): void {
    document.removeEventListener('mousemove', this._onMouseChange, false);
    document.removeEventListener('mouseup', this._onMouseChange, false);
    this._rafID && cancelAnimationFrame(this._rafID);
  }

  _onMouseChange = (e: MouseEvent): void => {
    this._mx = e.clientX;
    this._my = e.clientY;
    this._rafID && cancelAnimationFrame(this._rafID);
    this._rafID = requestAnimationFrame(this._syncPosition);
  };

  _syncPosition = (): void => {
    this._rafID = 0;

    const bags = new Map();
    for (let [component, registeredAt] of this._components) {
      const {
        autoDismiss, element, target, closePopUp, position,
      } = component.getDetail();
      if (element && target) {
        bags.set(component, {
          autoDismiss,
          closePopUp,
          registeredAt,
          element,
          elementRect: toRect(element),
          position,
          target,
          targetRect: toRect(target),
        });
      } else {
        closePopUp();
      }
    }

    const callbacks = [];
    const now = Date.now();
    const mx = this._mx;
    const my = this._my;
    let hovered = false;
    for (let [component, obj] of bags) {
      const {
        elementRect, targetRect, position,
        element, closePopUp, registeredAt, autoDismiss,
      } = obj;
      let {x, y} = elementRect;
      if (position === 'right') {
        x = Math.round(targetRect.x + targetRect.w);
        y = Math.round(targetRect.y);
      } else {
        x = Math.round(targetRect.x);
        y = Math.round(targetRect.y + targetRect.h);
      }
      const transform = `translate(${x}px, ${y}px)`;
      if (element && this._transforms.get(component) !== transform) {
        this._transforms.set(component, transform);
        element.style.transform = transform;
        elementRect.x = x;
        elementRect.y = y;
      }
      if (!hovered) {
        hovered = isInRect(mx, my, targetRect) || isInRect(mx, my, elementRect);
      }
      if (!hovered && (now - registeredAt) > 500 && autoDismiss === true) {
        callbacks.push(closePopUp);
      }
    }
    if (!hovered) {
      callbacks.forEach(close => close());
    }
  };
}

function mapToHTMLElement(obj: any): ?HTMLElement {
  if (typeof obj === 'string') {
    return document.getElementById(obj);
  } else if (obj instanceof HTMLElement) {
    const {body} = document;
    return body && body.contains(obj) ? obj : null;
  }
  return null;
}

const popUpManager = new PopUpManager();

class PopUp extends React.PureComponent {

  props: PopUpProps;

  _id = uuid();
  _rafId = NaN;
  _transform = '';
  _unmounted = false;

  render(): React.Element<any> {
    const {View, viewProps, closePopUp} = this.props;
    const {autoDismiss, target, position, ...restProps} = viewProps;
    return (
      <div data-pop-up-id={this._id} id={this._id}>
        <View
          {...restProps}
          onClose={closePopUp}
        />
      </div>
    );
  }

  componentDidMount(): void {
    popUpManager.register(this);
  }

  componentWillUnmount(): void {
    popUpManager.unregister(this);
  }

  getDetail(): {
    autoDismiss: ?boolean,
    closePopUp: Function,
    element: ?HTMLElement,
    position: ?string,
    target: ?HTMLElement,
  } {
    const {closePopUp, viewProps} = this.props;
    const {autoDismiss, target, position} = viewProps;
    return {
      autoDismiss,
      closePopUp,
      element: mapToHTMLElement(this._id),
      position,
      target: mapToHTMLElement(target),
    };
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
  viewProps: ViewProps,
): PopUpHandle {
  const rootId = uuid();

  let dismissed = false;
  let onClose = viewProps.onClose;

  const closePopUp = (value) => {
    if (dismissed) {
      return;
    }
    dismissed = true;
    unrenderPopUp(rootId);
    onClose && onClose(value);
  };

  renderPopUp(rootId, {
    View,
    closePopUp,
    viewProps,
  });

  return {
    dispose: closePopUp,
    update: (nextViewProps) => {
      onClose = nextViewProps.onClose;
      renderPopUp(rootId, {
        View,
        closePopUp,
        viewProps: nextViewProps,
      });
    },
  };
}
