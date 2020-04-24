import React from 'react';
import ReactDPlayer from 'react-dplayer';
import DPlayer from 'dplayer';
import { Button, Layout, message, Progress, Spin } from 'antd';
import { ipcRenderer } from 'electron';
import { LeftOutlined } from '@ant-design/icons';
import { History } from 'history';
import { match } from 'react-router-dom';

const { Content } = Layout;

type EpisodeType = {
  episode: string;
  href: string;
};

type Props = {
  history: History;
  match: match<{ id: string }>;
};
type State = {
  currentEpisode: string;
  currentVideoUrl: string;
  episodeLoading: boolean;
  episodeList: EpisodeType[];
  iframe: string;
  pageLoading: boolean;
  title: string;
  videoDownloadedPercent: number | undefined;
};

export default class YHDMPage extends React.Component<Props, State> {
  dplayer: DPlayer | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentEpisode: '',
      currentVideoUrl: '',
      episodeLoading: false,
      episodeList: [],
      iframe: '',
      pageLoading: true,
      title: '',
      videoDownloadedPercent: undefined
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    fetch(`http://www.yhdm.tv/show/${id}.html`)
      .then(res => res.text())
      .then(html => {
        const dom = new DOMParser().parseFromString(html, 'text/html');
        const episodeList: EpisodeType[] = [];
        const title = (dom.querySelector('h1') as HTMLHeadingElement).innerText;
        dom.querySelectorAll('.movurl li').forEach(li => {
          const item: EpisodeType = { episode: '', href: '' };
          const a = li.children[0] as HTMLAnchorElement;
          item.episode = a.innerText;
          item.href = a.href.slice(a.href.indexOf('/v'));
          episodeList.push(item);
        });
        return this.setState({ pageLoading: false, episodeList, title });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });

    ipcRenderer.on('yhdm-video-src', (_, url) => {
      this.dplayer?.switchVideo({ url });
      this.setState({
        currentVideoUrl: url,
        episodeLoading: false,
        iframe: ''
      });
    });
    ipcRenderer.on('yhdm-iframe-src', (_, iframe) => {
      this.setState({ episodeLoading: false, iframe });
    });
  }

  downloadVideo = () => {
    const { currentVideoUrl: url, currentEpisode, title } = this.state;
    ipcRenderer.send('downloadVideo', {
      url,
      name: `${title}-${currentEpisode}`
    });
    const listener = (_: Event, percent: number) => {
      this.setState({ videoDownloadedPercent: percent });
      if (percent === 100) {
        message.success(`${title}-${currentEpisode} 下载完成！`);
        ipcRenderer.off('downloadVideoProgress', listener);
        setTimeout(() => {
          this.setState({ videoDownloadedPercent: undefined });
        }, 3000);
      }
    };
    ipcRenderer.on('downloadVideoProgress', listener);
  };

  getDplayerInstance = (dplayer: DPlayer) => {
    this.dplayer = dplayer;
  };

  selectEpisode = (href: string, episode: string) => {
    this.setState({ episodeLoading: true, currentEpisode: episode });
    ipcRenderer.send('load-yhdm-animation', `http://www.yhdm.tv${href}`);
  };

  render() {
    const { history } = this.props;
    const {
      currentEpisode,
      episodeList,
      episodeLoading,
      iframe,
      pageLoading,
      title,
      videoDownloadedPercent
    } = this.state;
    return (
      <Content>
        <section style={{ margin: '24px 0' }}>
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            onClick={() => {
              history.goBack();
            }}
          />
          <hgroup>
            <h1>{title}</h1>
            <h3>{currentEpisode}</h3>
          </hgroup>
          <div
            style={{
              textAlign: 'center',
              padding: '50px 0',
              display: episodeLoading || pageLoading ? 'block' : 'none'
            }}
          >
            <Spin size="large" />
          </div>
          {iframe ? (
            <iframe
              style={{ width: '100%', height: 'calc(60vw - 60px)' }}
              src={iframe}
              title="YHDM"
            />
          ) : (
            <div
              style={{
                display:
                  !currentEpisode || episodeLoading || pageLoading
                    ? 'none'
                    : 'block'
              }}
            >
              <ReactDPlayer onLoad={this.getDplayerInstance} />
              <Button onClick={this.downloadVideo}>下载视频</Button>
              {videoDownloadedPercent && (
                <Progress percent={videoDownloadedPercent} />
              )}
            </div>
          )}
        </section>

        <section>
          {episodeList.map((item: EpisodeType) => (
            <Button
              key={item.href}
              onClick={() => this.selectEpisode(item.href, item.episode)}
            >
              {item.episode}
            </Button>
          ))}
        </section>
      </Content>
    );
  }
}
