import {Node} from 'prosemirror-model';
import {EditorView} from 'prosemirror-view';
import {updateColumnsOnResize} from 'prosemirror-tables';

const TableView = function TableView(node, cellMinWidth) {
  this.node = node;
  this.cellMinWidth = cellMinWidth;
  this.dom = document.createElement('div');
  this.dom.className = 'tableWrapper';
  this.table = this.dom.appendChild(document.createElement('table'));
  this.colgroup = this.table.appendChild(document.createElement('colgroup'));
  updateColumnsOnResize(node, this.colgroup, this.table, cellMinWidth);
  this.contentDOM = this.table.appendChild(document.createElement('tbody'));
};

TableView.prototype.update = function update(node) {
  if (node.type != this.node.type) {
    return false;
  }
  this.node = node;
  updateColumnsOnResize(node, this.colgroup, this.table, this.cellMinWidth);
  return true;
};

TableView.prototype.ignoreMutation = function ignoreMutation(record) {
  return (
    record.type == 'attributes' &&
    (record.target == this.table || this.colgroup.contains(record.target))
  );
};

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
