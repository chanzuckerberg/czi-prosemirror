// @flow

import {Node} from 'prosemirror-model';
import {Step, StepResult, Mappable} from 'prosemirror-transform';

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

  // [FS] IRAD-1010 2020-07-27
  // Handle map properly so that undo works correctly for document attritube changes.  
  map(mapping: Mappable): ?SetDocAttrStep {
    var from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
    if (from.deleted && to.deleted) { return null }
    return new SetDocAttrStep(this.key, this.value, 'SetDocAttr');
  }

  merge(other: SetDocAttrStep): ?SetDocAttrStep {
    if (other instanceof SetDocAttrStep &&
        other.mark.eq(this.mark) &&
        this.from <= other.to && this.to >= other.from)
      { return new SetDocAttrStep(this.key, this.value, 'SetDocAttr') }
  }

  toJSON(): SetDocAttrStepJSONValue {
    return {
      stepType: this.stepType,
      key: this.key,
      value: this.value,
    };
  }

  static fromJSON(schema:any, json: SetDocAttrStepJSONValue) {
    return new SetDocAttrStep(json.key, json.value, json.stepType);
  }
}

// [FS-AFQ][13-MAR-2020][IRAD-899]
// Register this step so that capcomode can be dealt collaboratively.
Step.jsonID("SetDocAttr", SetDocAttrStep);

export default SetDocAttrStep;
