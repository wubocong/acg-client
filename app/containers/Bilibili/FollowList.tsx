import React from 'react';
import { Avatar, Menu } from 'antd';

import { followingType } from '../../state/types';

const { SubMenu } = Menu;

type Props = {
  followings: followingType[];
};

export default function FollowList(props: Props) {
  const { followings } = props;
  return (
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
  );
}
