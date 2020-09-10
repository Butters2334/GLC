import React from 'react';
import 'moment/locale/zh-cn';
import {
    Layout,
    Divider,
    Form,
    Row,
    Col,
    Breadcrumb,
    Input,
    Button,
    Popconfirm,
    Select,
} from 'antd';
import { Icon, message } from 'antd';
import Panel from '../../components/Panel';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Panel from '@/components/Panel';
import axios from 'axios';
import * as utils from '../../utils';
import { USER_TOKEN } from '../../constants';
import { ADMIN_API } from '../../constants';
import 'moment/locale/zh-cn';
import {
    authError
} from '../../actions/authAction';
import { Redirect } from 'react-router';
import { dateFormat } from '@/utils/index';


@Form.create()
@connect(
    state => ({
    }),
    dispatch => ({
        deleteOrder: (order, order_data) => {
            order.setState({
                isFetching: true
            })
            try {
                var url = `${ADMIN_API}/order/delete`
                var params = { "o_id": order_data.order_id, "token": utils.getStorage(USER_TOKEN) }
                // console.log('body - '+JSON.stringify(params))
                axios.post(url, params).then(res => {
                    // console.log("login - result "+JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        message.success(`${res.data.message}`);
                        order.setState({
                            pushToList: true
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
        editorder: (order, data) => {
            try {
                var url = `${ADMIN_API}/order/modify`
                var params = { "o_id": data.order_id, "o_list": [data.order_id, data.tracking_id, data.platform_id, data.other_order_id, data.order_status, data.other_param_, data.other_param_, data.other_param_2, data.other_param_3, data.other_param_4, data.other_param_5, data.other_param_6, data.other_param_7, data.other_param_8, data.other_param_9, data.other_param_a, data.user_name, data.user_phone, data.user_addr, data.user_company, data.order_package_number, data.curriculum.replace (/^\s+|\s+$/g,""), data.order_time, data.other_param_b, data.other_param_c, data.other_param_d, data.other_param_e, data.other_param_f, data.other_param_, data.expected_time, data.order_weight, data.other_param_, data.other_param_2, data.order_state_time, data.order_db_status], "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                var dispatch_tmp = dispatch
                axios.post(url, params).then(res => {
                    //   console.log("login - result "+JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        message.success(`${res.data.message}`);
                        order.setState({
                            pushToList: true
                        })
                    } else {
                        console.log('test error')
                        dispatch_tmp(authError(res.data.message, res.data.requestStatus))
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
        }
    }))
export default class OrderEdit extends React.Component {
    static propTypes = {
        pushToList: PropTypes.bool,
        // originalData : PropTypes.object.isRequired
    }
    state = {
        pushToList: false,
    }

    handleSubmit = (e) => {
        e.preventDefault()

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (values.curriculum === '') {
                message.error('教材为空');
                return;
            }
            if (values.user_addr === '') {
                message.error('收件地址为空');
                return;
            }
            if (values.order_id === '') {
                message.error('订单id为空');
                return;
            }
            if (values.user_name === '') {
                message.error('收件人为空');
                return;
            }
            if (values.user_phone === '') {
                message.error('收件人手机号码为空');
                return;
            }
            this.props.editorder(this, values)
        })
    }

    handleReset = () => {
        var o_data = this.props.location.state.originalData
        this.props.form.setFieldsValue({
            order_id: o_data.order_id,
            tracking_id: o_data.tracking_id.replace("未编辑", ""),
            platform_id: o_data.platform_id.replace("未编辑", ""),
            other_order_id: o_data.other_order_id.replace("未编辑", ""),
            order_status: o_data.order_status.replace("未编辑", ""),
            other_param_0: o_data.other_param_0.replace("未编辑", ""),
            other_param_1: o_data.other_param_1.replace("未编辑", ""),
            other_param_2: o_data.other_param_2.replace("未编辑", ""),
            other_param_3: o_data.other_param_3.replace("未编辑", ""),
            other_param_4: o_data.other_param_4.replace("未编辑", ""),
            other_param_5: o_data.other_param_5.replace("未编辑", ""),
            other_param_6: o_data.other_param_6.replace("未编辑", ""),
            other_param_7: o_data.other_param_7.replace("未编辑", ""),
            other_param_8: o_data.other_param_8.replace("未编辑", ""),
            other_param_9: o_data.other_param_9.replace("未编辑", ""),
            other_param_a: o_data.other_param_a.replace("未编辑", ""),
            user_name: o_data.user_name.replace("未编辑", ""),
            user_phone: o_data.user_phone.replace("未编辑", ""),
            user_addr: o_data.user_addr.replace("未编辑", ""),
            user_company: o_data.user_company.replace("未编辑", ""),
            order_package_number: o_data.order_package_number.replace("未编辑", ""),
            curriculum: o_data.curriculum.replace("未编辑", ""),
            order_time: o_data.order_time.replace("未编辑", ""),
            other_param_b: o_data.other_param_b.replace("未编辑", ""),
            other_param_c: o_data.other_param_c.replace("未编辑", ""),
            other_param_d: o_data.other_param_d.replace("未编辑", ""),
            other_param_e: o_data.other_param_e.replace("未编辑", ""),
            other_param_f: o_data.other_param_f.replace("未编辑", ""),
            other_param_10: o_data.other_param_10.replace("未编辑", ""),
            expected_time: o_data.expected_time.replace("未编辑", ""),
            order_weight: o_data.order_weight.replace("未编辑", ""),
            other_param_11: o_data.other_param_11.replace("未编辑", ""),
            other_param_12: o_data.other_param_12.replace("未编辑", ""),
            order_state_time: o_data.order_state_time.replace("未编辑", ""),
            order_db_status: o_data.order_db_status,
            order_db_install_time: dateFormat(new Date(o_data.order_db_install_time), 'yyyy-MM-dd hh:mm:ss'),
            order_db_update_time: dateFormat(new Date(o_data.order_db_update_time), 'yyyy-MM-dd hh:mm:ss'),
        })
    }
    render() {
        if (this.state.pushToList) {
            return (<Redirect to="/orderList" />);
        }
        const {
            form
        } = this.props

        const { getFieldDecorator } = form
        var o_data = this.props.location.state.originalData
        console.log("o_data - " + JSON.stringify(o_data))
        return (
            <Layout.Content>
                <Panel minus>
                    <Panel.Header type="light">
                        <Breadcrumb>
                            <Breadcrumb.Item>主页</Breadcrumb.Item>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>修改订单</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>修改订单</h2>
                        <p>修改原有订单数据,订单id不可修改,分割线以下非必填</p>
                        <Divider style={{ marginTop: '10px', marginBottom: '30px' }} />
                        <Form className="form-search" onSubmit={this.handleSubmit}>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="订单id" >
                                                {getFieldDecorator('order_id', { initialValue: o_data.order_id })(
                                                    <Input type="text" disabled={true} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="运单号" >
                                                {getFieldDecorator('tracking_id', { initialValue: o_data.tracking_id.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="平台订单号" >
                                                {getFieldDecorator('platform_id', { initialValue: o_data.platform_id.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="收件人">
                                                {getFieldDecorator('user_name', {
                                                    initialValue: o_data.user_name
                                                        .replace("未编辑", "")
                                                })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="手机号码">
                                                {getFieldDecorator('user_phone', { initialValue: o_data.user_phone.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Form.Item className="form-flex-wrapper" label="收货地址">
                                            {getFieldDecorator('user_addr', { initialValue: o_data.user_addr.replace("未编辑", "") })(
                                                <Input type="text" />
                                            )}
                                        </Form.Item>
                                    </Row>
                                    <Row>
                                        <Col span={15}>
                                            <Form.Item className="form-flex-wrapper" label="课程" >
                                                {getFieldDecorator('curriculum', { initialValue: o_data.curriculum.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="配送状态" >
                                                {getFieldDecorator('order_db_status', { initialValue: o_data.order_db_status })(
                                                    <Select
                                                        onChange={(statusIndex) => {
                                                            this.props.form.setFieldsValue({
                                                                order_db_status: statusIndex
                                                            })
                                                        }}
                                                        style={{ width: '130px' }}
                                                    >
                                                        {(['待拣货', '拣货中', '待打包', '待发货', '发货中', '已收件', '已存档'].map((statusName, index) => {
                                                            return <Select.Option key={index} value={index}>{statusName}</Select.Option>
                                                        }))}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Divider style={{ marginTop: '50px', marginBottom: '50px' }} />
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="换单单号" >
                                                {getFieldDecorator('other_order_id', { initialValue: o_data.other_order_id.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="订单状态" >
                                                {getFieldDecorator('order_status', { initialValue: o_data.order_status.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="收件人公司" >
                                                {getFieldDecorator('user_company', { initialValue: o_data.user_company.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="包裹数量" >
                                                {getFieldDecorator('order_package_number', { initialValue: o_data.order_package_number.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="下单时间" >
                                                {getFieldDecorator('order_time', { initialValue: o_data.order_time.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="下单人" >
                                                {getFieldDecorator('other_param_5', { initialValue: o_data.other_param_5.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="下单账号" >
                                                {getFieldDecorator('other_param_6', { initialValue: o_data.other_param_6.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="下单人部门" >
                                                {getFieldDecorator('other_param_7', { initialValue: o_data.other_param_7.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="寄件人" >
                                                {getFieldDecorator('other_param_8', { initialValue: o_data.other_param_8.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="寄件人手机" >
                                                {getFieldDecorator('other_param_9', { initialValue: o_data.other_param_9.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="寄件人公司" >
                                                {getFieldDecorator('other_param_a', { initialValue: o_data.other_param_a.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="付费方式" >
                                                {getFieldDecorator('other_param_0', { initialValue: o_data.other_param_0.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="是否超区" >
                                                {getFieldDecorator('other_param_1', { initialValue: o_data.other_param_1.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="超区原因" >
                                                {getFieldDecorator('other_param_2', { initialValue: o_data.other_param_2.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="取件码" >
                                                {getFieldDecorator('other_param_3', { initialValue: o_data.other_param_3.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="代收货款" >
                                                {getFieldDecorator('other_param_4', { initialValue: o_data.other_param_4.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="业务类型" >
                                                {getFieldDecorator('other_param_b', { initialValue: o_data.other_param_b.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="物品名" >
                                                {getFieldDecorator('other_param_c', { initialValue: o_data.other_param_c.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="生鲜温层" >
                                                {getFieldDecorator('other_param_d', { initialValue: o_data.other_param_d.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="返单类型" >
                                                {getFieldDecorator('other_param_e', { initialValue: o_data.other_param_e.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="是否保价" >
                                                {getFieldDecorator('other_param_f', { initialValue: o_data.other_param_f.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="保价金额" >
                                                {getFieldDecorator('other_param_10', { initialValue: o_data.other_param_10.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="预计送达" >
                                                {getFieldDecorator('expected_time', { initialValue: o_data.expected_time.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="下单重量(kg)" >
                                                {getFieldDecorator('order_weight', { initialValue: o_data.order_weight.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="是否拒收" >
                                                {getFieldDecorator('other_param_11', { initialValue: o_data.other_param_11.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="验货方式" >
                                                {getFieldDecorator('other_param_12', { initialValue: o_data.other_param_12.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="状态更新时间" >
                                                {getFieldDecorator('order_state_time', { initialValue: o_data.order_state_time.replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={7}>
                                            <Form.Item className="form-flex-wrapper" label="入库时间" >
                                                {getFieldDecorator('order_db_install_time', { initialValue: dateFormat(new Date(o_data.order_db_install_time), 'yyyy-MM-dd hh:mm:ss').replace("未编辑", "") })(
                                                    <Input type="text" disabled={true} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={6}>
                                            <Form.Item className="form-flex-wrapper" label="DB更新时间" >
                                                {getFieldDecorator('order_db_update_time', { initialValue: dateFormat(new Date(o_data.order_db_update_time), 'yyyy-MM-dd hh:mm:ss').replace("未编辑", "") })(
                                                    <Input type="text" disabled={true} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                {/* <Col span={4}></Col> */}
                                <Col span={6} style={{ textAlign: 'right' }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        {"提交修改"}
                                    </Button>
                                    <Divider type="vertical" />
                                    <Button type="dashed" onClick={this.handleReset}>重置</Button>
                                    <Divider type="vertical" />
                                    <Popconfirm
                                        title="确认删除订单?"
                                        onConfirm={res => { this.props.deleteOrder(this, o_data) }}
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
                        </Form>
                    </Panel.Header>
                </Panel>
            </Layout.Content>
        )
    }
}
