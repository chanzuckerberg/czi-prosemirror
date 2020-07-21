// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import Licit from '../../src/client/Licit';
import CustomLicitRuntime from './CustomLicitRuntime';

function main(): void {
  const el = document.createElement('div');
  el.id = 'licit-app';
  el.style.setProperty("width", "100vw");
  el.style.setProperty("height", "100vh");
  const {body} = document;
  body && body.appendChild(el);
  const docJSON = {'type':'doc','attrs':{'layout':null,'padding':null,'width':null},'content':[{'type':'paragraph','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null},'content':[{'type':'text','marks':[{'type':'mark-font-type','attrs':{'name':'Arial Black'}}],'text':'First line Arial black'}]},{'type':'ordered_list','attrs':{'id':null,'counterReset':null,'indent':0,'following':null,'listStyleType':null,'name':null,'start':1},'content':[{'type':'list_item','attrs':{'align':null},'content':[{'type':'paragraph','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null},'content':[{'type':'text','text':'List 1'}]}]}]},{'type':'ordered_list','attrs':{'id':null,'counterReset':null,'indent':1,'following':null,'listStyleType':null,'name':null,'start':1},'content':[{'type':'list_item','attrs':{'align':null},'content':[{'type':'paragraph','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null},'content':[{'type':'text','text':'Child'}]}]}]},{'type':'ordered_list','attrs':{'id':null,'counterReset':'none','indent':0,'following':null,'listStyleType':null,'name':null,'start':1},'content':[{'type':'list_item','attrs':{'align':null},'content':[{'type':'paragraph','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null},'content':[{'type':'text','text':'List 2'}]}]}]},{'type':'paragraph','attrs':{'align':'center','color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null},'content':[{'type':'text','text':'Align'}]},{'type':'paragraph','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null},'content':[{'type':'text','marks':[{'type':'mark-text-color','attrs':{'color':'#f20d96'}}],'text':'Font'},{'type':'text','text':' '},{'type':'text','marks':[{'type':'mark-text-highlight','attrs':{'highlightColor':'#e5e5e5'}}],'text':'Color '},{'type':'text','marks':[{'type':'strong'}],'text':'align '},{'type':'text','marks':[{'type':'link','attrs':{'href':'http://www.google.com','rel':'noopener noreferrer nofollow','target':'blank','title':null}},{'type':'em'}],'text':'Link to google'},{'type':'text','marks':[{'type':'em'}],'text':' '},{'type':'text','marks':[{'type':'underline'}],'text':'underline '},{'type':'text','marks':[{'type':'em'},{'type':'strong'},{'type':'mark-text-color','attrs':{'color':'#e5e5e5'}},{'type':'mark-text-highlight','attrs':{'highlightColor':'#979797'}},{'type':'underline'}],'text':'combined'}]},{'type':'heading','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null,'level':1},'content':[{'type':'text','text':'Header 1'}]},{'type':'paragraph','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null}},{'type':'table','attrs':{'marginLeft':null},'content':[{'type':'table_row','content':[{'type':'table_cell','attrs':{'colspan':1,'rowspan':1,'colwidth':null,'borderColor':null,'background':null},'content':[{'type':'paragraph','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null},'content':[{'type':'text','marks':[{'type':'strong'}],'text':'Cell 1'}]}]},{'type':'table_cell','attrs':{'colspan':1,'rowspan':1,'colwidth':null,'borderColor':null,'background':null},'content':[{'type':'paragraph','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null},'content':[{'type':'text','text':'Cell 2'}]}]}]}]},{'type':'paragraph','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null}},{'type':'paragraph','attrs':{'align':null,'color':null,'id':null,'indent':null,'lineSpacing':null,'paddingBottom':null,'paddingTop':null},'content':[{'type':'text','text':'Subscript '},{'type':'text','marks':[{'type':'super'}],'text':'2 '}]}]};
  // Use this (set to null) if need a empty editor.
  // docJSON = null;
  // [FS] IRAD-982 2020-06-10
  // Use the licit component for demo.

  // To pass runtime to handle the upload image from angular App
  // null means it will take licit EditorRuntime
  const runTime = new CustomLicitRuntime();  
  ReactDOM.render(<Licit docID={0} debug={false} width={'100vw'} height={'100vh'} onChange={onChangeCB} onReady={onReadyCB} data={docJSON} embedded={false} runtime={null} />, el);
}

function onChangeCB(data) {
  console.log('data: ' + JSON.stringify(data));
}

function onReadyCB(ref) {
  console.log('ref: ' + ref);
}

window.onload = main;
