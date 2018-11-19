// @flow

import {IMAGE} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const HR_DOM = ['hr'];

const HorizontalRuleNode = {
  group: 'block',
  parseDOM: [{tag: 'hr'}],
  toDOM() { return HR_DOM; }
};

export default HorizontalRuleNode;
