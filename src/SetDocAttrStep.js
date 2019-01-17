// @flow

import {Node} from 'prosemirror-model';
import {Step, StepResult} from 'prosemirror-transform';

type SetDocAttrStepJSONValue = {
  key: string,
  stepType: string,
  value: any,
};

// https://discuss.prosemirror.net/t/changing-doc-attrs/784/17
class SetDocAttrStep extends Step {

  key: string;
  stepType: string;
  value: any;

  constructor(key: string, value: any, stepType?: string = 'SetDocAttr') {
    super();
    this.stepType = stepType;
    this.key = key;
    this.value = value;
  }

  apply(doc: Node): void {
    const attrs = {...doc.attrs};
    this.prevValue = attrs[this.key];
    attrs[this.key] = this.value;
    doc.attrs = attrs;
    return StepResult.ok(doc);
  }

  invert(): SetDocAttrStep {
    return new SetDocAttrStep(this.key, this.prevValue, 'revertSetDocAttr');
  }

  map(): ?Object {
    return null;
  }

  toJSON(): SetDocAttrStepJSONValue {
    return {
      stepType: this.stepType,
      key: this.key,
      value: this.value,
    };
  }

  static fromJSON(json: SetDocAttrStepJSONValue) {
    return new SetDocAttrStep(json.key, json.value, json.stepType);
  }
}

export default SetDocAttrStep;
