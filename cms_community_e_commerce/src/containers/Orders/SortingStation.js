//开始分拣 

import React from 'react';
import 'moment/locale/zh-cn';
import Panel from '../../components/Panel';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import * as utils from '../../utils';
import { USER_TOKEN, USER_USERTYPE } from '../../constants';
import { dateFormat } from '@/utils/index';
import { ADMIN_API } from '../../constants';
// import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import { Redirect } from 'react-router';
import {
    Layout,
    Table,
    Breadcrumb,
    Row,
    Col,
    Button,
    Icon,
    Divider,
    Descriptions,
    Popconfirm,
    Spin,
    Drawer,
} from 'antd';
import {
    authError
} from '../../actions/authAction';


@connect(
    state => ({
    }),
    dispatch => ({
        //加载订单数据
        loadOrders: (order, page_index, page_size, search) => {
            order.setState({
                isFetching: true
            })
            try {
                var url = `${ADMIN_API}/order/get_list`
                var params = { "page_index": page_index, "page_size": page_size, "token": utils.getStorage(USER_TOKEN) }
                params["order_db_status"] = '0'//代拣货
                axios.post(url, params).then(res => {
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        const list = res.data.result.list
                        //遍历数据
                        for (var index in list) {
                            //替换掉数据中的空值
                            var tmp_data = list[index]
                            Object.keys(tmp_data).forEach(res => {
                                if (tmp_data[res] === '') {
                                    tmp_data[res] = '未编辑'
                                }
                            })
                        }
                        order.setState({
                            isFetching: false,
                            orders: list,
                            data_page_index: res.data.result.page_index,
                            data_page_size: res.data.result.page_size,
                            data_page_total: res.data.result.all_count,
                            data_search_params: search
                        })
                    } else {
                        console.log('test error')
                        dispatch(authError(res.data.message, res.data.requestStatus))
                    }
                })
            } catch (err) {
                if (err.response !== undefined && err.response.status === 401) {
                    const errorMessage = '您的登录已过期，请重新登录'
                    dispatch(authError(errorMessage))
                }else{
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }

            }
        },
        //查询课程对应教材
        findCur: (order, curName) => {
            try {
                var url = `${ADMIN_API}/curriculum/findCur`
                var params = { "curName": curName, "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                axios.post(url, params).then(res => {
                    console.log("login - result " + JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        order.setState({
                            findCurLoad: false,
                            cur_detail_list: res.data.result[curName],
                        })
                    } else {
                        dispatch(authError(res.data.message, res.data.requestStatus))
                    }
                })
            } catch (err) {
                if (err.response !== undefined && err.response.status === 401) {
                    const errorMessage = '您的登录已过期，请重新登录'
                    dispatch(authError(errorMessage))
                }else{
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }

            }
        },
        //批量查询订单课程管理教材
        findCurList: (order, curNameList,orderModel) => {
            order.setState({
                findCurListState:true,
            })
            try {
                var url = `${ADMIN_API}/curriculum/findCur`
                var params = { "curNameList": curNameList, "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                axios.post(url, params).then(res => {
                    console.log("login - result " + JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        order.setState({
                            findCurListState:false,
                            findCurDataMap: res.data.result,
                            findCurOrderList:orderModel
                        })
                    } else {
                        dispatch(authError(res.data.message, res.data.requestStatus))
                    }
                })
            } catch (err) {
                if (err.response !== undefined && err.response.status === 401) {
                    const errorMessage = '您的登录已过期，请重新登录'
                    dispatch(authError(errorMessage))
                }else{
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }

            }
        },
    }))

//开始分拣,选择列表
export default class SortingStation extends React.Component {
    static propTypes = {
        // adminId: PropTypes.number.isRequired,
        // token: PropTypes.string.isRequired,
        // all_page:PropTypes.number,
        orders: PropTypes.array,
        isFetching: PropTypes.bool,
        loadOrders: PropTypes.func.isRequired,
        orders_status_list: PropTypes.array,
        data_page_index: PropTypes.number,
        data_page_size: PropTypes.number,
        data_page_total: PropTypes.number,
        data_search_params: PropTypes.object,
    }

