//侧栏UI

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Layout,
    Icon,
    Menu,
    message
} from 'antd'
import SidebarLogo from '@/components/SidebarLogo';
import * as utils from '../../utils';
import { USER_USERTYPE } from '../../constants';

const {
    Sider
} = Layout
const {
    Item,
    SubMenu
} = Menu

@connect(
    state => ({
        //adminId: state.auth.admin.adminId
        wait: state.orders.wait,
        dispatching: state.orders.dispatching,
        refunding: state.orders.refunding
    })
)
export default class Sidebar extends React.Component {
    static propTypes = {
        //侧边栏收缩
        collapsed: PropTypes.bool.isRequired,
        permission: PropTypes.bool.isRequired
    }

    state = {
        current: '0'
    }

    handleClick = (e) => {
        const key = e.key
        console.log("menu select - " + key)
        this.setState({
            current: key
        })
    }

    noFinish = () => {
        message.destroy();
        message.warning('开发中');
    }

    render() {
        const {
            collapsed
        } = this.props
        if (utils.getStorage(USER_USERTYPE) !== "2") {
            return (
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                >
                    <SidebarLogo scan={true} />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={["0"]}
                        onClick={this.handleClick}
                        siderCollapsed={false}
                        inlineIndent={30}
                        defaultOpenKeys={["2", "3", "4"]}
                    >
                        <Item key="0">
                            <Link to="/dashboard">
                                <Icon type="dashboard" />
                                <span>{"dashboard"}</span>
                            </Link>
                        </Item>
                        <Item key="2">
                            <Link to="orderList">
                                <Icon type="profile" />
                                <span>{"订单查询"}</span>
                            </Link>
                        </Item>
                        <Item key="3">
                            <Link to="curList">
                                <Icon type="share-alt" />
                                <span>{"课程查询"}</span>
                            </Link>
                        </Item>
                        <Item key="4">
                            <Link to="goodsList">
                                <Icon type="tag-o" />
                                <span>{"教材查询"}</span>
                            </Link>
                        </Item>
                        <Item key="5">
                            <Link to="Warehouse">
                                <Icon type="environment" theme="filled" />
                                <span>{"仓库布局"}</span>
                            </Link>
                        </Item>
                        <Item key="6">
                            <Link to="SortingStation">
                                <Icon type="rocket" theme="twoTone" />
                                <span style={{ color: 'ff0', fontWeight: 'bold', fontSize: '20' }}>
                                    {"开始分拣"}
                                </span>
                            </Link>
                        </Item>

                    </Menu>
                </Sider>
            )
        }
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
            >
                <SidebarLogo />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["0"]}
                    onClick={this.handleClick}
                    siderCollapsed={false}
                    inlineCollapsed={false}
                    inlineIndent={30}
                    defaultOpenKeys={["2", "3", "4"]}
                >
                    <Item key="0">
                        <Link to="/dashboard">
                            <Icon type="dashboard" />
                            <span>{"dashboard"}</span>
                        </Link>
                    </Item>
                    <Item key="1">
                        <Link to="NODATA" onClick={this.noFinish}>
                            <Icon type="user" />
                            <span>{/*collapsed?"":*/"账户权限管理"}</span>
                        </Link>
                    </Item>
                    <Item key="1_1">
                        <Link to="Warehouse">
                            <Icon type="environment" theme="filled" />
                            <span>{"仓库布局"}</span>
                        </Link>
                    </Item>
                    <Item key="6">
                        <Link to="SortingStation">
                            <Icon type="rocket" theme="twoTone" />
                            <span style={{ color: 'ff0', fontWeight: 'bold', fontSize: '20' }}>
                                {"开始分拣"}
                            </span>
                        </Link>
                    </Item>
                    <SubMenu title={<span><Icon type="profile" />{collapsed ? "" : "订单信息管理"}</span>} key="2">
                        <Item key="21">
                            <Link to="/orderList">
                                <span>订单查询</span>
                            </Link>
                        </Item>
                        <Item key="22">
                            <Link to="NODATA" onClick={this.noFinish}>
                                <span>订单配送</span>
                            </Link>
                        </Item>
                        <Item key="23">
                            {/* <Badge count={refunding}> */}
                            <Link to="/orderAdd">
                                <span>新增订单</span>
                            </Link>
                            {/* </Badge> */}
                        </Item>
                        <Item key="24">
                            {/* <Badge count={refunding}> */}
                            <Link to="NODATA" onClick={this.noFinish}>
                                <span>异常订单</span>
                            </Link>
                            {/* </Badge> */}
                        </Item>
                    </SubMenu>
                    <SubMenu title={<span><Icon type="share-alt" />{collapsed ? "" : "课程关联管理"}</span>} key="3">
                        <Item key="31">
                            <Link to="/curList">
                                <span>课程查询</span>
                            </Link>
                        </Item>
                        <Item key="32">
                            <Link to="/curAdd">
                                <span>新增课程</span>
                            </Link>
                        </Item>
                        <Item key="33">
                            {/* <Badge count={refunding}> */}
                            <Link to="NODATA" onClick={this.noFinish}>
                                <span>异常课程</span>
                            </Link>
                            {/* </Badge> */}
                        </Item>
                    </SubMenu>
                    <SubMenu title={<span><Icon type="tag-o" />{collapsed ? "" : "教材信息管理"}</span>} key="4">
                        <Item key="41">
                            <Link to="/goodsList">
                                <span>教材查询</span>
                            </Link>
                        </Item>
                        <Item key="42">
                            <Link to="/goodsAdd">
                                <span>新增教材</span>
                            </Link>
                        </Item>
                        <Item key="44">
                            <Link to="/goodsStock">
                                <span>批量入库</span>
                            </Link>
                        </Item>
                        <Item key="43">
                            {/* <Badge count={refunding}> */}
                            <Link to="NODATA" onClick={this.noFinish}>
                                <span>异常教材</span>
                            </Link>
                            {/* </Badge> */}
                        </Item>
                    </SubMenu>
                    <SubMenu title={<span><Icon type="user" />{collapsed ? "" : "客户记录管理"}</span>} key="5">
                        <Item key="51">
                            <Link to="NODATA" onClick={this.noFinish}>
                                <span>常规客户</span>
                            </Link>
                        </Item>
                        <Item key="52">
                            <Link to="NODATA" onClick={this.noFinish}>
                                <span>退货客户</span>
                            </Link>
                        </Item>
                        <Item key="53">
                            {/* <Badge count={refunding}> */}
                            <Link to="NODATA" onClick={this.noFinish}>
                                <span>投诉客户</span>
                            </Link>
                            {/* </Badge> */}
                        </Item>
                    </SubMenu>
                    {/* <Item key="8">
            <Link to="/advertisments">
              <Icon type="switcher" />
              <span>滑动广告管理</span>
            </Link>
          </Item> */}
                    {/* {
            adminId === 100 ? (
              <Item key="9">
                <Link to="/admins">
                  <Icon type="solution" />
                  <span>管理员信息管理</span>
                </Link>
              </Item>
            ) : null
          } */}
                </Menu>
            </Sider>
        )
    }
}
