import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
const { ipcRenderer } = require('electron');

import { configureStore, history } from './store/configureStore';
import 'antd/dist/antd.css';

const store = configureStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  )
);

ipcRenderer.on('bilibili-cookies', (e, cookies: string) => {
  console.log(cookies);
});
ipcRenderer.on('bilibili-followings', (e, cookies: string) => {
  console.log(cookies);
});
