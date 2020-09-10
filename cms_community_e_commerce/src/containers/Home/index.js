//主控制视图,加载所有UI
import React from 'react';
import { connect } from 'react-redux';
import {
  Route
} from 'react-router-dom';
import {
  Layout
} from 'antd';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Users from '../Users/index';
import Goods from '../Goods/index';
import CategoryFirst from '../CategoryFirst/index';
import Orders from '../Orders/index';
import Dashboard from '../Dashboard/index';
import Advs from '../Advs/index';
import CategorySecond from '../CategorySecond/index';
import Administrators from '../Administrators';
// import OrderRefund from '../OrderRefund/index';
import OrderDispatch from '../OrderDispatch/index';
import OrderList from '../Orders/OrderList'
import GoodsList from '../Goods/GoodsList'
import NODATA from '../Goods/NODATA'
import GoodsAdd from '../Goods/GoodsAdd'
import GoodsEdit from '../Goods/GoodsEdit'
import GoodsStock from '../Goods/GoodsStock'
import OrderAdd from '../Orders/OrderAdd'
import OrderEdit from '../Orders/OrderEdit'
import CurAdd from '../Curriculum/CurAdd'
import CurList from '../Curriculum/CurList'
import CurEdit from '../Curriculum/CurEdit'
import Warehouse from '../Orders/Warehouse'
import SortingStation from '../Orders/SortingStation'
import SortingStationMap from '../Orders/SortingStationMap'

import {
  signout
} from '../../actions';

@connect(
  state => ({
    //adminId: state.auth.admin.adminId
    token: state.auth.admin.token
  }),
  dispatch => ({
    signout: () => dispatch(signout())
  })
)
export default class Home extends React.Component {
  state = {
    collapsed: false,
    superLevel: true
  }

  handleLogout = () => {
    this.props.signout()
  }

  toggleCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const superLevel = this.state.superLevel

    return (
      <div className="page page-home">
        <Layout>
          <Sidebar collapsed={this.state.collapsed} permission={superLevel}/>
          <Layout>
            <Navbar
              collapsed={this.state.collapsed}
              handleClick={this.toggleCollapse}
              signout={this.handleLogout}
            />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/orderList" component={OrderList} signout={this.handleLogout}/>
            <Route path="/goodsList" component={GoodsList} signout={this.handleLogout}/>
            <Route path="/orderAdd" component={OrderAdd} />
            <Route path="/orderEdit" component={OrderEdit} />
            <Route path="/NODATA" component={NODATA} />
            <Route path="/goodsAdd" component={GoodsAdd} />
            <Route path="/goodsEdit" component={GoodsEdit} />
            <Route path="/goodsStock" component={GoodsStock} />
            <Route path="/curAdd" component={CurAdd}/>
            <Route path="/curList" component={CurList}/>
            <Route path="/curEdit" component={CurEdit}/>
            <Route path="/Warehouse" component={Warehouse}/>
            <Route path="/SortingStation" component={SortingStation}/>
            <Route path="/SortingStationMap" component={SortingStationMap}/>


            <Route path="/goods" component={Goods} />
            <Route path="/category/first" component={CategoryFirst} />
            <Route path="/category/second" component={CategorySecond} />
            <Route path="/orders" component={Orders} />
            <Route path="/order/dispatch" component={OrderDispatch} />
            <Route path="/advertisments" component={Advs} />
            <Route path="/admins" component={Administrators} />
            {/* <Route paht="/admins" component={Administrators} /> */}
          </Layout>
        </Layout>
      </div>
    )
  }
}
