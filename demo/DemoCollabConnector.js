// @flow

import invariant from 'invariant';
import nullthrows from 'nullthrows';
import {receiveTransaction, sendableSteps} from 'prosemirror-collab';
import {EditorState} from 'prosemirror-state';
import {Step, Transform} from 'prosemirror-transform';
import ReactDOM from 'react-dom';

import convertToJSON from '../src/convertToJSON';
import uuid from '../src/ui/uuid';
import EditorConnection from './EditorConnection';
import Reporter from './Reporter';

type IdStrict = number;

type ReactSetStateCall = (
  state: {editorState: EditorState},
  callback: Function,
) => void;


class DemoCollabConnector {
  _clientID: string;
  _connected: boolean;
  _connection: any;
  _docID: IdStrict;
  _editorState: EditorState;
  _setState: ReactSetStateCall;
  _stepKeys: Object;

  constructor(
    editorState: EditorState,
    setState: ReactSetStateCall,
    config: {
      docID: IdStrict,
    },
  ) {
    const {docID} = config;
    this._editorState = editorState;
    this._setState = setState;
    this._docID = docID;

    const url = window.location.protocol + '\/\/' +
      window.location.host.replace('3001', '3002') + '/docs/' +
      docID;

    this._connection = new EditorConnection(
      setState,
      new Reporter(),
      url,
    );

    this._connection.view = {
      updateState: (s) => {
        console.log('update', s);
        setState({editorState: s}, () => {});
      },
    };

    this._connect();
  }

  onEdit = (transaction: Transform): void => {
    if (!this._connection.ready) {
      console.warn('not ready');
      return;
    }
    ReactDOM.unstable_batchedUpdates(() => {
      this._connection.dispatch({type: 'transaction', transaction});
    });
  };

  _connect = (): void => {

  };
}

export default DemoCollabConnector;
