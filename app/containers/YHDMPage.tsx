import React from 'react';
import ReactDPlayer from 'react-dplayer';
import DPlayer from 'dplayer';
import { Button, Spin, Layout } from 'antd';
import { ipcRenderer } from 'electron';
import { LeftOutlined } from '@ant-design/icons';
import { History } from 'history';
import { match } from 'react-router-dom';

const { Content } = Layout;

type EpisodeType = {
  episode: string;
  href: string;
};

type YHDMProps = {
  history: History;
  match: match<{ id: string }>;
};
type YHDMState = {
  currentEpisode: string;
  episodeLoading: boolean;
  episodeList: EpisodeType[];
  iframe: string;
  pageLoading: boolean;
  title: string;
};

export default class YHDMPage extends React.PureComponent<
  YHDMProps,
  YHDMState
> {
  dplayer: DPlayer | null = null;
  state = {
    currentEpisode: '',
    episodeLoading: false,
    episodeList: [],
    iframe: '',
    pageLoading: true,
    title: ''
  };
  componentDidMount() {
    const id = this.props.match.params.id;
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
        this.setState({ pageLoading: false, episodeList, title });
      });
    ipcRenderer.on('yhdm-video-src', (_, url) => {
      this.dplayer?.switchVideo({ url });
      this.setState({
        episodeLoading: false,
        iframe: ''
      });
    });
    ipcRenderer.on('yhdm-iframe-src', (_, iframe) => {
      this.setState({ episodeLoading: false, iframe });
    });
  }
  getDplayerInstance = dplayer => {
    this.dplayer = dplayer;
  };
  selectEpisode = (href: string, episode: string) => {
    this.setState({ episodeLoading: true, currentEpisode: episode });
    ipcRenderer.send('load-yhdm-animation', 'http://www.yhdm.tv' + href);
  };
  render() {
    const { history } = this.props;
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
            <h1>{this.state.title}</h1>
            <h3>{this.state.currentEpisode}</h3>
          </hgroup>
          <div
            style={{
              textAlign: 'center',
              padding: '50px 0',
              display:
                this.state.episodeLoading || this.state.pageLoading
                  ? 'block'
                  : 'none'
            }}
          >
            <Spin size="large" />
          </div>
          {this.state.iframe ? (
            <iframe style={{ width: '100%', height: 'calc(60vw - 60px)' }} src={this.state.iframe} />
          ) : (
            <ReactDPlayer
              style={{
                display:
                  this.state.episodeLoading || this.state.pageLoading
                    ? 'none'
                    : 'block'
              }}
              onLoad={this.getDplayerInstance}
            />
          )}
        </section>

        <section>
          {this.state.episodeList.map((item: EpisodeType) => (
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
