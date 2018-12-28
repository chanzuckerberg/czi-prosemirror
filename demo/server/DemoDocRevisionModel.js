// @node-only
const createModelClass = require('./createModelClass');

const DemoDocRevisionModel = createModelClass({
  confirmed: false,
  doc_id: '',
  version: 0,
});

module.exports = DemoDocRevisionModel;