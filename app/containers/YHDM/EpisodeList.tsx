import React from 'react';
import { Button } from 'antd';

type EpisodeType = {
  episode: string;
  href: string;
};

type Props = {
  episodeList: EpisodeType[];
  selectEpisode: (href: string, episode: string) => void;
};

export default function EpisodeList(props: Props) {
  const { episodeList, selectEpisode } = props;
  return (
    <>
      {episodeList.map((item: EpisodeType) => (
        <Button
          key={item.href}
          onClick={() => selectEpisode(item.href, item.episode)}
        >
          {item.episode}
        </Button>
      ))}
    </>
  );
}
