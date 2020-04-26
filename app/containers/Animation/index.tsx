import React from 'react';
import { Input, Layout, List, Spin } from 'antd';
import { Link } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Search } = Input;

type AnimationType = {
  description: string;
  id: string;
  img: string;
  name: string;
};

type Props = {};
type State = {
  animationList: AnimationType[];
  searching: boolean;
};
export default class Animation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { animationList: [], searching: false };
  }

  onSearch = async (value: string) => {
    const animationList: AnimationType[] = [];
    this.setState({ searching: true });
    const html = await fetch(`http://www.yhdm.tv/search/${value}`).then(res =>
      res.text()
    );
    const dom = new DOMParser().parseFromString(html, 'text/html');

    dom.querySelectorAll('.lpic ul li').forEach(li => {
      const item: AnimationType = {
        description: '',
        id: '',
        img: '',
        name: ''
      };

      for (let i = li.children.length - 1; i >= 0; i -= 1) {
        const node = li.children[i] as HTMLElement;
        const tagName = node.tagName.toLowerCase();
        if (tagName === 'a') {
          item.img = (node.children[0] as HTMLImageElement).src;
        } else if (tagName === 'h2') {
          const anchor = node.children[0] as HTMLAnchorElement;
          const start = anchor.href.indexOf('/show') + 6;
          const end = anchor.href.indexOf('.html');
          item.id = anchor.href.slice(start, end);
          item.name = anchor.innerText;
        } else if (tagName === 'p') {
          item.description = node.innerText;
        }
      }
      animationList.push(item);
    });
    // console.log(animationList);
    this.setState({ searching: false, animationList });
  };

  render() {
    const { searching, animationList } = this.state;
    return (
      <Content>
        <section style={{ padding: '24px 0' }}>
          <Search
            placeholder="请输入动漫名"
            enterButton="Search"
            size="large"
            onSearch={this.onSearch}
          />
        </section>
        <section>
          {searching ? (
            <div style={{ textAlign: 'center', paddingTop: '50px' }}>
              <Spin size="large" />
            </div>
          ) : (
            <List
              itemLayout="vertical"
              size="large"
              dataSource={animationList}
              renderItem={(item: AnimationType) => (
                <List.Item
                  key="item.name"
                  extra={<img src={item.img} width={75} alt={item.name} />}
                >
                  <List.Item.Meta
                    title={
                      <Link to={`/animation/yhdm/${item.id}`}>{item.name}</Link>
                    }
                  />
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
