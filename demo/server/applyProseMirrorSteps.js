// @node-only

const {Step} = require('prosemirror-transform');
const EditorSchema = require('../../dist/EditorSchema');

function applyProseMirrorSteps(
  clientID,
  docID,
  docJSON,
  stepsJSON,
) {
  return new Promise((resolve, reject) => {
    // TODO: Move this into a separate server request.
    const schema = EditorSchema.default;
    let docNode = schema.nodeFromJSON(docJSON);

    const steps = stepsJSON.map(step => {
      const result = Step.fromJSON(schema, step);
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

module.exports = applyProseMirrorSteps;
