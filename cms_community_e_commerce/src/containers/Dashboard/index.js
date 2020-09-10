import React from 'react';
import { connect } from 'react-redux';
import {
  Layout,
  Tabs,
  Row,
  Col,
  Icon,
  Tooltip,
  Card,
  message,
  Spin,
} from 'antd';
import MetaBox from '@/components/MetaBox';
import Panel from '@/components/Panel';
import OrderCharts from './OrderCharts';
import ConversionCharts from './ConversionCharts';
import {
  statisticsOrder
} from '../../actions';
import { ADMIN_API } from '../../constants';
import {
    authError
} from '../../actions/authAction';
import * as utils from '../../utils';
import axios from 'axios';
import { USER_TOKEN,USER_USERTYPE } from '../../constants';

@connect(
  state => ({
    success: state.orders.success, // 成交订单
    successToday: state.orders.successToday, // 今日成交
    wait: state.orders.wait,  // 待发货
    waitToday: state.orders.waitToday, // 今日新增待发货
    totalSale: state.orders.totalSale, // 共销售
    todaySale: state.orders.todaySale, // 今日销售额
    userCount: state.orders.userCount, // 用户数量
    refunding: state.orders.refunding, // 退款中
    dispatching: state.orders.dispatching, // 配送中
    collection: state.orders.collection, // 收藏数量
    //adminId: state.auth.admin.adminId // 管理员id
    token: state.auth.admin.token, // token
  }),
  dispatch => ({
    fetchOrderStatus: (home, token) => {
        home.setState({
            isFetching: true
        })
        try {
            var url = `${ADMIN_API}/home/dashboard`
            var params = { "token": utils.getStorage(USER_TOKEN) }
            axios.post(url, params).then(res => {
                console.log("login - result " + JSON.stringify(res.data))
                if (res.status === 200 && res.data.requestStatus === 200) {
                    home.setState({
                        isFetching: false,
                        home: res.data.result
                    })
                    // message.success(`${res.data.message}`);
                } else {
                    dispatch(authError(res.data.message, res.data.requestStatus))
                }
            })
        } catch (err) {
            if (err.response === undefined) {
                const errorMessage = '服务器错误，请稍后再试'
                dispatch(authError(errorMessage))
            }
            if (err.response.status === 401) {
                const errorMessage = '您的登录已过期，请重新登录'
                dispatch(authError(errorMessage))
            }
        }
    },
})
)
export default class Dashboard extends React.Component {
    state = {
        home: [],
    }
  componentDidMount() {
    this.fetchOrderStatus()
  }

  fetchOrderStatus = async () => {
    const {
      
      token
    } = this.props

    await this.props.fetchOrderStatus(this,token)
  }

  render() {
    const {
      wait,
      waitToday,
      refunding,
      dispatching,
      success,
      successToday,
      totalSale,
      todaySale,
      collection,
      userCount
    } = this.props

    //订单情况概要显示
    var seriesData =[]
    var legendData = []
    var order_status = this.state.home!==null&&this.state.home!==undefined?this.state.home.order_status:[]
    for(var index in order_status)
    {
        var status_data = order_status[index]
        seriesData.push({value: status_data.status_count, name:status_data.status_name})
        legendData.push(status_data.status_name)
    }
    var dataTime   = new Date()

    //异常情况概要显示
    var legendData2 = ['今日异常订单','今日打包教材','今日出库教材']
    var seriesData2 = [
        {value: collection, name:legendData2[0]},
        {value: success, name:legendData2[1]},
        {value: success, name:legendData2[2]},
      ];

    return (
      <Layout.Content style={{backgroundColor: '#f0f2f5'}}>
          {(this.state.isFetching?<Spin size='large'/>:<div/>)}
          <Row gutter={24}>
         <Row gutter={12} style={{padding: '0px'}} span={12}>
          <Col className="gutter-row" span={6}>
            <MetaBox
              title={utils.getStorage(USER_USERTYPE)==="0"?"剩余课程":"今日课程"}
            //   icon={<Icon type="info-circle-o" />}
            //   tipStr={"1"}
              info={'' + (this.state.home.today_cur_count===undefined?"0":this.state.home.today_cur_count)}
              desc={"课程总数\t" + (this.state.home.all_cur_count===undefined?"0":this.state.home.all_cur_count)}
            >
            </MetaBox>
          </Col>
          <Col className="gutter-row" span={6}>
            <MetaBox
              title={utils.getStorage(USER_USERTYPE)==="0"?"剩余教材":"今日教材"}
            //   icon={<Icon type="info-circle-o" />}
            //   tipStr={"2"}
              info={this.state.home.today_goods_count===undefined?"0":this.state.home.today_goods_count}
              desc={"教材总数\t" + (this.state.home.all_goods_count===undefined?"0":this.state.home.all_goods_count)}
            >
            </MetaBox>
          </Col>
          <Col className="gutter-row" span={6}>
            <MetaBox
              title={utils.getStorage(USER_USERTYPE)==="0"?"剩余订单":"今日订单"}
            //   icon={<Icon type="info-circle-o" />}
            //   tipStr={"3"}
              info={''+(this.state.home.today_order_count===undefined?"0":this.state.home.today_order_count)}
              desc={"订单总数\t" + (this.state.home.all_order_count===undefined?"0":this.state.home.all_order_count)}
            >
            </MetaBox>
          </Col>
          <Col className="gutter-row" span={6}>
            <MetaBox
              title="失效订单"
              icon={<Icon type="info-circle-o" />}
              tipStr={"没有在订单提交当天完成发货的订单都会被归类为延期订单"}
              info={success}
              desc={"异常订单\t" + successToday}
            >
            </MetaBox>
          </Col>
        </Row>
        {/* <Panel style={{marginTop: '30px'}}>
          <Panel.Body type="light">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="订单概要" key="1">
                <OrderCharts />
              </Tabs.TabPane>
              <Tabs.TabPane tab="收藏转化率" key="2">
                <ConversionCharts />
              </Tabs.TabPane>
            </Tabs>
          </Panel.Body>
        </Panel> */}
        <Row gutter={24} style={{marginTop: '30px'}}  span={12}>
          <Col span={12} style={{bakcground: '#fff'}}>
            <OrderCharts 
            seriesData={seriesData}
            legendData={legendData}
            dataTime  ={dataTime}
            />
          </Col>
          <Col span={12}>
            <ConversionCharts 
            legendData={legendData2} 
            seriesData={seriesData2} />
          </Col>
        </Row>
        </Row>
      </Layout.Content>
    )
  }
}

// function toThousands (str) {
//   if (!str) {
//     return ''
//   }

//   return str.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
// }
