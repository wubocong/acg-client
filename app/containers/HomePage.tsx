import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home'

function mapStateToProps(state: counterStateType) {
  return {
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
