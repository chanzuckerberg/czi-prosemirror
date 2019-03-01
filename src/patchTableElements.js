// @flow

import nullthrows from 'nullthrows';

import {PT_TO_PX_RATIO} from './convertToCSSPTValue';
import convertToCSSPTValue from './convertToCSSPTValue';
import toCSSColor from './ui/toCSSColor';

// This value is arbitrary. It assumes the page use the default size
// with default padding.
const DEFAULT_TABLE_WIDTH = 666; // 624;

// This value is originally defined at prosemirror-table.
const ATTRIBUTE_CELL_WIDTH = 'data-colwidth';

export default function patchTableElements(doc: Document): void {
  Array.from(doc.querySelectorAll('td')).forEach(patchTableCell);
  Array.from(doc.querySelectorAll('tr[style^=height]')).forEach(patchTableRow);
}

 // The height of each line: ~= 21px
const LINE_HEIGHT_PX_VALUE = 21;
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
    const tdBgColor = toCSSColor(backgroundColor);
    const selector = 'span[style*=background-color]';
    const spans = Array.from(tdElement.querySelectorAll(selector));
    spans.some(spanElement => {
      const spanStyle = spanElement.style;
      if (!spanStyle || !spanStyle.backgroundColor) {
        return;
      }
      const spanBgColor = toCSSColor(spanStyle.backgroundColor);
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
    const rowEl = nullthrows(tdElement.parentElement);
    tdElement.setAttribute(ATTRIBUTE_CELL_WIDTH, String(Math.floor(pxValue)));

    if (rowEl.lastElementChild === tdElement) {
      const cells = Array.from(rowEl.children);
      const tableWidth = cells.reduce((sum, td) => {
        const ww = parseInt(td.getAttribute(ATTRIBUTE_CELL_WIDTH), 10);
        sum += ww;
        return sum;
      }, 0);
      if (isNaN(tableWidth) || tableWidth <= DEFAULT_TABLE_WIDTH) {
        return;
      }
      const scale = DEFAULT_TABLE_WIDTH / tableWidth;
      cells.forEach(cell => {
        const ww = parseInt(cell.getAttribute(ATTRIBUTE_CELL_WIDTH), 10);
        cell.setAttribute(ATTRIBUTE_CELL_WIDTH, String(Math.floor(ww * scale)));
      });
    }
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

  const cellPxHeight = Array.from(firstCell.children).reduce((sum, childNode) => {
    return sum + getEstimatedPxHeight(childNode);
  }, 0);

  const cellPtHeight = convertToCSSPTValue(String(cellPxHeight) + 'px');
  if (cellPtHeight >= ptValue) {
    return;
  }

  let pElsNeeded = Math.round((ptValue - cellPtHeight) / LINE_HEIGHT_PT_VALUE);
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


function getEstimatedPxHeight(el: HTMLElement): number {
  const imgs = el.querySelectorAll('img');
  if (imgs.length) {
    return Array.from(imgs).reduce(
      (sum, nn) => {
        return sum + getEstimatedPxHeight(nn);
      },
      0,
    );
  }
  if (el.height) {
    return parseFloat(el.height) || LINE_HEIGHT_PX_VALUE;
  }
  if (el.style && el.style.height) {
    return convertToCSSPTValue(el.style.height) || LINE_HEIGHT_PX_VALUE;
  }
  return LINE_HEIGHT_PX_VALUE;
}