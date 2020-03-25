import React from 'react';
import { ipcRenderer } from 'electron';
import equal from 'fast-deep-equal';

import { followingType } from '../reducers/types';

export default class Home extends React.Component {
  state = { followings: [] };
  componentDidMount() {
    ipcRenderer.invoke('bilibili-login');
  }
  componentDidUpdate(prevProps) {
    console.log('wbc1');
    if (!equal(prevProps.bilibili, this.props.bilibili)) {
      this.setState({ followings: this.props.bilibili.followings });
    }
  }
  render() {
    const { followings } = this.state;
    return (
      <article>
        {followings.map((following: followingType) => (
          <section key={following.mid}>
            <a href={'https://space.bilibili.com/' + following.mid}>
              {following.uname}
            </a>
            <img
              src={following.face}
              style={{ width: '120px', height: '120px' }}
            />
          </section>
        ))}
      </article>
    );
  }
}
