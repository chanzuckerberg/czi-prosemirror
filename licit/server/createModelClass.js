// @flow

import invariant from 'invariant';

import * as assertion from './assertion';

export default function createModelClass(spec: Object): Function {
  assertion.object(spec, 'model.spec');

  const models: Array<Model> = [];

  const modelSpec = Object.assign({
    created_at: 0,
    updated_at: 0,
  }, spec);

  let index = 0;

  function findBy(predict: (m: Model) => any): ?Model {
    purge();
    let found: any = null;
    models.some((model) => {
      if (predict(model)) {
        found = model;
      }
      return !!found;
    });
    return found;
  };

  function find(id: any): ?Model {
    purge();
    assertion.present(id, 'Model.find(id)');
    const model = findBy(x => x.id === id);
    assertion.present(model, 'Model.find(id)');
    return model;
  };

  function where(predict: (m: Model) => any): Array<Model> {
    purge();
    return models.reduce((results, model) => {
      if (predict(model)) {
        results.push(model);
      }
      return results;
    }, []);
  };

  function insert(model: Model): Model {
    const id = model.id;
    assertion.present(id, 'model.id');
    const predict = (m) => m.id === id;
    invariant(findBy(predict) === null, 'duplicated model ' + id);
    models.push(model);
    Model.size = models.length;
    return model;
  };

  function purge() {
    // Need this so we don't kill the Licit server with too much memory
    // consumption
    if (models.length > 5000) {
      const t24hous = 24 * 60 * 60 * 1000;
      const now = Date.now();
      let model: Object = models[0];
      while (model) {
        if ((now - model.updated_at) > t24hous) {
          models.shift();
        }
        model = models[0];
      }
    }
    if (models.length > 5000) {
      // purge the first 2000 models.
      models.splice(0, 2000);
    }
  }


  function create(payload: ?Object): Model {
    payload = payload || {};
    payload.id = payload.id || index++;
    const model = new Model(payload);
    insert(model);
    return model;
  }

  function findOrCreate(
    predict: (x: Model) => any,
    createPayload: () => ?Object
  ): Model {
    let model = findBy(predict);
    if (!model) {
      model = create(createPayload());
    }
    return model;
  };

  class Model {
    id: any;

    static size = 0;
    static create = create;
    static find = find;
    static findBy = findBy;
    static where = where;
    static findOrCreate = findOrCreate;

    constructor(payload: ?Object) {
      const model: Object = this;
      model.created_at = Date.now();
      model.updated_at = Date.now();
      model.update = this.update.bind(this);
      payload && Object.assign(model, payload);
      this.validate();
    }

    validate = (): Model => {
      const model: Object = this;
      Object.keys(modelSpec).forEach(key => {
        const specValue = modelSpec[key];
        if (specValue !== null && specValue !== undefined) {
          assertion.present(model[key], 'validate:' + key);
        }
      });
      return this;
    };

    update = (payload: ?Object): Model => {
      const model: Object = this;
      payload && Object.assign(model, payload);
      model.updated_at = Date.now();
      this.validate();
      return this;
    };

    toJSON(): Object {
      const model: Object = this;
      const json = {};
      Object.keys(model).forEach(key => {
        const val = model[key];
        json[key] = (val === undefined ? null : val);
      });
      return json;
    }
  }

  return Model;
}