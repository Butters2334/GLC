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
// import { dateFormat } from '@/utils/index';

@Form.create()
@connect(
    state => ({
    }),
    dispatch => ({
        check_goods_ids: (Goods, goodsIdValue) => {
            try {
                var lines = goodsIdValue.split('\n')
                var newLines = []
                for (var index in lines) {
                    var str = lines[index]
                    //没有设置*+=的时候添加+
                    if (str.length > 0 && str.includes('*') && str.includes('-') && str.includes('+')) {
                        newLines.push(str + '+1')
                    } else {
                        newLines.push(str)
                    }
                }
                var url = `${ADMIN_API}/goods/batchCheck`
                var params = { "goods_ids": newLines, "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                var dispatch_tmp = dispatch
                axios.post(url, params).then(res => {
                    console.log("login - result " + JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        // message.success(`${res.data.message}`);
                        Goods.setState({
                            goodsIdDesc: res.data.result.list.join('\n')
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
                } else {
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }
            }
        },
        batch_modify: (Goods, goodsIdValue) => {
            try {
                var lines = goodsIdValue.split('\n')
                var newLines = []
                for (var index in lines) {
                    var str = lines[index]
                    //没有设置*+=的时候添加+
                    if (str.length > 0 && str.includes('*') && str.includes('-') && str.includes('+')) {
                        newLines.push(str + '+1')
                    } else {
                        newLines.push(str)
                    }
                }
                var url = `${ADMIN_API}/goods/batchModify`
                var params = { "goods_ids": newLines, "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                var dispatch_tmp = dispatch
                axios.post(url, params).then(res => {
                    console.log("login - result " + JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        message.success(`${res.data.message}`);
                        Goods.setState({
                            goodsIdValue: '',
                            goodsIdDesc: ''
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
                } else {
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }
            }
        }
    }))
export default class GoodsStock extends React.Component {
    static propTypes = {
        pushToList: PropTypes.bool,
    }
    state = {
        pushToList: false,
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if (this.state.goodsIdValue.length === 0) {
            message.error('没有输入库存id和数量')
            return;
        }
        if (this.state.goodsIdDesc.split('\n').length === 0) {
            message.error('没有输入库存id和数量')
            return;
        }
        // this.props.request
    }

    handleReset = () => {
        this.setState({
            goodsIdValue: '',
            goodsIdDesc: '',
        })
    }

    goodsFieldOnChange = ({ target: { value } }) => {
        this.props.check_goods_ids(this, value)
        this.setState({ goodsIdValue: value });
    };
    render() {
        if (this.state.pushToList) {
            return (<Redirect to="/goodsList" />);
        }
        // const {
        //     form
        // } = this.props
        // const { getFieldDecorator } = form
        const { TextArea } = Input;
        return (
            <Layout.Content>
                <Panel minus>
                    <Panel.Header type="light">
                        <Breadcrumb>
                            <Breadcrumb.Item>主页</Breadcrumb.Item>
                            <Breadcrumb.Item>教材管理</Breadcrumb.Item>
                            <Breadcrumb.Item>批量入库</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>教材批量入库</h2>
                        <p>输入教材id,可识别教材可以增加库存(临时开放修改库存功能)</p>
                        <p style={{ marginLeft: '20px' }}>{"示例:"}</p>
                        <Row gutter={24} style={{ marginLeft: '40px' }}>
                            <Col span={6}>
                                {'A0000000001+1'}
                            </Col>
                            <Col span={2}>
                            </Col>
                            <Col span={12}>
                                {'秋-语文-五年级-秋上-勤思-学生版   库存增加 1'}
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ marginLeft: '40px' }}>
                            <Col span={6}>
                                {'A0000000001-1'}
                            </Col>
                            <Col span={2}>
                            </Col>
                            <Col span={12}>
                                {'秋-语文-五年级-秋上-勤思-学生版   库存减少 1'}
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ marginLeft: '40px' }}>
                            <Col span={6}>
                                {'A0000000001*1'}
                            </Col>
                            <Col span={2}>
                            </Col>
                            <Col span={12}>
                                {'秋-语文-五年级-秋上-勤思-学生版   库存设为 1'}
                            </Col>
                        </Row>
                        <Divider style={{ marginTop: '10px', marginBottom: '30px' }} />
                        <Form className="form-search" onSubmit={this.handleSubmit}>
                            <Row gutter={24}>
                                <Col span={18}>
                                    <Row>
                                        <Col span={11}>
                                            <p>{'输入库存id列表,使用回车隔开多个id'}</p>
                                            <TextArea
                                                value={this.state.goodsIdValue}
                                                onChange={this.goodsFieldOnChange}
                                                placeholder="输入教材id,回车校验"
                                                autoSize={{ minRows: 15 }}
                                            />
                                        </Col>
                                        <Col span={1}>
                                            {/* <Divider type={'vertical'} /> */}
                                        </Col>
                                        <Col span={11} style={{ borderStyle: 'solid', borderWidth: '0px', borderColor: 'light' }}>
                                            <p>{'库存id校验结果,只有校验通过的订单会被提交'}</p>
                                            <TextArea
                                                disabled
                                                value={this.state.goodsIdDesc}
                                                placeholder="id校验结果"
                                                autoSize={{ minRows: 15 }}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                {/* <Col span={4}></Col> */}
                                <Col span={4} style={{ textAlign: 'right' }}>
                                    <Popconfirm
                                        title="确认修改库存?"
                                        onConfirm={res => { this.props.batch_modify(this, this.state.goodsIdValue) }}
                                        onCancel={res => { }}
                                        okText="修改"
                                        cancelText="否"
                                        icon={<Icon type="smile" theme="twoTone" />}
                                    >
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            {"修改库存"}
                                        </Button>
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
