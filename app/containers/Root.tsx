import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { Switch, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import { Store } from '../reducers/types';
import routes from '../constants/routes.json';
import App from '../containers/App';
import BilibiliPage from '../containers/BilibiliPage';
import AnimationPage from '../containers/AnimationPage';

const { Header, Footer } = Layout;

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
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
              <Route path={routes.ANIMATION} component={AnimationPage} />
            </Switch>
          </Layout>
          <Footer style={{ textAlign: 'center' }}>
            ACG Client ©2020 Created by Warrior!
          </Footer>
        </Layout>
      </App>
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
