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
} from 'antd';
import { Upload, Icon, message } from 'antd';
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


@Form.create()
@connect(
    state => ({
    }),
    dispatch => ({
        addOrder: (Order, data) => {
            console.log(JSON.stringify(data))
            try {
                var url = `${ADMIN_API}/order/insert`
                var params_data = []
                for (var index = 0; index < 34; index++) {
                    params_data.push('')
                }
                params_data[0] = data.order_id
                params_data[4] = '下单'
                params_data[16] = data.user_name
                params_data[17] = data.user_phone
                params_data[18] = data.user_addr
                params_data[21] = data.curriculum.replace (/^\s+|\s+$/g,"");
                var params = { "data": params_data, "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                var dispatch_tmp = dispatch
                // axios({
                //     method: 'post',
                //     url: url,
                //     timeout: 180000,
                //     data: params
                //   })
                axios.post(url, params)
                .then(res => {
                    console.log("login - result " + JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        message.success(`${res.data.message}`);
                        Order.setState({
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
export default class OrderAdd extends React.Component {
    // static propTypes = {
    //     pushToList: PropTypes.bool.isRequired,
    // }
    state = {
        pushToList: false,
        defaultOrderId: Math.random().toString(36).substring(2).toLocaleUpperCase(),
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
            this.props.addOrder(this, values)
        })
    }

    handleReset = () => {
        this.props.form.setFieldsValue({
            curriculum: '',
            user_addr: '',
            user_phone: '',
            order_id: '',
            user_name: '',
        })
    }
    render() {
        if (this.state.pushToList) {
            return (<Redirect to="/orderList" />);
        }
        const { Dragger } = Upload;
        const order = this
        const uploadProps = {
            name: 'file',
            multiple: true,
            action: `${ADMIN_API}/order/upload_file`,
            onChange(info) {
                if (info.file.status === 'done') {
                    var response = JSON.parse(JSON.stringify(info.file.response));
                    if (response.requestStatus === 200) {
                        //处理返回数据
                        message.success(`${response.message}`,5);
                        order.setState({
                            pushToList: true
                        })
                    } else {
                        message.error(`${response.message}`);
                    }
                } else if (info.file.status === 'uploading') {
                    console.log('上传文件中');
                } else {
                    message.error(`上传文件失败`);
                }
            },
        };
        const {
            form
        } = this.props

        const { getFieldDecorator } = form

        return (
            <Layout.Content>
                <Panel minus>
                    <Panel.Header type="light">
                        <Breadcrumb>
                            <Breadcrumb.Item>主页</Breadcrumb.Item>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增订单</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>新增订单</h2>
                        <p>手动增加订单,或者下载模块后批量导入</p>
                        <Divider style={{ marginTop: '10px', marginBottom: '0px' }} />
                        <div style={{ padding: '30px 0px' }}>
                            <Dragger {...uploadProps} timeout={600*1000}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
                                <p className="ant-upload-hint">支持单次或批量上传,请勿上传非模版文件
                </p>
                            </Dragger>
                            <div style={{ position: 'relative', width: '130px', height: '0px', float: 'right' }}>
                                <Button type="dashed" style={{ position: 'absolute', left: '0', bottom: '0px', right: '0px', width: '100%', height: '30px' }}>
                                <a href="http://122.51.169.187:3000/static/order_sample.xlsx" download="order_sample.xlsx">下载模版</a>
                                </Button>
                            </div>
                        </div>
                        <Divider style={{ marginTop: '0px', marginBottom: '30px' }} />
                        <Form className="form-search" onSubmit={this.handleSubmit}>
                            <Row gutter={24}>
                                <Col span={14}>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="订单id">
                                                {getFieldDecorator('order_id', { initialValue: this.state.defaultOrderId})(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="收件人">
                                                {getFieldDecorator('user_name', {
                                                    initialValue: ""
                                                })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="联系方式">
                                                {getFieldDecorator('user_phone', { initialValue: "" })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Form.Item className="form-flex-wrapper" label="收货地址">
                                            {getFieldDecorator('user_addr', { initialValue: "" })(
                                                <Input type="text" />
                                            )}
                                        </Form.Item>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item className="form-flex-wrapper" label="课程">
                                                {getFieldDecorator('curriculum', { initialValue: "" })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={8} style={{ textAlign: 'right' }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        {"新增"}
                                    </Button>
                                    <Divider type="vertical" />
                                    <Button type="dashed" onClick={this.handleReset}>重置</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Panel.Header>
                </Panel>
            </Layout.Content>
        )
    }
}
