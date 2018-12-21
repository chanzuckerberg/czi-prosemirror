// @flow

import {PT_TO_PX_RATIO} from './convertToCSSPTValue';
import convertToCSSPTValue from './convertToCSSPTValue';
import toHexColor from './ui/toHexColor';

export default function patchTableElements(doc: Document): void {
  Array.from(doc.querySelectorAll('td')).forEach(patchTableCell);
  Array.from(doc.querySelectorAll('tr[style^=height]')).forEach(patchTableRow);
}

 // The height of each line: ~= 21px
const LINE_HEIGHT_PT_VALUE = 15.81149997;

// Workaround to patch HTML from Google Doc that Table Cells will apply
// its background colr to all its inner <span />.
function patchTableCell(tdElement: HTMLElement): void {
  const {style} = tdElement;
  if (!style) {
    return;
  }
  const {backgroundColor, width} = style;
  if (backgroundColor) {
    const tdBgColor = toHexColor(backgroundColor);
    const selector = 'span[style*=background-color]';
    const spans = Array.from(tdElement.querySelectorAll(selector));
    spans.some(spanElement => {
      const spanStyle = spanElement.style;
      if (!spanStyle || !spanStyle.backgroundColor) {
        return;
      }
      const spanBgColor = toHexColor(spanStyle.backgroundColor);
      if (spanBgColor === tdBgColor) {
        // The span has the same bg color as the cell does, erase its bg color.
        spanStyle.backgroundColor = '';
      }
    });
  }

  if (width) {
    const ptValue = convertToCSSPTValue(width);
    if (!ptValue) {
      return;
    }
    const pxValue = ptValue * PT_TO_PX_RATIO;
    // Attribute "data-colwidth" is defined at 'prosemirror-tables';
    tdElement.setAttribute('data-colwidth', String(Math.round(pxValue)));
  }
}

// Workaround to support "height" in table row by inject empty <p /> to
// create space for the height.
function patchTableRow(trElement: HTMLElement): void {
  const doc = trElement.ownerDocument;
  if (!doc) {
    return;
  }
  const height = trElement.style.height;
  if (!height) {
    return;
  }
  const firstCell = trElement.querySelector('td, th');
  if (!firstCell) {
    return;
  }
  const ptValue = convertToCSSPTValue(height);
  if (!ptValue) {
    return;
  }

  const pEls = firstCell.querySelectorAll('p');
  const heightNeeded = ptValue - (LINE_HEIGHT_PT_VALUE * pEls.length);
  if (heightNeeded < 0) {
    return;
  }
  let pElsNeeded = Math.round(heightNeeded / LINE_HEIGHT_PT_VALUE);
  if (pElsNeeded <= 0) {
    return;
  }
  const frag = doc.createDocumentFragment();
  const line = doc.createElement('p');
  while (pElsNeeded > 0) {
    pElsNeeded--;
    frag.appendChild(line.cloneNode(false));
  }
  firstCell.appendChild(frag);
}
