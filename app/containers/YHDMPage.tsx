import React from 'react';
import DPlayer from 'react-dplayer';
import { Button, Spin, Layout } from 'antd';
import { ipcRenderer, TouchBarSlider } from 'electron';
const { Content } = Layout;

export default class YHDMPage extends React.PureComponent {
  state = {
    pageLoading: true,
    episodeLoading: false,
    list: []
  };
  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(`http://www.yhdm.tv/show/${id}.html`)
      .then(res => res.text())
      .then(html => {
        const dom = new DOMParser().parseFromString(html, 'text/html');
        const list = [];
        dom.querySelectorAll('.movurl li').forEach(li => {
          const item = {};
          const a = li.children[0];
          item.name = a.innerText;
          item.href = a.href.slice(a.href.indexOf('/v'));
          list.push(item);
        });
        this.setState({ ...this.state, pageLoading: false, list });
      });
    ipcRenderer.on('yhdm-video-src', (_, url) => {
      this.dplayer.switchVideo({ url });
      this.setState({
        ...this.state,
        episodeLoading: false
      });
    });
  }
  selectEpisode = href => {
    this.setState({ ...this.state, episodeLoading: true });
    ipcRenderer.send('load-yhdm-animation', 'http://www.yhdm.tv' + href);
  };
  getDplayerInstance = dplayer => {
    this.dplayer = dplayer;
  };
  render() {
    return (
      <Content>
        <section>
          {this.state.episodeLoading || this.state.pageLoading ? (
            <Spin size="large" />
          ) : (
            <DPlayer onLoad={this.getDplayerInstance} />
          )}
        </section>

        <section>
          {this.state.list.map(item => (
            <Button
              key={item.href}
              onClick={() => this.selectEpisode(item.href)}
            >
              {item.name}
            </Button>
          ))}
        </section>
      </Content>
    );
  }
}
