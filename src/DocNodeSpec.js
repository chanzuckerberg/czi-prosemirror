// @flow

import {IMAGE} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const DocNodeSpec = {
  content: 'block+',
};

export default DocNodeSpec;