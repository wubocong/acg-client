import React from 'react';
const { ipcRenderer } = require('electron');

export default class Home extends React.Component {
  componentWillMount(){
    ipcRenderer.invoke('bilibili-login');
  }
  render() {
    const { follow } = this.props;
    return <div>wbc</div>;
  }
}
