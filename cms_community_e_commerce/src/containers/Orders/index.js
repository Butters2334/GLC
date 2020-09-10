import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Panel from '@/components/Panel';
import {
  Button,
  Layout,
  Breadcrumb,
  Divider,
  Table,
  Form
} from 'antd';
import {
  getAllOrders
} from '@/actions/index';
import { dateFormat } from '@/utils/index';
import SelectorHeader from './SelectorHeader';
import StatusFilter from './StatusFilter';
import DetailItem from './DetailItem';

@connect(
  state => ({
    // adminId: state.auth.admin.adminId
    // token: state.auth.admin.token,
    orders: state.orders.orders,
    isFetching: state.orders.isFetchingOrders
  }),
  dispatch => ({
    loadOrders: (page_index,page_size) => {
      dispatch(getAllOrders(page_index,page_size))
    }
  })
)
export default class Orders extends React.Component {
  static propTypes = {
    // adminId: PropTypes.number.isRequired,
    // token: PropTypes.string.isRequired,
    all_page:PropTypes.number,
    orders: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    loadOrders: PropTypes.func.isRequired
  }

  state = {
    filteredInfo: null,
    sortedInfo: null
  }

  componentDidMount() {
      console.log('order - token '+JSON.stringify(this.state))
      console.log('order - token2 '+JSON.stringify(this.props))
    //   console.log("this.props.orders - "+this.props.orders)
    //   this.state.token = this.props
      this.loadOrders()
  }

  loadOrders = async (params) => {
    await this.props.loadOrders("0", "99999")
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    })
  }

  onSelectorChange = (value) => {
    const status = typeof value.status !== 'undefined' && value.status !== 'all' ? value.status : null
    const start = value.createTime ? value.createTime[0].format('YYYY-MM-DD') : null
    const end = value.createTime ? value.createTime[1].format('YYYY-MM-DD') : null
    const userName = value.userName && value.userName !== '' ? value.userName : null
    const orderId = value.orderId ? parseInt(value.orderId) : null

    const params = {
      status,
      start,
      end,
      userName,
      orderId
    }

    this.loadOrders(params)
  }

  renderExpanded = (record) => {
    // const address = record.user_name +'\t\t'+ record.user_addr +'\t\t'+ record.user_phone
    return (
      <div>
            <div>
                <p>
                    收货地址：
                </p>
                <p>
                    {record.user_name}
                </p>
                <p>
                    {record.user_addr}
                </p>
                <p>
                    {record.user_phone}
                </p>
            </div>
        <h4>教材：</h4>
        <p>等待教材表关联之后再完善</p>
        {/* {
          record.orderDetails.length > 0 ? (
            record.orderDetails.map((item) => {
              return (
                <DetailItem
                  key={item.goodId}
                  detail={item}
                />
              )
            })
          ) : null
        } */}
      </div>
    )
  }

  render() {
    const {
      isFetching
    } = this.props
    // console.log("this.props.orders - "+this.props.orders)
    let orders = this.props.orders===undefined?[]:this.props.orders
    let {
      filteredInfo,
      sortedInfo
    } = this.state

    filteredInfo = filteredInfo || {}
    sortedInfo = sortedInfo || {}

    const columns =[{
      title: '订单名称',
      dataIndex: 'order_id',
      key: 'order_id',
      sorter: (a, b) => a.order_id === b.order_id,
      sortOrder: sortedInfo.columnKey === 'order_id' && sortedInfo.order_id
    }, {
      title: '用户名称',
      dataIndex: 'user_name',
      key: 'user_name'
    }, {
      title: '课程',
      dataIndex: 'curriculum',
      key: 'curriculum'
    }, {
      title: '订单状态',
      dataIndex: 'order_status',
      key: 'order_status',
    //   render: (text, record) => {
    //     return (
    //       <StatusFilter
    //         status={text}
    //       />
    //     )
    //   },
    //   filters: [
    //     { text: '未发货', value: '0' },
    //     { text: '配送中', value: '1' },
    //     { text: '已完成', value: '2' },
    //     { text: '退款中', value: '3' },
    //     { text: '退款成功', value: '-1'},
    //     { text: '退款失败', value: '-2'},
    //   ],
    //   filteredValue: filteredInfo.status || null,
    //   onFilter: (value, recored) => {
    //     return recored.status === parseInt(value, 10)
    //   }
    }, {
      title: '下单时间',
      dataIndex: 'order_time',
      render: (text, record) => {
        return (
          <span>
            {
              dateFormat(new Date(text), 'yyyy-MM-dd hh:mm:ss')
            }
          </span>
        )
      }
      // key: 'createTime',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks'
    }]

    return (
      <Layout.Content>
        <Panel minus>
          <SelectorHeader
            handleSelectorChange={this.onSelectorChange}
          />
          <Panel.Body type="light">
            <Table
              rowKey={record => record.order_id}
              dataSource={orders}
              expandedRowRender={this.renderExpanded}
              columns={columns}
              loading={isFetching}
              bordered
              onChange={this.handleTableChange}
            />
          </Panel.Body>
        </Panel>
      </Layout.Content>
    )
  }
}
