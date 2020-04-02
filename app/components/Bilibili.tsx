import React from 'react';
import { ipcRenderer } from 'electron';
import { Menu, Avatar, Layout, List } from 'antd';

import {
  followingType,
  bilibiliStateType,
  cookieType
} from '../reducers/types';
import fetch from 'node-fetch';
import { setFollowings } from '../actions/bilibili';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

type videoType = {
  author: string;
  mid: number;
  pic: string;
  title: string;
  created: number;
  description: string;
};

type BilibiliProps = {
  bilibili: bilibiliStateType;
  setFollowings: (followings: followingType[]) => void;
  setCookies: (cookies: cookieType[]) => void;
  setFollowingsAsync: (userId: string) => Promise<void>;
};

type BilibiliState = {
  infoFlow: videoType[];
};
export default class Bilibili extends React.PureComponent<
  BilibiliProps,
  BilibiliState
> {
  state = { infoFlow: [], followings: [] };
  componentDidMount() {
    ipcRenderer.invoke('bilibili-login');
    ipcRenderer.on('bilibili-cookies', (_, cookies: Array<cookieType>) => {
      this.props.setCookies(cookies);
      this.props.setFollowingsAsync(this.props.bilibili.userId).then(() => {
        this.getInfoFlow();
      });
    });
  }
  getInfoFlow = async () => {
    const { followings } = this.props.bilibili;
    if (followings) {
      const requests = followings.map(following =>
        fetch(
          'https://api.bilibili.com/x/space/arc/search?mid=' +
            following.mid +
            '&pn=1&ps=100'
        )
      );
      const infoFlow = await Promise.all(requests)
        .then(responses => {
          return Promise.all(responses.map(response => response.json()));
        })
        .then(datas =>
          datas
            .map(data => data.data.list.vlist)
            .flat()
            .sort((a, b) => b.created - a.created)
            .slice(0, 100)
        );
      this.setState({ infoFlow });
    }
  };
  render() {
    const followings = this.props.bilibili.followings || [];
    return (
      <>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="sub1" title="我的关注">
              {followings.map((following: followingType) => (
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
        <Content>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={this.state.infoFlow}
            renderItem={(item: videoType) => (
              <List.Item
                key="item.name"
                extra={<img src={'https:' + item.pic} width={160} />}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        followings.find(
                          (following: followingType) =>
                            following.mid === item.mid
                        )?.face
                      }
                    />
                  }
                  title={item.title}
                  description={item.author + ' ' + item.created}
                ></List.Item.Meta>
                {item.description}
              </List.Item>
            )}
          />
        </Content>
      </>
    );
  }
}
