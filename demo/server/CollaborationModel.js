// @node-only

const createModelClass = require('./createModelClass');

// https://github.com/ProseMirror/website/blob/cc2ca367baa12af1f1c01d5b3f941bad04bf3607/src/collab/server/instance.js
const CollaborationModel = createModelClass({
  doc_id: 0,
  doc_json: {},
  lastActive: 0,
  steps: [],
  version: 0,
  waiting: [],
});

module.exports = CollaborationModel;