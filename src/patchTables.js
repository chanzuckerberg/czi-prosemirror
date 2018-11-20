// @flow

export default function patchTables(doc: Document): void {
  Array.from(doc.querySelectorAll('td')).forEach(patchTableCell);
}

// Workaround to patch HTML from Google Doc that Table Cells will apply
// its background colr to all its inner <span />.
function patchTableCell(tdElement: HTMLElement): void {
  const {style} = tdElement;
  if (!style) {
    return;
  }
  const {backgroundColor} = style;
  if (!backgroundColor) {
    return;
  }
  const selector = 'span[style^=background-color]';
  const spans = Array.from(tdElement.querySelectorAll(selector));
  spans.some(spanElement => {
    const spanStyle = spanElement.style;
    if (spanStyle && spanStyle.backgroundColor === backgroundColor) {
      spanStyle.backgroundColor = '';
    }
  });
}
