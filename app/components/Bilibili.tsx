import React from 'react';
import { ipcRenderer } from 'electron';
import { Menu, Avatar, Layout } from 'antd';

import { followingType, bilibiliStateType } from '../reducers/types';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

type BilibiliProps = {
  bilibili: bilibiliStateType;
};
export default class Bilibili extends React.PureComponent<BilibiliProps> {
  componentDidMount() {
    ipcRenderer.invoke('bilibili-login');
  }
  render() {
    const followings = this.props.bilibili.followings;
    return (
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu key="sub1" title="我的关注">
            {followings &&
              followings.map((following: followingType) => (
                <Menu.Item key={following.mid}>
                  <Avatar src={following.face} />
                  <a href={'https://space.bilibili.com/' + following.mid}>
                    {following.uname}
                  </a>
                </Menu.Item>
              ))}
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}
