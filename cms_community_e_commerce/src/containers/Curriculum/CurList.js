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
    Form,
    Row,
    Col,
    Button,
    Spin,
    Select,
    // DatePicker,
    Divider,
    Input,
    Popconfirm,
    Icon,
    message,
    Descriptions,

} from 'antd';
import {
    authError
} from '../../actions/authAction';
import *as XLSX from 'xlsx';
import { toJSONSchema } from 'mockjs';


const FormItem = Form.Item

@Form.create()
class CurListHeader extends React.Component {
    static propTypes = {
        handleSelectorChange: PropTypes.func.isRequired,
        cur_status_list: PropTypes.array,
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
            curId: '',
            cur_name: '',
            goods_id: '',
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

        return (
            <Panel.Header type="light">
                <Breadcrumb>
                    <Breadcrumb.Item>主页</Breadcrumb.Item>
                    <Breadcrumb.Item>课程管理</Breadcrumb.Item>
                    <Breadcrumb.Item>课程查询</Breadcrumb.Item>
                </Breadcrumb>
                <Row >
                    <Col span={14} >
                        <h2>课程查询</h2>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right', marginTop: '20px' }}>
                        {this.props.isFetching ? <Spin /> : (
                            <Button type="primary" onClick={() => { this.props.export_xls_event() }}>
                                {this.props.selectedRowData !== undefined && this.props.selectedRowData.length > 0 ? "导出" + this.props.selectedRowData.length + "条数据" : "导出全部数据"}
                            </Button>
                        )}
                    </Col>
                </Row>
                <p>展示全部课程，可筛选查看课程对应教材</p>
                <Divider style={{ marginTop: '10px', marginBottom: '30px' }} />
                <Form className="form-search" onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col span={5}>
                            <FormItem className="form-flex-wrapper" label="课程id">
                                {getFieldDecorator('curId')(
                                    <Input type="text" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem className="form-flex-wrapper" label="课程名称">
                                {getFieldDecorator('cur_name')(
                                    <Input type="text" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem className="form-flex-wrapper" label="教材id">
                                {getFieldDecorator('goods_id')(
                                    <Input type="text" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={5} />
                        <Col span={4} style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                {"搜索"}
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
    }),
    dispatch => ({
        //查询课程下对应教材
        findGoods: (Cur, goodids) => {
            try {
                var url = `${ADMIN_API}/goods/findGoods`
                var params = { "goodids": goodids, "token": utils.getStorage(USER_TOKEN) }
                console.log('body - ' + JSON.stringify(params))
                axios.post(url, params).then(res => {
                    console.log("login - result " + JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        var giddata = Cur.state.giddata
                        if (giddata === undefined) {
                            giddata = {}
                        }
                        giddata[goodids] = res.data.result.list
                        Cur.setState({
                            giddata: giddata
                        })
                        // message.success(`${res.data.message}`);
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
        //删除课程
        deletecur: (Cur, cur_data) => {
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
                        var list = Cur.state.cur
                        var data_index = list.indexOf(cur_data)
                        list.splice(data_index, 1)
                        Cur.setState({
                            isFetching: false,
                            cur: list
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
        //查询筛选条件下所有课程用于下载
        getAllCur: (cur, search) => {
            cur.setState({
                isFetching: true
            })
            try {
                var url = `${ADMIN_API}/curriculum/get_list`
                var params = { "page_index": 0, "page_size": 9999, "token": utils.getStorage(USER_TOKEN) }
                if (search["curId"]) {
                    params["cur_id"] = search["curId"]
                }
                if (search["cur_name"]) {
                    params["cur_name"] = search["cur_name"]
                }
                if (search["goods_id"]) {
                    params["goods_id"] = search["goods_id"]
                }

                var dispatch_tmp = dispatch
                axios.post(url, params).then(res => {
                    // console.log("login - result "+JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        const list = res.data.result.list
                        cur.export_data_toJSON(list)
                        cur.setState({
                            isFetching: false,
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
        //查询指定课程用于显示
        loadcur: (cur, page_index, page_size, search) => {
            cur.setState({
                isFetching: true
            })
            // console.log(search)
            try {
                var url = `${ADMIN_API}/curriculum/get_list`
                var params = { "page_index": page_index, "page_size": page_size, "token": utils.getStorage(USER_TOKEN) }
                if (search["curId"]) {
                    params["cur_id"] = search["curId"]
                }
                if (search["cur_name"]) {
                    params["cur_name"] = search["cur_name"]
                }
                if (search["goods_id"]) {
                    params["goods_id"] = search["goods_id"]
                }
                // console.log('body - '+JSON.stringify(params))
                var dispatch_tmp = dispatch
                axios.post(url, params).then(res => {
                    // console.log("login - result "+JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        const list = res.data.result.list
                        cur.setState({
                            isFetching: false,
                            cur: list,
                            data_page_index: res.data.result.page_index,
                            data_page_size: res.data.result.page_size,
                            data_page_total: res.data.result.all_count,
                            data_search_params: search
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
export default class CurList extends React.Component {
    static propTypes = {
        cur: PropTypes.array,
        isFetching: PropTypes.bool,
        loadcur: PropTypes.func.isRequired,
        cur_status_list: PropTypes.array,
        data_page_index: PropTypes.number,
        data_page_size: PropTypes.number,
        data_page_total: PropTypes.number,
        data_search_params: PropTypes.object,
    }

    state = {
        filteredInfo: null,
        sortedInfo: null
    }

    componentDidMount() {
        // this.props.getFilterList(this)
        this.loadcur(0, 20, {})
    }
    loadcur = async (page_index, page_size, params) => {
        await this.props.loadcur(this, page_index, page_size, params)
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter
        })
    }

    onSelectorChange = (value) => {
        let cur_name = value.cur_name && value.cur_name !== '' ? value.cur_name : null
        let curId = value.curId && value.curId !== '' ? (value.curId) : null
        let goods_id = value.goods_id && value.goods_id !== '' ? value.goods_id : null
        let params = {
            cur_name,
            curId,
            goods_id
        }
        // console.log("params - "+JSON.stringify(params));
        this.loadcur(0, 20, params)
    }

    // 回调函数，切换下一页
    changePage(current) {
        this.loadcur(current - 1, this.state.data_page_size, this.state.data_search_params)
    }
    // 回调函数,每页显示多少条
    changePageSize(pageSize, current) {
        // 将当前改变的每页条数存到state中
        this.setState({
            data_page_size: pageSize,
        });
        this.loadcur(0, pageSize, this.state.data_search_params)
    }

    renderExpanded = (record) => {
        var giddata = this.state.giddata
        if (giddata !== undefined && giddata[record.g_id_list]) {
            var idMap = giddata[record.g_id_list]
            var keys = []
            for (var key in idMap) {
                keys.push(key);
            }
            return (
                <div>
                    {
                        keys.map((key) => {
                            return (<div key={key}>
                                <Descriptions title={"教材id:" + key} column={8}>
                                    {
                                        idMap[key].g_p_0 === undefined ? (
                                            <Descriptions.Item>
                                                {"没有找到对应的教材"}
                                            </Descriptions.Item>
                                        ) : [idMap[key].g_p_0, idMap[key].g_p_1, idMap[key].g_p_2, idMap[key].g_p_3, idMap[key].g_p_4, idMap[key].g_p_5].map((v) => {
                                            return <Descriptions.Item key={v}>
                                                {v}
                                            </Descriptions.Item>
                                        })
                                    }
                                    {
                                        idMap[key].g_p_0 !== undefined ? (
                                            new Date(idMap[key].goods_expiration_date).getTime() < new Date().getTime() ? (
                                                <Descriptions.Item>
                                                    <p style={{ color: 'red' }}>
                                                        {
                                                            '已过期 ' + idMap[key].goods_expiration_date
                                                        }
                                                    </p>
                                                </Descriptions.Item>
                                            ) : (
                                                    <Descriptions.Item style={{ color: 'light' }}>
                                                        {
                                                            '仓库位置:' + idMap[key].g_goods_position_list
                                                        }
                                                    </Descriptions.Item>
                                                )
                                        ) : (<div />)
                                    }
                                </Descriptions>
                            </div>)
                        })}
                    <Descriptions title={"数据时间"}>
                        <Descriptions.Item>{"入库时间 : " + record.db_install_time}</Descriptions.Item>
                        <Descriptions.Item>{"最后更新 : " + record.db_update_time}</Descriptions.Item>
                    </Descriptions>
                </div>
            )
        } else {
            this.props.findGoods(this, record.g_id_list)
            return (
                <div>
                    <h4>加载中</h4>
                    {/* <p>等待教材表关联之后再完善</p> */}
                </div>
            )
        }
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
            this.props.getAllCur(this, this.state.data_search_params)
        }
    }
    export_data_toJSON = (selectedRowData) => {
        const entozh = {
            "c_id": "课程id",
            "c_name": "课程名称",
            "g_id_list": "教材id列表",
            "cur_start_date": "开课时间",
            "cur_expiration_date": "结课时间",
        }

        var json = []
        selectedRowData.map((selectItem) => {
            var line = {}
            //填充教材id
            line['课程id'] = ''
            line['课程名称'] = ''
            for (var index = 1; index <= 5; index++) {
                line['教材' + index] = ''
            }
            Object.keys(entozh).map((key) => {
                if (key === 'g_id_list') {
                    selectItem[key].split(",").map((goods_id, index) => {
                        line['教材' + (index + 1)] = goods_id
                        return ''
                    })
                } else {
                    line[entozh[key]] = selectItem[key]
                }
                return ""
            })
            json.push(line)
            return ""
        })
        const sheet = XLSX.utils.json_to_sheet(json);
        this.openDownloadDialog(this.sheet2blob(sheet, '课程信息'), `导出课程.xlsx`);
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
        if (this.state.pushToEditData) {
            setTimeout(() => {
                this.setState.pushToEditData = null;
            }, 1000)
            return (
                <Redirect to={{ pathname: "/curEdit", state: { originalData: this.state.pushToEditData } }} />
            );
        }

        const {
            isFetching
        } = this.state
        let cur = this.state.cur === undefined ? [] : this.state.cur
        const columns = [{
            title: '课程id',
            dataIndex: 'c_id',
            key: 'c_id',
        }, {
            title: '课程名称',
            dataIndex: 'c_name',
            key: 'c_name'
        }, {
            title: '教材id列表',
            dataIndex: 'g_id_list',
            key: 'g_id_list',
            width: 300,
            render: (text, record) => {
                let search_goods_id = this.state.data_search_params["goods_id"]
                console.log('search_goods_id - '+search_goods_id)
                let search_goods_id_list = search_goods_id !== undefined && search_goods_id!==null ? search_goods_id.split(',') : []
                let goods_id_list = []
                text.split(",").map((gid, pindex) => {
                    let spanAndStyleList = []
                    for (let search_goods_id of search_goods_id_list) {
                        let gid_search_list = gid.split(search_goods_id)
                        if(gid_search_list.length <= 1)
                        {
                            continue;
                        }
                        for (var index in gid_search_list) {
                            let gid_search = gid_search_list[index]
                            console.log("gid_search_list - " + gid_search_list)
                            if (index !== '0') {
                                console.log("index - " + index)
                                spanAndStyleList.push([search_goods_id, { 'color': 'blue' }])
                            }
                            spanAndStyleList.push([gid_search, { 'color': 'light' }])
                        }
                        //只匹配一次
                        if (spanAndStyleList.length >= 0) {
                            break;
                        }
                    }
                    if (spanAndStyleList.length === 0) {
                        spanAndStyleList.push([gid, { 'color': 'light' }])
                    }
                    goods_id_list.push(spanAndStyleList)
                    return ''
                })
                return (
                    <div>
                        {
                            goods_id_list.map((spanAndStyleList, index) => {
                                return (
                                    <div key={"gid_span_root_" + index}>
                                        {spanAndStyleList.map((spanAndStyle, index) => {
                                            return (<span style={spanAndStyle[1]} key={"gid_span_" + spanAndStyle[0] + '_' + index}>{spanAndStyle[0]}</span>)
                                        })}
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        }, {
            title: '开课时间',
            dataIndex: 'cur_start_date',
            key: 'cur_start_date',
            render: (text, record) => {
                return (<p style={{ color: new Date(text).getTime() > new Date().getTime() ? 'red' : 'light' }}>{text}</p>)
            }
        }, {
            title: '结课时间',
            dataIndex: 'cur_expiration_date',
            key: 'cur_expiration_date',
            render: (text, record) => {
                return (<p style={{ color: new Date(text).getTime() < new Date().getTime() ? 'red' : 'light' }}>{text}</p>)
            }
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
                            <a onClick={res => { this.setState({ pushToEditData: record }) }}>{"编辑\t\t"}</a>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={6}>
                            <Popconfirm
                                title="确认删除订单?"
                                onConfirm={res => { this.props.deletecur(this, record) }}
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
        var tableData = cur
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
                    <CurListHeader
                        handleSelectorChange={this.onSelectorChange}
                        cur_status_list={this.state.cur_status_list}
                        selectedRowData={this.state.selectedRowData}
                        export_xls_event={this.export_xls_event}
                    />
                    <Panel.Body type="light">
                        {
                            utils.getStorage(USER_USERTYPE) !== "2" ? (<Table
                                rowKey={record => record.cur_id}
                                dataSource={tableData}
                                expandedRowRender={this.renderExpanded}/**收缩/展开*/
                                columns={columns}
                                loading={isFetching}
                                bordered
                                onChange={this.handleTableChange}
                                pagination={paginationProps}
                            />) : (<Table
                                rowSelection={this.rowSelection}//选择
                                rowKey={record => record.cur_id}
                                dataSource={tableData}
                                expandedRowRender={this.renderExpanded}/**收缩/展开*/
                                columns={columns}
                                loading={isFetching}
                                bordered
                                onChange={this.handleTableChange}
                                pagination={paginationProps}
                            />)
                        }

                    </Panel.Body>
                </Panel>
            </Layout.Content>
        )
    }
}