    state = {
        filteredInfo: null,
        sortedInfo: null,
        visible: false,
        isFetching: false,
        findCurLoad: false,
        selectCur: '',//选中查看的课程
        cur_detail_list: [],//打开后显示的课程详细
    }
    componentDidMount() {
        this.loadOrders(0, 20, {})
    }
    loadOrders = async (page_index, page_size, params) => {
        await this.props.loadOrders(this, page_index, page_size, params)
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter
        })
    }


    // 回调函数，切换下一页
    changePage(current) {
        this.loadOrders(current - 1, this.state.data_page_size, this.state.data_search_params)
    }
    // 回调函数,每页显示多少条
    changePageSize(pageSize, current) {
        // 将当前改变的每页条数存到state中
        this.setState({
            data_page_size: pageSize,
        });
        this.loadOrders(0, pageSize, this.state.data_search_params)
    }


    renderExpanded = (record) => {
        return (
            <div>
                <Descriptions title="收件人">
                    <Descriptions.Item label="名称">{record.user_name}</Descriptions.Item>
                    <Descriptions.Item label="手机号码">{record.user_phone}</Descriptions.Item>
                    <Descriptions.Item label="地址">{record.user_addr}</Descriptions.Item>
                    <Descriptions.Item label="收件人公司">{record.user_company === '' ? '未设置' : record.user_company}</Descriptions.Item>
                    <Descriptions.Item label="包裹数量">{record.order_package_number}</Descriptions.Item>
                    <Descriptions.Item label="下单时间">{record.order_time}</Descriptions.Item>
                </Descriptions>
                <Descriptions title="仓库状态">
                    <Descriptions.Item label="课程" style={{ color: 'red' }}>
                        <Button type="link" onClick={() => {
                            this.setState({
                                visible: true,
                                selectCur: record.curriculum,
                                findCurLoad: true,
                                cur_detail_list: [],
                            });
                            this.props.findCur(this, record.curriculum.replace (/^\s+|\s+$/g,""))
                        }}>
                            {record.curriculum}
                        </Button>
                    </Descriptions.Item>
                    <Descriptions.Item label="当前订单状态">{['待拣货', '拣货中', '待打包', '待发货', '发货中', '已收件', '已存档'][record.order_db_status]}</Descriptions.Item>
                    <Descriptions.Item label="DB入库时间">{dateFormat(new Date(record.order_db_install_time), 'yyyy-MM-dd hh:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item label="DB更新时间">{dateFormat(new Date(record.order_db_update_time), 'yyyy-MM-dd hh:mm:ss')}</Descriptions.Item>
                </Descriptions>
                <Descriptions title="订单">
                    <Descriptions.Item label="订单号">{record.order_id}</Descriptions.Item>
                    <Descriptions.Item label="运单号">{record.tracking_id}</Descriptions.Item>
                    <Descriptions.Item label="平台订单号">{record.platform_id}</Descriptions.Item>
                    <Descriptions.Item label="换单单号">{record.other_order_id === '' ? '未设置' : record.other_order_id}</Descriptions.Item>
                    <Descriptions.Item label="状态">{record.order_status}</Descriptions.Item>
                </Descriptions>
                <Descriptions title="下单/寄件">
                    <Descriptions.Item label="下单人">{record.other_param_5}</Descriptions.Item>
                    <Descriptions.Item label="下单账号">{record.other_param_6}</Descriptions.Item>
                    <Descriptions.Item label="下单人部门">{record.other_param_7 !== '' ? record.other_param_7 : '未设置'}</Descriptions.Item>
                    <Descriptions.Item label="寄件人">{record.other_param_8}</Descriptions.Item>
                    <Descriptions.Item label="寄件人手机">{record.other_param_9}</Descriptions.Item>
                    <Descriptions.Item label="寄件人公司">{record.other_param_a}</Descriptions.Item>
                </Descriptions>
                <Descriptions title="其他">
                    <Descriptions.Item label="付费方式">{record.other_param_0}</Descriptions.Item>
                    <Descriptions.Item label="是否超区">{record.other_param_1}</Descriptions.Item>
                    <Descriptions.Item label="超区原因">{record.other_param_2 !== '' ? record.other_param_2 : '未设置'}</Descriptions.Item>
                    <Descriptions.Item label="取件码">{record.other_param_3 !== '' ? record.other_param_3 : '未设置'}</Descriptions.Item>
                    <Descriptions.Item label="代收货款">{record.other_param_4}</Descriptions.Item>
                    <Descriptions.Item label="业务类型">{record.other_param_b}</Descriptions.Item>
                    <Descriptions.Item label="物品名">{record.other_param_c}</Descriptions.Item>
                    <Descriptions.Item label="生鲜温层">{record.other_param_d}</Descriptions.Item>
                    <Descriptions.Item label="返单类型">{record.other_param_e}</Descriptions.Item>
                    <Descriptions.Item label="是否保价">{record.other_param_f}</Descriptions.Item>
                    <Descriptions.Item label="保价金额">{record.other_param_10}</Descriptions.Item>
                    <Descriptions.Item label="预计送达">{record.expected_time}</Descriptions.Item>
                    <Descriptions.Item label="下单重量(kg)">{record.order_weight}</Descriptions.Item>
                    <Descriptions.Item label="是否拒收">{record.other_param_11}</Descriptions.Item>
                    <Descriptions.Item label="验货方式">{record.other_param_12 !== '' ? record.other_param_12 : '未设置'}</Descriptions.Item>
                    <Descriptions.Item label="订单状态时间">{record.order_state_time}</Descriptions.Item>
                </Descriptions>
            </div>
        )
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            var selectedCurriculum = []
            for(var index in selectedRows)
            {
                var order_data = selectedRows[index]
                selectedCurriculum.push(order_data.curriculum.replace (/^\s+|\s+$/g,""))
            }
            this.setState({
                selectedCurriculum: selectedCurriculum,
                selectedOrderModel: selectedRows
            })
        },
        getCheckboxProps: record => ({
            disabled: record.order_db_status !== 0,
            name: record.curriculum,
            // key : record.curriculum,
        }),
    };



    render() {
        //记住这次找错render的bug
        if (this.state.findCurDataMap !== undefined) {
            return (<Redirect to={{ pathname: "/SortingStationMap", state: { findCurDataMap: this.state.findCurDataMap ,findCurOrderList:this.state.findCurOrderList} }} />);
        }
        const {
            isFetching
        } = this.state
        let orders = this.state.orders === undefined ? [] : this.state.orders
        const columns = [{
            title: '运单号',
            dataIndex: 'tracking_id',
            key: 'tracking_id',
        }, {
            title: '用户名称',
            dataIndex: 'user_name',
            key: 'user_name'
        }, {
            title: '课程',
            dataIndex: 'curriculum',
            key: 'curriculum'
        }, {
            title: '配送状态',
            dataIndex: 'order_db_status',
            key: 'order_db_status',
            render: (text, record) => { return (<span>{['待拣货', '拣货中', '待打包', '待发货', '发货中', '已收件', '已存档'][text]}</span>) }
        }, {
            title: '入库时间',
            dataIndex: 'order_db_install_time',
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
            title: '操作',
            dataIndex: 'remarks',
            key: 'remarks',
            width: 200,
            render: (text, record) => {
                return (
                    <Popconfirm
                        title="确认分拣订单?"
                        onConfirm={res => { this.props.findCurList(this,[record.curriculum.replace (/^\s+|\s+$/g,"")],[record])}}
                        onCancel={res => { }}
                        okText="开始"
                        cancelText="取消"
                        okType="default"
                        icon={<Icon type="exclamation-circle" style={{ color: 'blue' }} />}
                    >
                        <a style={{color:'#1890FF',fontWeight:'500',fontSize:'20'}}>
                            {"开始分拣"}
                        </a>
                        </Popconfirm>

                )
            }
        }]

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: false,
            showTotal: () => `共${this.state.data_page_total}条`,
            pageSize: this.state.data_page_size,
            current: this.state.data_page_index + 1,
            total: this.state.data_page_total,
            onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
            onChange: (current) => this.changePage(current),
            pageSizeOptions: ['10', '20', '50', '100']
        };

        return (
            <Layout.Content>
                <Panel minus>
                    <Panel.Header type="light">
                        <Breadcrumb>
                            <Breadcrumb.Item>主页</Breadcrumb.Item>
                            <Breadcrumb.Item>分拣管理</Breadcrumb.Item>
                            <Breadcrumb.Item>选择订单</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row >
                            <Col span={14} >
                                <h2>开始分拣</h2>
                            </Col>
                            {this.state.selectedCurriculum !== undefined && this.state.selectedCurriculum.length > 0 ? (
                                <Col span={10}  style={{ textAlign: 'right',marginTop:'20px' }}>
                                    <Button type="primary" onClick={() => { this.props.findCurList(this,this.state.selectedCurriculum,this.state.selectedOrderModel)}}>
                                        {this.state.findCurListState?<Spin />:"开始分拣"+this.state.selectedCurriculum.length + "个订单"}
                                    </Button>
                                </Col>):(<Col/>)
                            }
                        </Row>
                        <p>选择一个或多个订单进入分拣流程</p>
                        <Divider style={{ marginTop: '10px', marginBottom: '20px' }} />
                    </Panel.Header>
                    <Panel.Body type="light">
                        <Table
                            rowKey={record => record.order_id}
                            dataSource={orders}
                            expandedRowRender={this.renderExpanded}/**收缩/展开*/
                            columns={columns}
                            loading={isFetching}
                            bordered
                            onChange={this.handleTableChange}
                            pagination={paginationProps}
                            rowSelection={this.rowSelection}
                        />
                    </Panel.Body>
                </Panel>
                <Drawer
                    title={this.state.selectCur}
                    placement="right"
                    closable={false}
                    onClose={() => {
                        this.setState({
                            visible: false,
                            findCurLoad: false,
                        });
                    }}
                    visible={this.state.visible}
                >
                    {this.state.findCurLoad ? (<Spin />) : (<div />)}
                    {this.state.cur_detail_list.map((detail, index) => {
                        return (<Descriptions title={detail.c_name} key={"detail_" + index} column={1}>
                            <Descriptions.Item label={"数量"}>{detail.c_num}</Descriptions.Item>
                            <Descriptions.Item label={"课程id"}>{detail.c_id}</Descriptions.Item>
                            {Object.keys(detail.c_goods_list).map((goods_id, index) => {
                                let goods_detail = detail.c_goods_list[goods_id]
                                return (<Descriptions.Item label={"教材" + goods_id} key={"goods_id" + index}>
                                    {
                                        goods_detail.g_p_0 === undefined ? (
                                            <p style={{color:'red'}}>{"没有找到对应的教材"}</p>
                                        ) : goods_detail.g_p_0 + " " + goods_detail.g_p_1 + " " + goods_detail.g_p_2 + " " + goods_detail.g_p_3 + " " + goods_detail.g_p_4 + " " + goods_detail.g_p_5}<br />{(goods_detail.g_p_0 !== undefined ? new Date(goods_detail.goods_expiration_date).getTime() < new Date().getTime() ? (
                                            <p style={{color:'red'}}>{'已过期 ' + goods_detail.goods_expiration_date }</p>) : (<p>{'仓库位置:' + goods_detail.g_goods_position_list }</p>): '')
                                    }
                                </Descriptions.Item>
                                )
                            })}
                            {detail.c_goods_list.length === 0 ? (
                                <Descriptions.Item >
                                    <p style={{ color: 'red' }}>
                                        {"没有找到课程详细教材"}
                                    </p>
                                </Descriptions.Item>
                            ) : (<div />)}
                        </Descriptions>
                        )
                    })}
                </Drawer>
            </Layout.Content>
        )
    }
}
