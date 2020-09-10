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
    Tabs,
    DatePicker,
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
        addGoods: (Goods, data) => {
            console.log(JSON.stringify(data))
            try {
                var url = `${ADMIN_API}/goods/insert`
                var params = { goods_type: Goods.state.goods_type, "eDate": Goods.state.expiartionDate, "data": [Goods.state.goods_type === "1" ? data.g_p_tmp : data.g_p_0, data.g_p_1, data.g_p_2, data.g_p_3, data.g_p_4, data.g_p_5, data.g_id, data.g_goods_position_list], "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                var dispatch_tmp = dispatch
                axios.post(url, params).then(res => {
                    console.log("login - result " + JSON.stringify(res.data))
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

export default class GoodsAdd extends React.Component {

    static propTypes = {
        // pushToList: PropTypes.bool.isRequired,
    }
    state = {
        defaultGoodsId: Math.random().toString(36).substring(2).toLocaleUpperCase(),
        pushToList: false,
        goods_type: 0,
    }

    handleSubmit = (e) => {
        e.preventDefault()

        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (this.state.goods_type === "0") {
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
                if (values.g_p_tmp === '') {
                    message.error('临时教材名称未输入');
                    return;
                }
            }

            if (values.g_id === '') {
                message.error('教材id未输入');
                return;
            }
            // if (values.g_goods_position_list === '') {
            //     message.error('货架位置未输入');
            //     return;
            // }

            this.props.addGoods(this, values)
        })
    }

    handleReset = () => {
        this.props.form.setFieldsValue({
            g_p_0: '',
            g_p_1: '',
            g_p_2: '',
            g_p_3: '',
            g_p_4: '',
            g_p_5: '',
            g_id: '',
            g_goods_position_list: '',
            goods_status: '',
            goods_stock: '',
            goods_stock_max: '',
            g_p_tmp: '',
        })
        this.setState({
            expiartionDate: ''
        })
    }
    render() {
        if (this.state.pushToList) {
            return (<Redirect to="/goodsList" />);
        }
        const { Dragger } = Upload;
        const goods = this
        const uploadProps = {
            name: 'file',
            multiple: true,
            action: `${ADMIN_API}/goods/upload_file`,
            onChange(info) {
                if (info.file.status === 'done') {
                    var response = JSON.parse(JSON.stringify(info.file.response));
                    if (response.requestStatus === 200) {
                        //处理返回数据
                        message.success(`${response.message}`, 5);
                        goods.setState({
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
        const { TabPane } = Tabs;

        return (
            <Layout.Content>
                <Panel minus>
                    <Panel.Header type="light">
                        <Breadcrumb>
                            <Breadcrumb.Item>主页</Breadcrumb.Item>
                            <Breadcrumb.Item>教材管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增教材</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>新增教材</h2>
                        <p>手动增加教材,或者下载模块后批量导入</p>
                        <Divider style={{ marginTop: '10px', marginBottom: '0px' }} />
                        <div style={{ padding: '30px 0px' }}>
                            <Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
                                <p className="ant-upload-hint">支持单次或批量上传,请勿上传非模版文件
                </p>
                            </Dragger>
                            <div style={{ position: 'relative', width: '130px', height: '0px', float: 'right' }}>
                                <Button type="dashed" style={{ position: 'absolute', left: '0', bottom: '0px', right: '0px', width: '100%', height: '30px' }}>
                                    <a href="http://122.51.169.187:3000/static/goods_sample.xlsx" download="goods_sample.xlsx">下载模版</a>
                                </Button>
                            </div>
                        </div>
                        {/* <Divider style={{ marginTop: '0px', marginBottom: '30px' }} /> */}
                        <Tabs defaultActiveKey="0" onChange={(key) => { this.setState({ goods_type: key }) }}>
                            <TabPane tab="普通教材" key="0">
                                <Form className="form-search" onSubmit={this.handleSubmit}>
                                    <Row gutter={24}>
                                        <Col span={14}>
                                            <Row>
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="教材id">
                                                        {getFieldDecorator('g_id', { initialValue: this.state.defaultGoodsId })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4} />
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="货架位置(可选)">
                                                        {getFieldDecorator('g_goods_position_list', {
                                                            initialValue: ""
                                                        })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="季度">
                                                        {getFieldDecorator('g_p_0', { initialValue: "" })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4} />
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="科目">
                                                        {getFieldDecorator('g_p_1', { initialValue: "" })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="年级">
                                                        {getFieldDecorator('g_p_2', { initialValue: "" })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4} />
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="讲次">
                                                        {getFieldDecorator('g_p_3', {
                                                            initialValue: ""
                                                        })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="班次">
                                                        {getFieldDecorator('g_p_4', { initialValue: "" })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4} />
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="发放明细">
                                                        {getFieldDecorator('g_p_5', {
                                                            initialValue: ""
                                                        })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="过期时间">
                                                        <DatePicker showTime placeholder="选择日期" onChange={(value, dateString) => {
                                                            this.setState({
                                                                expiartionDate: dateString
                                                            })
                                                        }} allowClear={false} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4} />
                                                <Col span={10}>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={6}></Col>
                                        <Col span={4} style={{ textAlign: 'right' }}>
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
                            </TabPane>
                            <TabPane tab="临时教材" key="1">
                                <Form className="form-search" onSubmit={this.handleSubmit}>
                                    <Row gutter={24}>
                                        <Col span={14}>
                                            <Row>
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="教材id">
                                                        {getFieldDecorator('g_id', { initialValue: this.state.defaultGoodsId })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4} />
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="货架位置">
                                                        {getFieldDecorator('g_goods_position_list', {
                                                            initialValue: ""
                                                        })(
                                                            <Input type="text" />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={10}>
                                                    <Form.Item className="form-flex-wrapper" label="教材名称">
                                                        {getFieldDecorator('g_p_tmp', { initialValue: "" })(
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
                                                    <Form.Item className="form-flex-wrapper" label="过期时间">
                                                        <DatePicker showTime placeholder="选择日期" onChange={(value, dateString) => {
                                                            this.setState({
                                                                expiartionDate: dateString
                                                            })
                                                        }} allowClear={false} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={4} />
                                                <Col span={10} />
                                            </Row>
                                        </Col>
                                        <Col span={6}></Col>
                                        <Col span={4} style={{ textAlign: 'right' }}>
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
                            </TabPane>
                        </Tabs>

                    </Panel.Header>
                </Panel>
            </Layout.Content>
        )
    }
}
