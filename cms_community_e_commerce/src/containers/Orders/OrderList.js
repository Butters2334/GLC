import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Panel from '@/components/Panel';
import axios from 'axios';
import * as utils from '../../utils';
import { USER_TOKEN, USER_USERTYPE } from '../../constants';
import { dateFormat } from '@/utils/index';
import { ADMIN_API } from '../../constants';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import { Redirect } from 'react-router';
import {
    Layout,
    Table,
    Breadcrumb,
    message,
    Form,
    Row,
    Col,
    Button,
    Icon,
    Select,
    DatePicker,
    Divider,
    Input,
    Descriptions,
    Popconfirm,
    Spin,
    Drawer,
    Steps,
} from 'antd';
import {
    authError
} from '../../actions/authAction';
import *as XLSX from 'xlsx';

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
class OrderListHeader extends React.Component {
    static propTypes = {
        handleSelectorChange: PropTypes.func.isRequired,
        orders_status_list: PropTypes.array,
        isFetching: PropTypes.bool,
    }

    handleSubmit = (e) => {
        e.preventDefault()

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (values.status === '全部') {
                values.status = null
            }

            this.props.handleSelectorChange(values)
        })
    }

    handleReset = () => {
        this.props.form.setFieldsValue({
            orderId: '',
            userName: '',
            createTime: '',
            status: '全部'
        })
        this.props.handleSelectorChange({})
    }

    onDateChange = (date, dateString) => {
        console.log(date, dateString);
    }

    handleStatusChange = (value) => {
        this.props.form.setFieldsValue({
            status: value
        })
    }

    render() {
        const {
            form
        } = this.props

        const { getFieldDecorator } = form

        var orders_status_list = () => {
            var res = []
            for (var index in this.props.orders_status_list) {
                var status = this.props.orders_status_list[index]
                res.push(<Option key={index} value={status}>{status}</Option>)
            }
            return res
        }

        return (
            <Panel.Header type="light">
                <Breadcrumb>
                    <Breadcrumb.Item>主页</Breadcrumb.Item>
                    <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                    <Breadcrumb.Item>订单查询</Breadcrumb.Item>
                </Breadcrumb>
                <Row >
                    <Col span={14} >
                        <h2>订单查询</h2>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right', marginTop: '20px' }}>
                        {this.props.isFetching ? <Spin /> : (
                            <Button type="primary" onClick={() => { this.props.export_xls_event() }}>
                                {this.props.selectedRowData !== undefined && this.props.selectedRowData.length > 0 ? "导出" + this.props.selectedRowData.length + "条数据" : "导出全部数据"}
                            </Button>
                        )}
                    </Col>
                </Row>
                <p>展示全部订单信息，组合查询订单信息</p>
                <Divider style={{ marginTop: '10px', marginBottom: '30px' }} />
                <Form className="form-search" onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col span={3}>
                            <FormItem label="订单ID" className="form-flex-wrapper">
                                {getFieldDecorator('orderId')(
                                    <Input type="text" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={3}>
                            <FormItem
                                className="form-flex-wrapper"
                                label="用户名称"
                            >
                                {getFieldDecorator('userName', {
                                    initialValue: ""
                                })(
                                    <Input type="text" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem label="时间:">
                                {getFieldDecorator('createTime', {
                                    initialValue: ''
                                })(
                                    <DatePicker.RangePicker style={{ marginLeft: '10px' }} locale={locale} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem label="订单状态:">
                                {getFieldDecorator('status', {
                                    initialValue: '全部'
                                })(
                                    <Select
                                        onChange={this.handleStatusChange}
                                        style={{ width: '130px' }}
                                    >
                                        {
                                            orders_status_list()
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '60px' }}
                            >
                                {this.props.isFetching ? <Spin /> : "搜索"}
                            </Button>
                            <Divider type="vertical" />
                            <Button type="dashed" onClick={this.handleReset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
            </Panel.Header>
        )
    }
}

@connect(
    state => ({
        // orders: state.orders.orders,
        // isFetching: state.orders.isFetchingOrders
    }),
    dispatch => ({
        //删除指定订单数据
        deleteOrder: (order, order_data) => {
            order.setState({
                isFetching: true
            })
            try {
                var url = `${ADMIN_API}/order/delete`
                var params = { "o_id": order_data.order_id, "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                axios.post(url, params).then(res => {
                    console.log("login - result " + JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        var list = order.state.orders
                        var data_index = list.indexOf(order_data)
                        list.splice(data_index, 1)
                        order.setState({
                            isFetching: false,
                            orders: list
                        })
                        message.success(`${res.data.message}`);
                    } else {
                        dispatch(authError(res.data.message, res.data.requestStatus))
                    }
                })
            } catch (err) {
                if (err.response !== undefined && err.response.status === 401) {
                    const errorMessage = '您的登录已过期，请重新登录'
                    dispatch(authError(errorMessage))
                } else {
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }

            }
        },
        //获取当前所有订单状态,用于筛选
        getStatusList: (order) => {
            // order.setState({
            //     isFetching: true
            // })
            try {
                var url = `${ADMIN_API}/order/get_status_list`
                var params = { "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                axios.post(url, params).then(res => {
                    console.log("login - result " + JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        const status = res.data.result.status
                        order.setState({
                            // isFetching: false,
                            orders_status_list: status,
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
                } else {
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }

            }
        },
        //获取当前所有数据,用于导出,数据不保存
        getAllOrders: (order, search) => {
            order.setState({
                isFetching: true
            })
            try {
                var url = `${ADMIN_API}/order/get_list`
                var params = { "page_index": 0, "page_size": 9999, "token": utils.getStorage(USER_TOKEN) }
                if (search["orderId"]) {
                    params["order_id"] = search["orderId"]
                }
                if (search["status"]) {
                    params["order_status"] = search["status"]
                }
                if (search["userName"]) {
                    params["user_name"] = search["userName"]
                }
                if (search["start"]) {
                    params["start_time"] = search["start"]
                }
                if (search["end"]) {
                    params["end_time"] = search["end"]
                }
                axios.post(url, params).then(res => {
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        const list = res.data.result.list
                        //遍历数据
                        for (var index in list) {
                            //替换掉数据中的空值
                            var tmp_data = list[index]
                            // eslint-disable-next-line no-loop-func
                            Object.keys(tmp_data).forEach(res => {
                                if (tmp_data[res] === '') {
                                    tmp_data[res] = '未编辑'
                                }
                            })
                        }
                        order.export_data_toJSON(list)
                        order.setState({
                            isFetching: false,
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
                } else {
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }
            }
        },
        //获取指定订单数据
        loadOrders: (order, page_index, page_size, search) => {
            order.setState({
                isFetching: true
            })
            console.log(search)
            try {
                var url = `${ADMIN_API}/order/get_list`
                var params = { "page_index": page_index, "page_size": page_size, "token": utils.getStorage(USER_TOKEN) }
                if (search["orderId"]) {
                    params["order_id"] = search["orderId"]
                }
                if (search["status"]) {
                    params["order_status"] = search["status"]
                }
                if (search["userName"]) {
                    params["user_name"] = search["userName"]
                }
                if (search["start"]) {
                    params["start_time"] = search["start"]
                }
                if (search["end"]) {
                    params["end_time"] = search["end"]
                }
                // console.log('body - '+JSON.stringify(params))
                axios.post(url, params).then(res => {
                    // console.log("login - result "+JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        const list = res.data.result.list
                        //遍历数据
                        for (var index in list) {
                            //替换掉数据中的空值
                            var tmp_data = list[index]
                            // eslint-disable-next-line no-loop-func
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
                } else {
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }

            }
        },
        //查询课程下教材详细
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
                } else {
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }

            }
        },
        //查询快递单下对应数据
        findExpress: (order, tracking_id, requestNumber) => {
            try {
                console.log("requestNumber - " + requestNumber)
                axios.get('https://biz.trace.ickd.cn/jingdong/' + tracking_id + '?tk=43aaaa31&tm=1585661781224&_1585661781225', {
                    headers: {
                        'referer': 'https://www.ickd.cn/jingdong.html',
                        'cookie': 'Hm_lvt_39418dcb8e053c84230016438f4ac86c=1585661781,1585661781; Hm_lpvt_39418dcb8e053c84230016438f4ac86c=1585661781;'
                    }
                }).then(res => {
                    console.log("login - result " + JSON.stringify(res.data))
                    //status 0查询失败1查询正常3返回干扰数据
                    //只有状态为1的时候才能用,但是为0的时候也勉强显示,毕竟快递有可能投递失败
                    if (requestNumber >= 10)//重复查询10次都错误的情况下,可能订单本身就是错误的
                    {
                        order.setState({
                            findExpressLoad: false,
                            express_detail_list: [],
                        })
                    } else if (res.data.status === 3) {
                        order.props.findExpress(order, tracking_id, requestNumber + 1);
                    } else {
                        order.setState({
                            findExpressLoad: false,
                            express_detail_list: res.data.data,
                        })
                    }
                })
            } catch (err) {
                order.setState({
                    findExpressLoad: false,
                    express_detail_list: [],
                })
            }
        },
    }))
export default class OrderList extends React.Component {
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
        curVisible: false,
        expressVisible: false,
        isFetching: false,
        findCurLoad: false,
        selectCur: '',//选中查看的课程
        cur_detail_list: [],//打开后显示的课程详细
        express_detail_list: [],//查询到快递单详情
    }

    componentDidMount() {
        this.props.getStatusList(this)
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

    onSelectorChange = (value) => {
        const status = typeof value.status !== 'undefined' && value.status !== '全部' ? value.status : null
        const start = value.createTime ? value.createTime[0].format('YYYY-MM-DD') : null
        const end = value.createTime ? value.createTime[1].format('YYYY-MM-DD') : null
        const userName = value.userName && value.userName !== '' ? value.userName : null
        const orderId = value.orderId && value.orderId !== '' ? (value.orderId) : null

        const params = {
            status,
            start,
            end,
            userName,
            orderId
        }

        this.loadOrders(0, 20, params)
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
                                curVisible: true,
                                selectCur: record.curriculum,
                                findCurLoad: true,
                                cur_detail_list: [],
                            });
                            this.props.findCur(this, record.curriculum.replace(/^\s+|\s+$/g, ""))
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
                    <Descriptions.Item label="运单号">
                        <Button type="link" disabled={record.tracking_id==='未编辑'} onClick={() => {
                            this.setState({
                                expressVisible: true,
                                selectExpressId: record.tracking_id,
                                findExpressLoad: true,
                                express_detail_list: [],
                            });
                            this.props.findExpress(this, record.tracking_id, 1)
                        }}>
                            {record.tracking_id}
                        </Button>
                    </Descriptions.Item>
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
            this.setState({
                selectedRowData: selectedRows
            })
        },
        getCheckboxProps: record => ({
            disabled: false,
            name: record.curriculum,
        }),
    };
    export_xls_event = () => {
        if (this.state.selectedRowData !== undefined && this.state.selectedRowData.length > 0) {
            this.export_data_toJSON(this.state.selectedRowData)
        } else {
            this.props.getAllOrders(this, this.state.data_search_params)
        }
    }
    export_data_toJSON = (selectedRowData) => {
        const entozh = {
            "tracking_id": "运单号",
            "user_name": "用户名称",
            "curriculum": "课程",
            "order_db_status": "配送状态",
            "order_db_install_time": "入库时间",
        }
        var json = []
        selectedRowData.map((selectItem) => {
            var line = {}
            Object.keys(entozh).map((key) => {
                line[entozh[key]] = selectItem[key]
                if (key === 'order_db_status') {
                    line[entozh[key]] = ['待拣货', '拣货中', '待打包', '待发货', '发货中', '已收件', '已存档'][selectItem[key]]
                }
                return ""
            })
            json.push(line)
            return ""
        })
        const sheet = XLSX.utils.json_to_sheet(json);
        this.openDownloadDialog(this.sheet2blob(sheet, '订单信息'), `导出订单.xlsx`);
    }
    openDownloadDialog = (url, saveName) => {
        if (typeof url === 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if (window.MouseEvent) event = new MouseEvent('click');
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }
    sheet2blob = (sheet, sheetName) => {
        sheetName = sheetName || 'sheet1';
        var workbook = {
            SheetNames: [sheetName],
            Sheets: {}
        };
        workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

        var wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
        };
        var wbout = XLSX.write(workbook, wopts);
        var blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream"
        }); // 字符串转ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        return blob;
    }


    render() {
        //记住这次找错render的bug
        if (this.state.pushToEditData) {
            return (<Redirect to={{ pathname: "/orderEdit", state: { originalData: this.state.pushToEditData } }} />);
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
                if (utils.getStorage(USER_USERTYPE) !== "2") {
                    return (<div><p style={{ color: 'light' }}>{"不可编辑"}</p></div>)
                }
                return (
                    <Row span={24}>
                        <Col span={6}>
                            <a onClick={res => { this.setState({ pushToEditData: record }) }}>
                                {"编辑\t\t"}</a>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={6}>
                            <Popconfirm
                                title="确认删除订单?"
                                onConfirm={res => { this.props.deleteOrder(this, record) }}
                                onCancel={res => { }}
                                okText="删除"
                                cancelText="否"
                                okType="danger"
                                icon={<Icon type="exclamation-circle" style={{ color: 'red' }} />}
                            >
                                <a style={{ color: 'red' }}>删除</a>
                            </Popconfirm>
                        </Col>
                    </Row>
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

        const { Step } = Steps;

        return (
            <Layout.Content>
                <Panel minus>
                    <OrderListHeader
                        handleSelectorChange={this.onSelectorChange}
                        orders_status_list={this.state.orders_status_list}
                        isFetching={isFetching}
                        selectedRowData={this.state.selectedRowData}
                        export_xls_event={this.export_xls_event}
                    />
                    <Panel.Body type="light">
                        {
                            utils.getStorage(USER_USERTYPE) !== "2" ? (
                                <Table
                                    rowKey={record => record.order_id}
                                    dataSource={orders}
                                    expandedRowRender={this.renderExpanded}/**收缩/展开*/
                                    columns={columns}
                                    loading={isFetching}
                                    bordered
                                    onChange={this.handleTableChange}
                                    pagination={paginationProps}
                                />
                            ) : (<Table
                                rowKey={record => record.order_id}
                                dataSource={orders}
                                expandedRowRender={this.renderExpanded}/**收缩/展开*/
                                columns={columns}
                                loading={isFetching}
                                bordered
                                onChange={this.handleTableChange}
                                pagination={paginationProps}
                                rowSelection={this.rowSelection}
                            />)
                        }
                    </Panel.Body>
                </Panel>
                <Drawer
                    title={this.state.selectCur}
                    placement="right"
                    closable={false}
                    onClose={() => {
                        this.setState({
                            curVisible: false,
                            findCurLoad: false,
                        });
                    }}
                    visible={this.state.curVisible}
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
                                            <p style={{ color: 'red' }}>{"没有找到对应的教材"}</p>
                                        ) : goods_detail.g_p_0 + " " + goods_detail.g_p_1 + " " + goods_detail.g_p_2 + " " + goods_detail.g_p_3 + " " + goods_detail.g_p_4 + " " + goods_detail.g_p_5}<br />{(goods_detail.g_p_0 !== undefined ? new Date(goods_detail.goods_expiration_date).getTime() < new Date().getTime() ? (
                                            <p style={{ color: 'red' }}>{'已过期 ' + goods_detail.goods_expiration_date}</p>) : (<p>{'仓库位置:' + goods_detail.g_goods_position_list}</p>) : '')
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
                <Drawer
                    title={this.state.selectExpressId}
                    placement="right"
                    closable={false}
                    onClose={() => {
                        this.setState({
                            expressVisible: false,
                            findExpressLoad: false,
                        });
                    }}
                    visible={this.state.expressVisible}
                >
                    {this.state.findExpressLoad ? (<Spin />) : (
                        this.state.express_detail_list.length == 0 ? (<p style={{ 'color': '#f00' }}>{"没有查询到快递详情"}</p>) : (
                            <Steps direction="vertical" size="small" current={1}>
                                {this.state.express_detail_list.map((detail, index) => {
                                    return (
                                        <Step key={"Step_" + this.state.selectExpressId + "_" + index} title={detail.context} description={detail.time} />
                                    )
                                })}
                            </Steps>)
                    )}
                </Drawer>
            </Layout.Content>
        )
    }
}
