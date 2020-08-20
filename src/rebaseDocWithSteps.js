// @flow

import {Step} from 'prosemirror-transform';
import EditorSchema from './EditorSchema';

// [FS-AFQ][13-MAR-2020][IRAD-899]
// This is Capcomode. Shared Step, so that capcomode can be dealt collaboratively.
import SetDocAttrStep from './SetDocAttrStep';

type RebaseResult = {
  docJSON: Object,
  stepsJSON: Array<Object>,
};

export default function rebaseDocWithSteps(
  clientID: string,
  docJSON: Object,
  stepsJSON: Array<Object>,
): Promise<RebaseResult> {
  return new Promise((resolve, reject) => {
    // TODO: Move this into a separate server request.
    let docNode = EditorSchema.nodeFromJSON(docJSON);

    const steps = stepsJSON.map(step => {
      const result = Step.fromJSON(EditorSchema, step);
      result.clientID = clientID;
      return result;
    });

    steps.forEach(step => {
      const result = step.apply(docNode);
      docNode = result.doc;
    });

    const newDocJSON = docNode.toJSON();

    const newStepsJSON = steps.map(step => {
      return step.toJSON();
    });

    resolve({
      docJSON: newDocJSON,
      stepsJSON: newStepsJSON,
    });
  });
}