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
    DatePicker,
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
        deleteGoods: (goods, goods_data) => {
            goods.setState({
                isFetching: true
            })
            try {
                var url = `${ADMIN_API}/goods/delete`
                var params = { "g_id": goods_data.g_id, "token": utils.getStorage(USER_TOKEN) }
                // console.log('body - '+JSON.stringify(params))
                axios.post(url, params).then(res => {
                    // console.log("login - result "+JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        message.success(`${res.data.message}`);
                        goods.setState({
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
        editGoods: (Goods, data) => {
            try {
                var url = `${ADMIN_API}/goods/modify`
                //this.props.location.state.originalData.goods_type
                var params = { "eDate": data.goods_expiration_date, "g_id": data.g_id, "g_list": [data.g_p_0, data.g_p_1, data.g_p_2, data.g_p_3, data.g_p_4, data.g_p_5, data.g_id, data.g_goods_position_list, data.goods_status, data.goods_stock, data.goods_stock_max], "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                var dispatch_tmp = dispatch
                axios.post(url, params).then(res => {
                    //   console.log("login - result "+JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        message.success(`${res.data.message}`);
                        Goods.setState({
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
export default class GoodsEdit extends React.Component {
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
            if (this.props.location.state.originalData.goods_type === 0) {
                //普通教材
                if (values.g_p_0 === '') {
                    message.error('季度为空');
                    return;
                }
                if (values.g_p_1 === '') {
                    message.error('科目为空');
                    return;
                }
                if (values.g_p_2 === '') {
                    message.error('年级为空');
                    return;
                }
                if (values.g_p_3 === '') {
                    message.error('讲次为空');
                    return;
                }
                if (values.g_p_4 === '') {
                    message.error('班次为空');
                    return;
                }
                if (values.g_p_5 === '') {
                    message.error('发放明细为空');
                    return;
                }
            } else {
                //临时教材
                if (values.g_p_0 === '') {
                    message.error('临时教材名称未输入');
                    return;
                }
            }
            if (values.g_id === '') {
                message.error('教材id未输入');
                return;
            }
            if (values.g_goods_position_list === '') {
                message.error('货架位置未输入');
                return;
            }

            this.props.editGoods(this, values)
        })
    }

    handleReset = () => {
        var o_data = this.props.location.state.originalData
        this.props.form.setFieldsValue({
            g_p_0: o_data.g_p_0,
            g_p_1: o_data.g_p_1,
            g_p_2: o_data.g_p_2,
            g_p_3: o_data.g_p_3,
            g_p_4: o_data.g_p_4,
            g_p_5: o_data.g_p_5,
            g_id: o_data.g_id,
            g_goods_position_list: o_data.g_goods_position_list,
            goods_status: o_data.goods_status,
            goods_stock: o_data.goods_stock,
            goods_stock_max: o_data.goods_stock_max,
            goods_expiration_date: o_data.goods_expiration_date,
        })
    }
    render() {

        if (this.state.pushToList) {
            return (<Redirect to="/goodsList" />);
        }
        const {
            form
        } = this.props

        const { getFieldDecorator } = form
        var o_data = this.props.location.state.originalData
        return (
            <Layout.Content>
                <Panel minus>
                    <Panel.Header type="light">
                        <Breadcrumb>
                            <Breadcrumb.Item>主页</Breadcrumb.Item>
                            <Breadcrumb.Item>教材管理</Breadcrumb.Item>
                            <Breadcrumb.Item>修改教材</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>修改教材</h2>
                        <p>修改原有教材数据,教材id不可修改</p>
                        <Divider style={{ marginTop: '10px', marginBottom: '30px' }} />
                        <Form className="form-search" onSubmit={this.handleSubmit}>
                            <Row gutter={24}>
                                <Col span={14}>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="教材id" >
                                                {getFieldDecorator('g_id', { initialValue: o_data.g_id })(
                                                    <Input type="text" disabled={true} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="货架位置">
                                                {getFieldDecorator('g_goods_position_list', {
                                                    initialValue: o_data.g_goods_position_list
                                                })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {o_data.goods_type === 1 ? (
                                        <Row>
                                            <Col span={10}>
                                                <Form.Item className="form-flex-wrapper" label="教材名称">
                                                    {getFieldDecorator('g_p_0', { initialValue: o_data.g_p_0 })(
                                                        <Input type="text" />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={4} />
                                            <Col span={10}>
                                            </Col>
                                        </Row>
                                    ) : (
                                            <Row>
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="季度">
                                                        {getFieldDecorator('g_p_0', { initialValue: o_data.g_p_0 })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4} />
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="科目">
                                                        {getFieldDecorator('g_p_1', { initialValue: o_data.g_p_1 })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )}
                                    {o_data.goods_type === 1 ? (<Row></Row>) : (
                                        <Row>
                                            <Col span={10}>
                                                <Form.Item className="form-flex-wrapper" label="年级">
                                                    {getFieldDecorator('g_p_2', { initialValue: o_data.g_p_2 })(
                                                        <Input type="text" />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={4} />
                                            <Col span={10}>
                                                <Form.Item className="form-flex-wrapper" label="讲次">
                                                    {getFieldDecorator('g_p_3', {
                                                        initialValue: o_data.g_p_3
                                                    })(
                                                        <Input type="text" />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    )}
                                    {o_data.goods_type === 1 ? (<Row></Row>) : (
                                        <Row>
                                            <Col span={10}>
                                                <Form.Item className="form-flex-wrapper" label="班次">
                                                    {getFieldDecorator('g_p_4', { initialValue: o_data.g_p_4 })(
                                                        <Input type="text" />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={4} />
                                            <Col span={10}>
                                                <Form.Item className="form-flex-wrapper" label="发放明细">
                                                    {getFieldDecorator('g_p_5', {
                                                        initialValue: o_data.g_p_5
                                                    })(
                                                        <Input type="text" />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>)}
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="库存上限">
                                                {getFieldDecorator('goods_stock_max', {
                                                    initialValue: o_data.goods_stock_max
                                                })(
                                                    <Input type="number" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="库存数量">
                                                {getFieldDecorator('goods_stock', {
                                                    initialValue: o_data.goods_stock
                                                })(
                                                    <Input type="number" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="入库时间" >
                                                {getFieldDecorator('order_db_install_time', { initialValue: dateFormat(new Date(o_data.db_install_time), 'yyyy-MM-dd hh:mm:ss').replace("未编辑", "") })(
                                                    <Input type="text" disabled={true} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="状态更新时间" >
                                                {getFieldDecorator('order_db_update_time', { initialValue: dateFormat(new Date(o_data.db_update_time), 'yyyy-MM-dd hh:mm:ss').replace("未编辑", "") })(
                                                    <Input type="text" disabled={true} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="教材过期时间" >
                                                {getFieldDecorator('goods_expiration_date', { initialValue: dateFormat(new Date(o_data.goods_expiration_date), 'yyyy-MM-dd hh:mm:ss').replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10} />
                                    </Row>
                                </Col>
                                <Col span={4}></Col>
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
                                        onConfirm={res => { this.props.deleteGoods(this, o_data) }}
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
