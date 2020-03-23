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
import HomePage from '../containers/HomePage';
import CounterPage from '../containers/CounterPage';

const { Header, Content, Footer } = Layout;

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
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item key="1"><Link to={routes.HOME}></Link></Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Switch>
              <Route path={routes.COUNTER} component={CounterPage} />
              <Route path={routes.HOME} component={HomePage} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            ACG Client ©2020 Created by Warrior!
          </Footer>
        </Layout>
      </App>
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
