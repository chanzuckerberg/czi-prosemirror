// @flow

import {EditorView} from 'prosemirror-view';

import convertToJSON from './convertToJSON';
import CustomEditorView from './ui/CustomEditorView';
import UICommand from './ui/UICommand';

const commandsRegistery = new Map<any, any>();
const viewsRegistery = new Map<any, any>();

// This file exports methods to help developer to debug editor from web
// inspector. To use this, add the following lines to export the utility.
//
//   import * as CZIProseMirror from 'czi-prosemirror/dist/CZIProseMirror';
//   window.CZIProseMirror = CZIProseMirror;

export function registeryKeys(): Array<string> {
  return Array.from(viewsRegistery.keys());
}

export function exportJSON(id: ?string): Object {
  if (!id && viewsRegistery.size) {
    id = registeryKeys()[0];
    console.log(`use default editor id "${id}"`);
  }
  const view = viewsRegistery.get(String(id));
  if (!view) {
    throw new Error('view ${id} does not exist');
  }
  return convertToJSON(view.state);
}

export function registerEditorView(id: string, view: EditorView): void {
  if (viewsRegistery.has(id)) {
    throw new Error('view ${id} already registered');
  }
  if (!(view instanceof CustomEditorView)) {
    throw new Error(`invalid view ${id}`);
  }
  if (!id) {
    throw new Error('id is required');
  }
  viewsRegistery.set(id, view);
}

export function releaseEditorView(id: string): void {
  if (!viewsRegistery.has(id)) {
    throw new Error('view ${id} was released');
  }
  viewsRegistery.delete(id);
}

export function findEditorView(id: string): ?EditorView {
  return viewsRegistery.get(id) || null;
}

export function executeCommand(name: string, viewID: ?string): boolean {
  const command = commandsRegistery.get(name);
  if (command) {
    const view = viewID
      ? viewsRegistery.get(viewID)
      : Array.from(viewsRegistery.values())[0];
    if (view) {
      try {
        return command.execute(view.state, view.dispatch, view, null);
      } catch (ex) {
        console.warn(ex);
        return false;
      }
    }
  }
  return false;
}

export function registerCommand(name: string, command: UICommand): void {
  if (!(command instanceof UICommand)) {
    throw new Error(`invalid command ${name}`);
  }
  if (!name) {
    throw new Error('invalid command name');
  }
  if (commandsRegistery.has(name)) {
    throw new Error('command ${name} already registered');
  }
  commandsRegistery.set(name, command);
}
