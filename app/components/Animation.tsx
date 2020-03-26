import React from 'react';
import { Input, Avatar, Layout, List } from 'antd';
import fetch from 'node-fetch';

const { Sider, Content } = Layout;
const { Search } = Input;

export default class Animation extends React.PureComponent {
  state = { animationList: [] };
  onSearch = async (value: string) => {
    const animationList = [];
    const html = await fetch('http://www.yhdm.tv/search/' + value).then(res =>
      res.text()
    );
    const dom = new DOMParser().parseFromString(html, 'text/html');

    dom.querySelectorAll('.lpic ul li').forEach(li => {
      const item = {};

      for (let i = li.children.length - 1; i >= 0; i--) {
        const node = li.children[i];
        const tagName = node.tagName.toLowerCase();
        if (tagName === 'a') {
          item.img = node.children[0].src;
        } else if (tagName === 'h2') {
          const pos = node.children[0].href.indexOf('/show');
          item.href = 'http://www.yhdm.tv' + node.children[0].href.slice(pos);
          item.name = node.children[0].innerText;
        } else if (tagName === 'p') {
          item.description = node.innerText;
        }
      }
      animationList.push(item);
    });
    console.log(animationList);
    this.setState({ ...this.state, animationList });
  };
  render() {
    return (
      <Content>
        <section>
          <Search
            placeholder="请输入动漫名"
            enterButton="Search"
            size="large"
            onSearch={this.onSearch}
          />
        </section>
        <section>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={this.state.animationList}
            renderItem={item => (
              <List.Item
                key="item.name"
                extra={<img src={item.img} width={75} />}
              >
                <List.Item.Meta
                  title={<a href={item.href}>{item.name}</a>}
                ></List.Item.Meta>
                {item.description}
              </List.Item>
            )}
          />
        </section>
      </Content>
    );
  }
}
