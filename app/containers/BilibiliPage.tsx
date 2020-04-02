import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import Bilibili from '../components/Bilibili';
import { rootStateType } from '../reducers/types';
import {
  setFollowings,
  setCookies,
  setFollowingsAsync
} from '../actions/bilibili';

function mapStateToProps(state: rootStateType) {
  return {
    bilibili: state.bilibili
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    { setFollowings, setCookies, setFollowingsAsync },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Bilibili);
