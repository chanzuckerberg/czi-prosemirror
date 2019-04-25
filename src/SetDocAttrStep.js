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
    this.prevValue = doc.attrs[this.key];
    const attrs = {
      ...doc.attrs,
      [this.key]: this.value,
    };
    const docNew = doc.type.create(attrs, doc.content, doc.marks);
    return StepResult.ok(docNew);
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
