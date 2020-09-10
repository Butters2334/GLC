//dashboard视图
import React from 'react';
import PropTypes from 'prop-types';
import {
  Link
} from 'react-router-dom';
import {
  Layout,
  Icon,
  Menu,
  Dropdown
} from 'antd';
const { Header } = Layout;
// eslint-disable-next-line import/first
import * as utils from '../../utils';
// eslint-disable-next-line import/first
import {USERNAME,USER_USERTYPE} from '../../constants';
  

export default class Navbar extends React.Component {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired
  }

  handleSignout = () => {
    console.log(this.props)
    this.props.signout()
  }

  renderOverlay() {
    return (
      <Menu onClick={this.handleSignout}>
        <Menu.Item>
          {/* <Link to="/signin"> */}
            退出
          {/* </Link> */}
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    const menu = this.renderOverlay()
    //登录之后没找到怎么让这里更新..
    // console.log("values.username2 - "+utils.getStorage(USERNAME))
    return (
      <Header>
        <nav className="navbar">
          <ul className="nav">
            <li className="nav-item">
              <Icon
                className="sidebar-trigger"
                type={this.props.collapsed ? 'menu-unfold': 'menu-fold'}
                onClick={this.props.handleClick}
              />
            </li>
          </ul>
          <ul className="nav navbar-right">
            <Dropdown
              overlay={menu}
            >
              <li className="nav-item">
                <Icon
                  type={utils.getStorage(USER_USERTYPE)==='2'?"user":"user-delete"}
                />
                {(utils.getStorage(USER_USERTYPE)==='2'?"管理员：":"分拣员：")+utils.getStorage(USERNAME)}
              </li>
            </Dropdown>
          </ul>
        </nav>
      </Header>
    )
  }
}
