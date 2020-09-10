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
        check_goods_ids: (Goods, goodsIdValue) => {
            try {
                var lines = goodsIdValue.split('\n')
                var url = `${ADMIN_API}/goods/batchCheck`
                var params = { "goods_ids": lines, "token": utils.getStorage(USER_TOKEN) }
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
        addCur: (Cur, data) => {
            //   console.log(JSON.stringify(data))
            try {
                var lines = Cur.state.goodsIdValue.split('\n')
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
                var url = `${ADMIN_API}/curriculum/insert`
                var params = { "sDate": Cur.state.startDate, "eDate": Cur.state.expiartionDate, "data": [data.c_id, data.c_name, newLines.join(',')], "token": utils.getStorage(USER_TOKEN) }
                //   console.log('body - '+JSON.stringify(params))
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
                if (err.response === undefined) {
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }
                if (err.response.status === 401) {
                    const errorMessage = '您的登录已过期，请重新登录'
                    dispatch(authError(errorMessage))
                }
            }
        }
    }))
export default class CurAdd extends React.Component {
    static propTypes = {
        pushToList: PropTypes.bool,
    }
    state = {
        pushToList: false,
        defaultCurId: Math.random().toString(36).substring(2).toLocaleUpperCase(),
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if (this.state.goodsIdValue.length === 0) {
            message.error('没有输入库存id和数量')
            return;
        }
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
            this.props.addCur(this, values)
        })
    }

    handleReset = () => {
        this.props.form.setFieldsValue({
            c_id: '',
            c_name: '',
        })
        this.setState({
            expiartionDate: '',
            startDate: '',
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
            return (<Redirect to="/curList" />);
        }
        const { Dragger } = Upload;
        const cur = this
        const uploadProps = {
            name: 'file',
            multiple: true,
            action: `${ADMIN_API}/curriculum/upload_file`,
            onChange(info) {
                if (info.file.status === 'done') {
                    var response = JSON.parse(JSON.stringify(info.file.response));
                    if (response.requestStatus === 200) {
                        //处理返回数据
                        message.success(`${response.message}`, 5);
                        cur.setState({
                            pushToList: true
                        })
                    } else {
                        message.error(`${response.message}`);
                    }
                } else if (info.file.status === 'uploading') {
                    // console.log('上传文件中');
                } else {
                    message.error(`上传文件失败`);
                }
            },
        };
        const {
            form
        } = this.props

        const { TextArea } = Input;

        const { getFieldDecorator } = form

        return (
            <Layout.Content>
                <Panel minus>
                    <Panel.Header type="light">
                        <Breadcrumb>
                            <Breadcrumb.Item>主页</Breadcrumb.Item>
                            <Breadcrumb.Item>课程管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增课程</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>新增课程</h2>
                        <p>手动增加课程,或者下载模块后批量导入</p>
                        <Divider style={{ marginTop: '10px', marginBottom: '0px' }} />
                        <div style={{ padding: '30px 0px' }}>
                            <Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
                                <p className="ant-upload-hint">支持单次或批量上传,请勿上传非模版文件</p>
                            </Dragger>
                            <div style={{ position: 'relative', width: '130px', height: '0px', float: 'right' }}>
                                <Button type="dashed" style={{ position: 'absolute', left: '0', bottom: '0px', right: '0px', width: '100%', height: '30px' }}>
                                    <a href="http://122.51.169.187:3000/static/curriculum_sample.xlsx" download="curriculum_sample.xlsx">下载模版</a>
                                </Button>
                            </div>
                        </div>
                        <Divider style={{ marginTop: '0px', marginBottom: '30px' }} />
                        <Form className="form-search" onSubmit={this.handleSubmit}>
                            <Row gutter={24}>
                                <Col span={14}>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="课程id">
                                                {getFieldDecorator('c_id', { initialValue: this.state.defaultCurId })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="课程名称">
                                                {getFieldDecorator('c_name', {
                                                    initialValue: ""
                                                })(
                                                    <Input type="text" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="开课时间">
                                                <DatePicker showTime placeholder="选择日期" onChange={(value, dateString) => {
                                                    this.setState({
                                                        startDate: dateString
                                                    })
                                                }} allowClear={false} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} />
                                        <Col span={10}>
                                            <Form.Item className="form-flex-wrapper" label="结课时间">
                                                <DatePicker showTime placeholder="选择日期" onChange={(value, dateString) => {
                                                    this.setState({
                                                        expiartionDate: dateString
                                                    })
                                                }} allowClear={false} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row style={{ 'paddingTop': '10px' }}>
                                        <Col span={10}>
                                            <p>{'输入教材id列表,使用回车隔开多个id'}</p>
                                            <TextArea
                                                value={this.state.goodsIdValue}
                                                onChange={this.goodsFieldOnChange}
                                                placeholder="输入教材id,回车校验"
                                                autoSize={{ minRows: 7 }}
                                            />
                                        </Col>
                                        <Col span={4}>
                                            {/* <Divider type={'vertical'} /> */}
                                        </Col>
                                        <Col span={10} style={{ borderStyle: 'solid', borderWidth: '0px', borderColor: 'light' }}>
                                            <p>{'教材id校验结果,匹配到的教材会显示名称'}</p>
                                            <TextArea
                                                disabled
                                                value={this.state.goodsIdDesc}
                                                placeholder="id校验结果"
                                                autoSize={{ minRows: 7 }}
                                            />
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
                    </Panel.Header>
                </Panel>
            </Layout.Content>
        )
    }
}
