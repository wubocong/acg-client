import React from 'react';
import { Avatar, List } from 'antd';

import { followingType } from '../../state/types';

type videoType = {
  author: string;
  mid: number;
  pic: string;
  title: string;
  created: number;
  description: string;
};

type Props = {
  followings: followingType[];
  infoFlow: videoType[];
};

export default function InfoList(props: Props) {
  const { followings, infoFlow } = props;
  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={infoFlow}
      renderItem={(item: videoType) => (
        <List.Item
          key="item.name"
          extra={<img src={`https:${item.pic}`} width={160} alt={item.title} />}
        >
          <List.Item.Meta
            avatar={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Avatar
                src={
                  followings.find(
                    (following: followingType) => following.mid === item.mid
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
  );
}
