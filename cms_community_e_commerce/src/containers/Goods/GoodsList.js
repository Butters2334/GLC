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
    Select,
    // DatePicker,
    Divider,
    Input,
    Popconfirm,
    Icon,
    message,
    Spin,
} from 'antd';
import {
    authError
} from '../../actions/authAction';
import *as XLSX from 'xlsx';


const FormItem = Form.Item
const Option = Select.Option

@Form.create()
class GoodsListHeader extends React.Component {
    static propTypes = {
        handleSelectorChange: PropTypes.func.isRequired,
        Goods_status_list: PropTypes.array,
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
            GoodsId: '',
            goods_name: '',
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
                    <Breadcrumb.Item>教材管理</Breadcrumb.Item>
                    <Breadcrumb.Item>教材查询</Breadcrumb.Item>
                </Breadcrumb>
                <Row >
                    <Col span={14} >
                        <h2>教材查询</h2>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right', marginTop: '20px' }}>
                        {this.props.isFetching ? <Spin /> : (
                            <Button type="primary" onClick={() => { this.props.export_xls_event() }}>
                                {this.props.selectedRowData !== undefined && this.props.selectedRowData.length > 0 ? "导出" + this.props.selectedRowData.length + "条数据" : "导出全部数据"}
                            </Button>
                        )}
                    </Col>
                </Row>
                <p>展示全部教材，可筛选查看实时教材库存</p>
                <Divider style={{ marginTop: '10px', marginBottom: '30px' }} />
                <Form className="form-search" onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col span={7}>
                            <FormItem className="form-flex-wrapper" label="教材id">
                                {getFieldDecorator('GoodsId')(
                                    <Input type="text" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <FormItem
                                className="form-flex-wrapper"
                                label="教材名称"
                            >
                                {getFieldDecorator('goods_name', {
                                    initialValue: ""
                                })(
                                    <Input type="text" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}></Col>
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
        //删除对应教材
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
                        var list = goods.state.Goods
                        var data_index = list.indexOf(goods_data)
                        list.splice(data_index, 1)
                        goods.setState({
                            isFetching: false,
                            Goods: list
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
        getAllGoods: (Goods, search) => {
            Goods.setState({
                isFetching: true
            })
            try {
                var url = `${ADMIN_API}/goods/get_list`
                var params = { "page_index": 0, "page_size": 999, "token": utils.getStorage(USER_TOKEN) }
                if (search["GoodsId"]) {
                    params["goods_id"] = search["GoodsId"]
                }
                if (search["goods_name"]) {
                    params["goods_name"] = search["goods_name"]
                }
                var dispatch_tmp = dispatch
                axios.post(url, params).then(res => {
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        const list = res.data.result.list
                        Goods.setState({
                            isFetching: false,
                        })
                        Goods.export_data_toJSON(list)
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
        //加载指定页数的教材
        loadGoods: (Goods, page_index, page_size, search) => {
            Goods.setState({
                isFetching: true
            })
            try {
                var url = `${ADMIN_API}/goods/get_list`
                var params = { "page_index": page_index, "page_size": page_size, "token": utils.getStorage(USER_TOKEN) }
                if (search["GoodsId"]) {
                    params["goods_id"] = search["GoodsId"]
                }
                if (search["goods_name"]) {
                    params["goods_name"] = search["goods_name"]
                }
                // console.log('body - '+JSON.stringify(params))
                var dispatch_tmp = dispatch
                axios.post(url, params).then(res => {
                    // console.log("login - result "+JSON.stringify(res.data))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        const list = res.data.result.list
                        Goods.setState({
                            isFetching: false,
                            Goods: list,
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
export default class GoodsList extends React.Component {
    static propTypes = {
        Goods: PropTypes.array,
        isFetching: PropTypes.bool,
        loadGoods: PropTypes.func.isRequired,
        Goods_status_list: PropTypes.array,
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
        this.loadGoods(0, 20, {})
    }
    loadGoods = async (page_index, page_size, params) => {
        await this.props.loadGoods(this, page_index, page_size, params)
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter
        })
    }

    onSelectorChange = (value) => {
        const goods_name = value.goods_name && value.goods_name !== '' ? value.goods_name : null
        const GoodsId = value.GoodsId && value.GoodsId !== '' ? (value.GoodsId) : null

        const params = {
            goods_name,
            GoodsId
        }

        this.loadGoods(0, 20, params)
    }

    // 回调函数，切换下一页
    changePage(current) {
        this.loadGoods(current - 1, this.state.data_page_size, this.state.data_search_params)
    }
    // 回调函数,每页显示多少条
    changePageSize(pageSize, current) {
        // 将当前改变的每页条数存到state中
        this.setState({
            data_page_size: pageSize,
        });
        this.loadGoods(0, pageSize, this.state.data_search_params)
    }

    //   renderExpanded = (record) => {
    //     // const address = record.user_name +'\t\t'+ record.user_addr +'\t\t'+ record.user_phone
    //     return (
    //       <div>
    //             <div>
    //                 <p>
    //                     收货地址：
    //                 </p>
    //                 <p>
    //                     {record.user_name}
    //                 </p>
    //                 <p>
    //                     {record.user_addr}
    //                 </p>
    //                 <p>
    //                     {record.user_phone}
    //                 </p>
    //             </div>
    //         <h4>教材：</h4>
    //         <p>等待教材表关联之后再完善</p>
    //         {/* {
    //           record.GoodsDetails.length > 0 ? (
    //             record.GoodsDetails.map((item) => {
    //               return (
    //                 <DetailItem
    //                   key={item.goodId}
    //                   detail={item}
    //                 />
    //               )
    //             })
    //           ) : null
    //         } */}
    //       </div>
    //     )
    //   }

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
            this.props.getAllGoods(this, this.state.data_search_params)
        }
    }
    export_data_toJSON = (selectedRowData) => {
        const entozh = {
            "g_id": "教材id",
            "g_p_0": "教材名称",
            "goods_stock_max": "库存状态",
            "goods_stock": "库存数量",
            "g_goods_position_list": "货架位置",
            "goods_expiration_date": "过期时间",
        }
        var json = []
        selectedRowData.map((selectItem) => {
            var line = {}
            Object.keys(entozh).map((key) => {
                line[entozh[key]] = selectItem[key]
                //临时教材只需要g_p_0,普通教材需要把名称拼起来
                if (key === 'g_p_0' && selectItem['goods_type'] === 0) {
                    line[entozh[key]] = selectItem['g_p_0'] + ' ' + selectItem['g_p_1'] + ' ' + selectItem['g_p_2'] + ' ' + selectItem['g_p_3'] + ' ' + selectItem['g_p_4'] + ' ' + selectItem['g_p_5']
                }
                //库存状态判断
                if (key === 'goods_stock_max') {
                    var stock_status = '未知'
                    if (selectItem['goods_stock_max'] === -1 || selectItem['goods_stock'] === -1) {
                        stock_status = '未知'
                    } else if (selectItem['goods_stock_max'] === 0 || selectItem['goods_stock'] === 0) {
                        stock_status = '无货'
                    } else {
                        let proportion = selectItem['goods_stock'] / selectItem['goods_stock_max'];
                        if (proportion > 0.3) {
                            stock_status = '充裕'
                        } else if (proportion > 0.2) {
                            stock_status = '短缺'
                        } else {
                            stock_status = '紧缺'
                        }
                    }
                    line[entozh[key]] = stock_status
                }
                //库存数量
                if (key === 'goods_stock' && selectItem[key] === -1) {
                    line[entozh[key]] = '未设置'
                }
                return ""
            })
            json.push(line)
            return ""
        })
        const sheet = XLSX.utils.json_to_sheet(json);
        this.openDownloadDialog(this.sheet2blob(sheet, '教材信息'), `导出教材.xlsx`);
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
            return (<Redirect to={{ pathname: "/goodsEdit", state: { originalData: this.state.pushToEditData } }} />);
        }

        const {
            isFetching
        } = this.state
        let Goods = this.state.Goods === undefined ? [] : this.state.Goods
        const columns = [{
            title: '教材id',
            dataIndex: 'g_id',
            key: 'g_id',
        }, {
            title: '教材名称',
            dataIndex: 'g_p_0',
            key: 'g_p_0',
            render: (text, record) => {
                return (<p>{record.goods_type === 0 ? record.g_p_0 + ' ' + record.g_p_1 + ' ' + record.g_p_2 + ' ' + record.g_p_3 + ' ' + record.g_p_4 + ' ' + record.g_p_5 : "" + record.g_p_0}</p>)
            }
        }, {
            title: '库存状态',
            dataIndex: 'goods_stock_max',
            key: 'goods_stock_max',
            render: (text, record) => {
                var stock_status = '未知'
                if (record.goods_stock_max === -1 || record.goods_stock === -1) {
                    stock_status = '未知'
                } else if (record.goods_stock_max === 0 || record.goods_stock === 0) {
                    stock_status = '无货'
                } else {
                    let proportion = record.goods_stock / record.goods_stock_max;
                    if (proportion > 0.3) {
                        stock_status = '充裕'
                    } else if (proportion > 0.2) {
                        stock_status = '短缺'
                    } else {
                        stock_status = '紧缺'
                    }
                }
                return (<p>{stock_status}</p>)
            }
        }, {
            title: '库存数量',
            dataIndex: 'goods_stock',
            key: 'goods_stock',
            render: (text, record) => {
                return (<p>{text === -1 ? '未设置' : text}</p>)
            }
        }, {
            title: '货架位置',
            dataIndex: 'g_goods_position_list',
            key: 'g_goods_position_list'
        }, {
            title: '过期时间',
            dataIndex: 'goods_expiration_date',
            key: 'goods_expiration_date',
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
                                onConfirm={res => { this.props.deleteGoods(this, record) }}
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
        var tableData = Goods
        // for(var index in Goods)
        // {
        //     var g = Goods[index]
        //     tableData.push({
        //         'g_id':g.g_id,
        //         'g_p_0':g.g_p_0,
        //         'g_p_1':g.g_p_1,
        //         'g_p_2':g.g_p_2,
        //         'g_p_3':g.g_p_3,
        //         'g_p_4':g.g_p_4,
        //         'g_p_5':g.g_p_5,
        //         'goods_status':g.goods_status===0?'正常':'已下架',
        //         'goods_stock':g.goods_stock===-1?'未设置':g.goods_stock,
        //         'g_goods_position_list':g.g_goods_position_list
        //     })
        // }
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
        //   const rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //       console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //     },
        //     getCheckboxProps: record => ({
        //       disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //       name: record.name,
        //     }),
        //   };

        return (
            <Layout.Content>
                <Panel minus>
                    <GoodsListHeader
                        handleSelectorChange={this.onSelectorChange}
                        Goods_status_list={this.state.Goods_status_list}
                        selectedRowData={this.state.selectedRowData}
                        export_xls_event={this.export_xls_event}
                    />
                    <Panel.Body type="light">
                        {
                            utils.getStorage(USER_USERTYPE) !== "2" ? (<Table
                                rowKey={record => record.Goods_id}
                                dataSource={tableData}
                                columns={columns}
                                loading={isFetching}
                                bordered
                                onChange={this.handleTableChange}
                                pagination={paginationProps}
                            />) : (<Table
                                rowKey={record => record.Goods_id}
                                dataSource={tableData}
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
            </Layout.Content>
        )
    }
}
