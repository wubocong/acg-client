import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import Bilibili from '../components/Bilibili';
import { rootStateType } from '../reducers/types';
import { setCookies, setFollowingsAsync } from '../actions/bilibili';

function mapStateToProps(state: rootStateType) {
  return {
    bilibili: state.bilibili
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({ setCookies, setFollowingsAsync }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Bilibili);
