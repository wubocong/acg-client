import { createHashHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import BilibiliState from '../state/BilibiliState';

const hashHistory = createHashHistory();
const routingStore = new RouterStore();
const bilibiliStore = new BilibiliState();

const history = syncHistoryWithStore(hashHistory, routingStore);

const configureStore = () => {
  const stores = {
    routing: routingStore,
    bilibili: bilibiliStore
  };
  return stores;
};

export default { configureStore, history };
