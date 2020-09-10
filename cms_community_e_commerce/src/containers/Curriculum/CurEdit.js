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
        deleteCur: (Cur, cur_data) => {
            Cur.setState({
                isFetching: true
            })
            try {
                var url = `${ADMIN_API}/curriculum/delete`
                var params = { "c_id": cur_data.c_id, "token": utils.getStorage(USER_TOKEN) }
                // console.log('body - '+JSON.stringify(params))
                axios.post(url, params).then(res => {
                    // console.log("login - result "+JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        message.success(`${res.data.message}`);
                        Cur.setState({
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
        editcur: (Cur, data) => {
            try {
                var url = `${ADMIN_API}/curriculum/modify`
                var params = { "sDate": data.cur_start_date, "eDate": data.cur_expiration_date, "c_id": data.c_id, "c_name": data.c_name, "c_list": data.g_id_list.split('\n').join(','), "token": utils.getStorage(USER_TOKEN) }
                // console.log('body - ' + JSON.stringify(params))
                var dispatch_tmp = dispatch
                axios.post(url, params).then(res => {
                    //   console.log("login - result "+JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        message.success(`${res.data.message}`);
                        Cur.setState({
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
export default class CurEdit extends React.Component {
    static propTypes = {
        pushToList: PropTypes.bool,
        // originalData : PropTypes.object
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
            if (values.c_id === '') {
                message.error('课程id为空');
                return;
            }
            if (values.c_name === '') {
                message.error('课程名称为空');
                return;
            }
            if (values.g_id_list === '') {
                message.error('至少需要一个教材');
                return;
            }
            this.props.editcur(this, values)
        })
    }

    handleReset = () => {
        var o_data = this.props.location.state.originalData
        this.props.form.setFieldsValue({
            c_id: o_data.c_id,
            c_name: o_data.c_name,
            g_id_list: o_data.g_id_list.split(',').join('\n'),
            cur_start_date: o_data.cur_start_date,
            cur_expiration_date: o_data.cur_expiration_date,
        })
    }
    render() {
        if (this.state.pushToList) {
            return (
                <Redirect to="/curList" />
            )
        }
        const {
            form
        } = this.props

        const { getFieldDecorator } = form
        // console.log("this.props.location.state - "+this.props.location.state)
        if (this.props.location.state === undefined) {
            return (<Redirect to="NODATA" />);
        }
        var o_data = this.props.location.state.originalData
        return (
            <Layout.Content>
                <Panel minus>
                    <Panel.Header type="light">
                        <Breadcrumb>
                            <Breadcrumb.Item>主页</Breadcrumb.Item>
                            <Breadcrumb.Item>课程管理</Breadcrumb.Item>
                            <Breadcrumb.Item>修改课程</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>修改课程</h2>
                        <p>修改原有课程数据,课程id不可修改</p>
                        <Divider style={{ marginTop: '10px', marginBottom: '30px' }} />
                        <Form className="form-search" onSubmit={this.handleSubmit}>
                            <Row gutter={24}>
                                <Col span={14}>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="课程id" >
                                                {getFieldDecorator('c_id', { initialValue: o_data.c_id })(
                                                    <Input type="text" disabled={true} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="课程名称">
                                                {getFieldDecorator('c_name', {
                                                    initialValue: o_data.c_name
                                                })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="教程id">
                                                {getFieldDecorator('g_id_list', { initialValue: o_data.g_id_list.split(',').join('\n') })(
                                                    <Input.TextArea
                                                        placeholder="输入教材id,多个id回车分隔"
                                                        autoSize={{ minRows: 5 }}
                                                    />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="开课时间" >
                                                {getFieldDecorator('cur_start_date', { initialValue: dateFormat(new Date(o_data.cur_start_date), 'yyyy-MM-dd hh:mm:ss').replace("未编辑", "") })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="结课时间" >
                                                {getFieldDecorator('cur_expiration_date', { initialValue: dateFormat(new Date(o_data.cur_expiration_date), 'yyyy-MM-dd hh:mm:ss').replace("未编辑", "") })(
                                                    <Input type="text" />
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
                                        onConfirm={res => { this.props.deleteCur(this, o_data) }}
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
