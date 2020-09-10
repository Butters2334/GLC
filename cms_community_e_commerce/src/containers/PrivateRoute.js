//登录提示?

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Route,
  Redirect
} from 'react-router-dom';
// import storage from '../utils';
// import {
//   USER_ID,
//   USER_TOKEN
// } from '../constants';

@connect(
  state => {
    return {
      isAuthenticated: state.auth.isAuthenticated,
      error: state.auth.error
    }
  }
)
export default class PrivateRoute extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    error:PropTypes.string
  }

  static state = {
    isAuthenticated: false
  }

  // componentWillMount() {
  //   const userId = storage.getStorage(USER_ID)
  //   const token = storage.getStorage(USER_TOKEN)

  //   if (token && userId) {
  //     this.setState({
  //       isAuthenticated: true
  //     })
  //   }
  // }

  handleRender = () => {
    const {
      component: ComposedComponent
    } = this.props

    if(this.props.isAuthenticated) {
      return (
        <ComposedComponent {...this.props} />
      )
    } else {
        console.log("error - "+JSON.stringify(this.props))
        console.log("state - "+JSON.stringify(this.state))
        return (
        <Redirect
          to={{
            pathname: '/signin',
            state: {
              from: this.props.location,
              message: '登录已过期'
            }
          }}
        />
      )
    }
  }

  render() {
    const {
      component,
      ...rest
    } = this.props

    return (
      <Route {...rest} render={this.handleRender} />
    )
  }
}
