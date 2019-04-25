// @flow

const BR_DOM = ['br'];

const HardBreakNodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{tag: 'br'}],
  toDOM() {
    return BR_DOM;
  },
};

export default HardBreakNodeSpec;
