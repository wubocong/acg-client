import React from 'react';
import { ipcRenderer } from 'electron';
import { Menu, Avatar, Layout, List } from 'antd';
import equal from 'fast-deep-equal';

import {
  followingType,
  bilibiliStateType,
  cookieType
} from '../../reducers/types';

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
  setCookies: (cookies: cookieType[]) => void;
  setFollowingsAsync: (userId: string) => void;
};

type BilibiliState = {
  infoFlow: videoType[];
};
export default class Bilibili extends React.PureComponent<
  BilibiliProps,
  BilibiliState
> {
  constructor(props: BilibiliProps) {
    super(props);
    this.state = { infoFlow: [] };
  }

  componentDidMount() {
    ipcRenderer.invoke('bilibili-login');
    ipcRenderer.on('bilibili-cookies', (_, cookies: Array<cookieType>) => {
      const { setCookies } = this.props;
      setCookies(cookies);
    });
  }

  componentDidUpdate(prevProps: BilibiliProps) {
    const {
      bilibili: { followings, userId = '' },
      setFollowingsAsync
    } = this.props;
    const {
      bilibili: { followings: prevFollowings, userId: prevUserId }
    } = prevProps;
    if (!equal(followings, prevFollowings)) this.getInfoFlow();
    if (userId !== prevUserId) setFollowingsAsync(userId);
  }

  getInfoFlow = async () => {
    const {
      bilibili: { followings }
    } = this.props;
    if (followings) {
      const requests = followings.map(following =>
        fetch(
          `https://api.bilibili.com/x/space/arc/search?mid=${following.mid}&pn=1&ps=100`
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
    const {
      bilibili: { followings = [] }
    } = this.props;
    const { infoFlow } = this.state;
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
                  <a href={`https://space.bilibili.com/${following.mid}`}>
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
            dataSource={infoFlow}
            renderItem={(item: videoType) => (
              <List.Item
                key="item.name"
                extra={
                  <img src={`https:${item.pic}`} width={160} alt={item.title} />
                }
              >
                <List.Item.Meta
                  avatar={
                    // eslint-disable-next-line react/jsx-wrap-multilines
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
                  description={`${item.author} ${item.created}`}
                />
                {item.description}
              </List.Item>
            )}
          />
        </Content>
      </>
    );
  }
}
