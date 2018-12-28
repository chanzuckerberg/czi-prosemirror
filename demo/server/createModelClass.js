// @node-only

const assertion = require('./assertion');
const invariant = require('invariant');

function createModelClass(spec) {
  assertion.object(spec, 'model.spec');

  const models = [];
  const modelSpec = Object.assign({
    created_at: 0,
    updated_at: 0,
  }, spec);

  let index = 0;

  class Model {
    constructor(payload) {
      this.created_at = Date.now();
      this.updated_at = Date.now();
      this.update = this.update.bind(this);
      this.validate = this.validate.bind(this);
      payload && Object.assign(this, payload);
      this.validate();
    }

    validate() {
      // const model = this;
      // Object.keys(modelSpec).forEach(key => {
      //   assertion.present(model[key], 'validate:' + key);
      // });
    }

    update(payload) {
      payload && Object.assign(this, payload);
      this.updated_at = Date.now();
      this.validate();
    }

    toJSON() {
      const model = this;
      const json = {};
      Object.keys(model).forEach(key => {
        const val = model[key];
        json[key] = (val === undefined ? null : val);
      });
      return json;
    }
  }

  Model.size = 0;

  Model.find = (id) => {
    assertion.present(id, 'Model.find(id)');
    const model = Model.findBy(x => x.id === id);
    assertion.present(model, 'Model.find(id)');
    return model;
  };

  Model.findBy = (predict) => {
    let found = null;
    models.some((model) => {
      if (predict(model)) {
        found = model;
      }
    });
    return found;
  };

  Model.where = (predict) => {
    return models.reduce((results, model) => {
      if (predict(model)) {
        results.push(model);
      }
      return results;
    }, []);
  };

  Model.insert = (model) => {
    const id = model.id;
    assertion.present(id, 'model.id');
    const predict = (m) => m.id === id;
    invariant(Model.findBy(predict) === null, 'duplicated model ' + id);
    models.push(model);
    Model.size = models.length;
    return model;
  };

  Model.create = (payload) => {
    payload = payload || {};
    payload.id = payload.id || index++;
    const model = new Model(payload);

    Model.insert(model);
    return model;
  };

  Model.findOrCreate = (findBy, createPayload) => {
    let model = Model.findBy(findBy);
    if (!model) {
      model = Model.create(createPayload());
    }
    return model;
  };



  return Model;
}

module.exports = createModelClass;
