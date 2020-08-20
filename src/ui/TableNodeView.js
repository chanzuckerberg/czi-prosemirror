import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { TableView } from 'prosemirror-tables';

// A custom table view that renders the margin-left style.
export default class TableNodeView extends TableView {
  constructor(node: Node, colMinWidth: number, view: EditorView) {
    super(node, colMinWidth, view);
    this._updateMargin(node);
  }
  update(node: Node): boolean {
    const updated = super.update(node);
    if (updated) {
      this._updateMargin(node);
    }
    return updated;
  }
  _updateMargin(node: Node): void {
    const marginLeft = (node.attrs && node.attrs.marginLeft) || 0;
    this.table.style.marginLeft = marginLeft ? `${marginLeft}px` : '';
  }
}
