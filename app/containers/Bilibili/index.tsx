import React, { useContext, useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { Layout } from 'antd';
import { observer, MobXProviderContext, useObserver } from 'mobx-react';

import { followingType, cookieType } from '../../state/types';
import FollowList from './FollowList';
import InfoList from './InfoList';

const { Sider, Content } = Layout;

type videoType = {
  author: string;
  mid: number;
  pic: string;
  title: string;
  created: number;
  description: string;
};

function useStores() {
  return useContext(MobXProviderContext);
}
function useBilibiliData() {
  const { bilibili } = useStores();
  return useObserver(() => bilibili);
}

const Bilibili = observer(() => {
  const { followings, userId, setCookies, setFollowings } = useBilibiliData();
  const [infoFlow, setInfoFlow] = useState([] as videoType[]);
  useEffect(() => {
    ipcRenderer.invoke('bilibili-login');
    function handle(_: Event, data: cookieType[]) {
      setCookies(data);
    }
    ipcRenderer.on('bilibili-cookies', handle);
    return () => {
      ipcRenderer.off('bilibili-cookies', handle);
    };
  }, []);
  useEffect(() => {
    if (userId) setFollowings(userId);
  }, [userId]);
  useEffect(() => {
    const requests = followings.map((following: followingType) =>
      fetch(
        `https://api.bilibili.com/x/space/arc/search?mid=${following.mid}&pn=1&ps=100`
      )
    ) as Promise<Response>[];
    Promise.all(requests)
      .then(responses => {
        return Promise.all(responses.map(response => response.json()));
      })
      .then(datas =>
        datas
          .map(data => data.data.list.vlist)
          .flat()
          .sort((a, b) => b.created - a.created)
          .slice(0, 100)
      )
      .then((data: videoType[]) => {
        return setInfoFlow(data);
      })
      .catch(console.error);
  }, [followings]);
  return (
    <>
      <Sider width={200}>
        <FollowList followings={followings} />
      </Sider>
      <Content>
        <InfoList followings={followings} infoFlow={infoFlow} />
      </Content>
    </>
  );
});

export default Bilibili;
