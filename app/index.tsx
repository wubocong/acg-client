import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { ipcRenderer } from 'electron';
import 'antd/dist/antd.css';

import './app.global.scss';
import { configureStore, history } from './store/configureStore';
import { Store } from './reducers/types';
import { setCookies } from './actions/bilibili';

const store = configureStore() as Store;

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  )
);

ipcRenderer.on('bilibili-cookies', (_, cookies: cookieType[]) => {
  store.dispatch(setCookies(cookies));
});
