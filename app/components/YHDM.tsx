import React from 'react';
import DPlayer from 'react-dplayer';
import { Button, Layout } from 'antd';
import fetch from 'node-fetch';

const { Content } = Layout;

export default class YHDM extends React.PureComponent {
  state = { episodeLoading: true, list: [], currentEpisodeURL: '' };
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
        console.log(list);
        this.setState({ ...this.state, episodeLoading: false, list });
      });
  }
  selectEpisode = href => {
    fetch('http://www.yhdm.tv' + href)
      .then(res => res.text())
      .then(html => {
        const currentEpisodeURL = html.match(/data-vid="(https.+\.mp4)/)[1];
        console.log(currentEpisodeURL);
        this.setState({
          ...this.setState,
          currentEpisodeURL
        });
      });
  };
  render() {
    return (
      <Content>
        {!this.state.episodeLoading && (
          <section>
            <DPlayer
              options={{ video: { url: this.state.currentEpisodeURL } }}
            />
          </section>
        )}
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
