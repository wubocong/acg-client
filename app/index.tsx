import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import 'antd/dist/antd.css';

import './app.global.scss';
import { configureStore, history } from './store/configureStore';

const stores = configureStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root stores={stores} history={history} />
    </AppContainer>,
    document.getElementById('root')
  )
);
