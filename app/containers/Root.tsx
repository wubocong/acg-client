import React from 'react';
import { Provider } from 'mobx-react';
import { Router } from 'react-router';
import { hot } from 'react-hot-loader/root';
// import { SynchronizedHistory } from 'mobx-react-router';
import { History } from 'history';
import { Switch, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import { Stores } from '../state/types';
import routes from '../constants/routes.json';
import App from './App';
import BilibiliPage from './Bilibili';
import AnimationPage from './Animation';
import YHDMPage from './YHDM';

const { Header, Footer } = Layout;

type Props = {
  stores: Stores;
  history: History;
};

const Root = ({ stores, history }: Props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Provider {...stores}>
    <Router history={history}>
      <App>
        <Layout className="layout">
          <Header>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link to={routes.BILIBILI}>哔哩哔哩</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to={routes.ANIMATION}>动画</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Layout style={{ padding: '0 50px' }}>
            <Switch>
              <Route path={routes.BILIBILI} component={BilibiliPage} />
              <Route exact path={routes.ANIMATION} component={AnimationPage} />
              <Route path={routes.YHDM} component={YHDMPage} />
              <Route component={BilibiliPage} />
            </Switch>
          </Layout>
          <Footer style={{ textAlign: 'center' }}>
            ACG Client ©2020 Created by Warrior!
          </Footer>
        </Layout>
      </App>
    </Router>
  </Provider>
);

export default hot(Root);
