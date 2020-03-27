import React from 'react';
import { Input, Layout, List, Spin } from 'antd';
import { Link } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Search } = Input;

export default class Animation extends React.PureComponent {
  state = { animationList: [], searching: false };
  onSearch = async (value: string) => {
    const animationList = [];
    this.setState({ ...this.state, searching: true });
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
          const start = node.children[0].href.indexOf('/show') + 6;
          const end = node.children[0].href.indexOf('.html');
          item.id = node.children[0].href.slice(start, end);
          item.name = node.children[0].innerText;
        } else if (tagName === 'p') {
          item.description = node.innerText;
        }
      }
      animationList.push(item);
    });
    // console.log(animationList);
    this.setState({ ...this.state, searching: false, animationList });
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
          {this.state.searching ? (
            <div style={{ textAlign: 'center', paddingTop: '50px' }}>
              <Spin size="large" />
            </div>
          ) : (
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
                    title={
                      <Link
                        to={'/animation/yhdm/' + item.id}
                      >
                        {item.name}
                      </Link>
                    }
                  ></List.Item.Meta>
                  {item.description}
                </List.Item>
              )}
            />
          )}
        </section>
      </Content>
    );
  }
}
