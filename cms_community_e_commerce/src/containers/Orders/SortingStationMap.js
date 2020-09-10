//分拣第二步

/* eslint-disable radix */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'moment/locale/zh-cn';
import {
    Layout,
    Breadcrumb,
    Divider,
    // Slider,
    Icon,
    Row,
    Col,
    Button,
    message,
} from 'antd';
import Panel from '../../components/Panel';
import WhMap from './WhMap'
import {
    authError
} from '../../actions/authAction';
import { ADMIN_API } from '../../constants';
import axios from 'axios';
import * as utils from '../../utils';
import { USER_TOKEN } from '../../constants';


@connect(
    state => ({
    }),
    dispatch => ({
        //订单发货
        DeliverGoods: (SSMap, o_id) => {
            try {
                SSMap.setState({
                    isFetching: true
                })
                var url = `${ADMIN_API}/order/set_Status`
                var params = { "o_status": "4", "o_id": o_id, "token": utils.getStorage(USER_TOKEN) }
                axios.post(url, params).then(res => {
                    console.log('body - ' + JSON.stringify(params))
                    if (res.status === 200 && res.data.requestStatus === 200) {
                        message.success("订单发货成功");
                        // const list = res.data.result.list
                        //订单数据
                        var findCurOrderList = SSMap.props.location.state.findCurOrderList
                        console.log("findCurOrderList - "+JSON.stringify(findCurOrderList))
                        var o_id_index = -1;
                        findCurOrderList.map((orderData, orderIndex) => {
                            if (orderData.order_id === o_id) {
                                o_id_index = orderIndex
                            }
                            return 0;
                        })
                        findCurOrderList.splice(o_id_index, 1);
                        SSMap.setState({
                            isFetching: false
                        })                        
                    } else {
                        console.log('test error')
                        dispatch(authError(res.data.message, res.data.requestStatus))
                    }
                })
            } catch (err) {
                console.log('request_error')
                if (err.response.status === 401) {
                    const errorMessage = '您的登录已过期，请重新登录'
                    dispatch(authError(errorMessage))
                }else{
                    const errorMessage = '服务器错误，请稍后再试'
                    dispatch(authError(errorMessage))
                }
            }
        }
    }))
export default class SortingStationMap extends React.Component {

    componentDidMount() {
        var code = "";
        var lastTime, nextTime;
        var lastCode, nextCode;
        var ssMap = this
        window.addEventListener('keypress', function (e) {
            nextCode = e.which;
            nextTime = new Date().getTime();

            if (lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
                code += String.fromCharCode(lastCode);
            } else if (lastCode != null && lastTime != null && nextTime - lastTime > 100) {
                code = "";
            }

            lastCode = nextCode;
            lastTime = nextTime;
            if (e.which === 13) {
                //教程和课程的键值对数据
                var findCurDataMap = ssMap.props.location.state.findCurDataMap
                //订单数据
                var findCurOrderList = ssMap.props.location.state.findCurOrderList
                findCurOrderList.map((orderData, orderIndex) => {
                    let orderViewKey = orderData.order_id
                    findCurDataMap[orderData.curriculum.replace (/^\s+|\s+$/g,"").replace("，",",")].map((curData, curIndex) => {
                        let c_num = parseInt(curData.c_num)
                        let cur_view_key = orderViewKey + "_" + curIndex
                        Object.keys(curData.c_goods_list).map((goodsKey, goodsIndex) => {
                            //扫描条形码命中了教材
                            if (code === goodsKey) {
                                let goodsData = curData.c_goods_list[goodsKey]
                                let goods_view_key = cur_view_key + "_" + goodsKey
                                let goods_num_key = goods_view_key + '_num'
                                ssMap.goods_num_add(goods_num_key, c_num, 0)

                                var scanHistoryList = ssMap.state.scanHistoryList
                                scanHistoryList.push(code+goodsData.g_p_0)
                                ssMap.setState({
                                    scanHistoryList: scanHistoryList
                                })
                            }
                            return ''
                        })
                        return ''
                    })
                    return ''
                })

                code = "";
            }
        })
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', () => { }, false);
    }

    state = {
        selectGoodsList: [],
        scanHistoryList: [],
    }

    //react项目使用a标签的锚点会引起路由跳转,这里只简单滑动到目标位置
    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            // 找到锚点
            let anchorElement = document.getElementById(anchorName);
            // 如果对应id的锚点存在，就跳转到锚点
            if (anchorElement) {
                anchorElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
        }
    }

    //增加分拣的教材数量
    goods_num_add = (num_id, num_max, span_id) => {
        let anchorElement = document.getElementById(num_id);
        if (anchorElement) {
            var num = Math.min(parseInt(anchorElement.innerHTML) + 1, num_max)
            anchorElement.innerHTML = num + ""
            var list = this.state.selectGoodsList;
            if (num === num_max && list.indexOf(num_id) === -1) {
                list.push(num_id)
                // console.log("list - " + JSON.stringify(list))
                this.setState({
                    selectGoodsList: list
                })
            }
        }
    }
    //减少分拣的教材数量
    goods_num_reduce = (num_id, num_max, span_id) => {
        // var list = this.state.selectGoodsKeyList;
        // list.pop(num_id)
        // this.setState({
        //     selectGoodsKeyList:list
        // })

        let anchorElement = document.getElementById(num_id);
        if (anchorElement) {
            var num = Math.max(parseInt(anchorElement.innerHTML) - 1, 0)
            anchorElement.innerHTML = num + ""
            // for(var index=1;index<=6;index++)
            // {
            //     //因为设置了上限,所以不需要判断下限相等
            //     document.getElementById(span_id+"_"+index).style.color = ''
            // }
            // document.getElementById(span_id+"_icon").style.color = ''
            var list = this.state.selectGoodsList;
            if (list.indexOf(num_id) !== -1) {
                list.splice(list.indexOf(num_id), 1)
                this.setState({
                    selectGoodsList: list
                })
            }
        }
    }


    get_tree_view() {
        //教程和课程的键值对数据
        let findCurDataMap = this.props.location.state.findCurDataMap
        //订单数据
        let findCurOrderList = this.props.location.state.findCurOrderList
        return (
            <div>
                {findCurOrderList.map((orderData, orderIndex) => {
                    let orderViewKey = orderData.order_id
                    //当前课程下有几个课程已被分拣完成
                    var selectCurKeyList = []
                    let orderData_curriculum = orderData.curriculum.replace (/^\s+|\s+$/g,"").replace("，",",")
                    findCurDataMap[orderData_curriculum].map((curData, curIndex) => {
                        var selectGoodsKeyNum = 0
                        let cur_view_key = orderViewKey + "_" + curIndex
                        this.state.selectGoodsList.map((goods_num_key) => {
                            if (goods_num_key.indexOf(cur_view_key) !== -1) {
                                selectGoodsKeyNum++;
                            }
                            return 0;
                        })
                        var c_goods_length = Object.keys(curData.c_goods_list).length
                        var cur_selected = selectGoodsKeyNum === c_goods_length && c_goods_length > 0
                        // console.log('selectGoodsKeyNum2 - '+selectGoodsKeyNum)
                        if (cur_selected) {
                            selectCurKeyList.push(curData.c_name + " * " + curData.c_num)
                        }
                        return 0;
                    })
                    var order_selected = selectCurKeyList.length === findCurDataMap[orderData_curriculum].length && findCurDataMap[orderData_curriculum].length > 0
                    return (<div
                        style={{ marginBottom: '20px' }}
                        key={orderViewKey}
                    >
                        <Row style={{ height: '30px' }}>
                            <Col span={24}><span style={{ color: orderData.tracking_id === '' || orderData.tracking_id === '未编辑' ? 'red' : 'light' }}>{orderData.tracking_id === '未编辑' ? '运单号为空' : orderData.tracking_id}</span><span style={{ marginLeft: '30px', marginRight: '30px' }}>{orderData.user_name}</span><span>{orderData.user_phone}</span></Col>
                        </Row>
                        <Row style={{ height: '35px' }}>
                            <Col span={0} />
                            <Col span={24}>
                                <Icon type={"meh-0"} />
                                {findCurDataMap[orderData_curriculum].map((curData, curIndex) => {
                                    var cur_name_num = curData.c_name + " * " + curData.c_num
                                    return (<span key={cur_name_num} style={{ marginRight: '5px', color: selectCurKeyList.indexOf(cur_name_num) !== -1 ? '#1890FF' : '' }}>
                                        {cur_name_num}
                                    </span>)
                                })}
                                {order_selected ? (<Button style={{ color: "#1890FF" }} onClick={() => { this.props.DeliverGoods(this, orderData.order_id) }}>{"发货"}</Button>) : (<div />)}
                            </Col>
                        </Row>
                        {findCurDataMap[orderData_curriculum].map((curData, curIndex) => {
                            let c_num = parseInt(curData.c_num)
                            let cur_view_key = orderViewKey + "_" + curIndex
                            //当前课程下有几个教材已被分拣完成
                            var selectGoodsKeyNum = 0
                            this.state.selectGoodsList.map((goods_num_key) => {
                                if (goods_num_key.indexOf(cur_view_key) !== -1) {
                                    selectGoodsKeyNum++;
                                }
                                return 0;
                            })
                            let c_goods_length = Object.keys(curData.c_goods_list).length
                            let cur_selected = selectGoodsKeyNum === c_goods_length && c_goods_length > 0
                            var cur_name_style = { marginLeft: '10px', color: cur_selected ? '#1890FF' : '' }
                            var goods_icon_type = cur_selected ? 'smile-o' : "meh-o"
                            var goods_icon_style = { color: cur_selected ? '#1890FF' : '' }
                            return (
                                <div
                                    key={cur_view_key}
                                >
                                    <Row style={{ height: '30px' }}>
                                        <Col span={2} />
                                        <Col span={22}>
                                            <Icon type={goods_icon_type} style={goods_icon_style} />
                                            <span style={cur_name_style}>
                                                {curData.c_name + " * " + c_num}
                                            </span>
                                        </Col>
                                    </Row>
                                    {Object.keys(curData.c_goods_list).length === 0 ? (
                                        <Row style={{ height: '30px' }}>
                                            <Col span={4} />
                                            <Col span={20}>
                                                <Icon type={"frown-o"} theme="twoTone" twoToneColor="#eb2f96" />
                                                <span style={{ marginLeft: '20px', color: 'red' }}>{"没有找到课程!"}</span></Col>
                                        </Row>
                                    ) : Object.keys(curData.c_goods_list).map((goodsKey, goodsIndex) => {
                                        let goodsData = curData.c_goods_list[goodsKey]
                                        let goods_view_key = cur_view_key + "_" + goodsKey
                                        let goods_num_key = goods_view_key + '_num'
                                        let goods_span_key = goods_view_key + '_span'
                                        var goods_span_style = { marginLeft: '10px', color: '' }
                                        var goods_icon_type = "meh-o"
                                        var goods_icon_style = { marginTop: '10px', color: '' }
                                        if (this.state.selectGoodsList.indexOf(goods_num_key) !== -1) {
                                            goods_span_style = { marginLeft: '10px', color: '#1890FF' }
                                            goods_icon_type = 'smile-o'
                                            goods_icon_style = { marginTop: '10px', color: '#1890FF' }
                                        }
                                        if (Object.keys(goodsData).length === 0) {
                                            return (
                                                <Row key={goods_view_key} style={{ height: '30px' }}>
                                                    <Col span={4} />
                                                    <Col span={20}>
                                                        <Icon type={"frown-o"} theme="twoTone" twoToneColor="#eb2f96" />
                                                        <span style={{ marginLeft: '20px', color: 'red' }}>{goodsKey + " : 缺少关联教材!"}</span></Col>
                                                </Row>)
                                        } else {
                                            return (
                                                <Row key={goods_view_key} style={{ height: '60px' }}>
                                                    <Col span={4} />
                                                    <Col span={1}>
                                                        <Icon type={goods_icon_type} id={goods_span_key + "_icon"} style={goods_icon_style} />
                                                    </Col>
                                                    <Col span={16} >
                                                        <Row>
                                                            <Col>
                                                                <span style={goods_span_style} id={goods_span_key + "_1"}>{goodsData.g_p_0}</span>
                                                                <span style={goods_span_style} id={goods_span_key + "_2"}>{goodsData.g_p_1}</span>
                                                                <span style={goods_span_style} id={goods_span_key + "_3"}>{goodsData.g_p_2}</span>
                                                                <span style={goods_span_style} id={goods_span_key + "_4"}>{goodsData.g_p_3}</span>
                                                                <span style={goods_span_style} id={goods_span_key + "_5"}>{goodsData.g_p_4}</span>
                                                                <span style={goods_span_style} id={goods_span_key + "_6"}>{goodsData.g_p_5}</span>
                                                                {new Date(goodsData.goods_expiration_date).getTime() < new Date().getTime() ? (<div />) : (<span>
                                                                    <Button style={{ marginTop: '0px', marginLeft: '40px' }} onClick={() => { this.goods_num_reduce(goods_num_key, c_num, goods_span_key) }}>{"-"}</Button>
                                                                    <span style={{ marginTop: '0px', marginLeft: '10px', marginRight: '10px', color: 'light', alignSelf: 'center' }} id={goods_num_key}>{"0"}</span>
                                                                    <Button style={{ marginTop: '0px' }} onClick={() => { this.goods_num_add(goods_num_key, c_num, goods_span_key) }}>{"+"}</Button>
                                                                </span>)}
                                                            </Col>
                                                            <Col>
                                                                {
                                                                    new Date(goodsData.goods_expiration_date).getTime() < new Date().getTime() ? (<p style={{ marginLeft: '10px', color: 'red' }}>{"已过期"}</p>) : (
                                                                        goodsData.g_goods_position_list.split(',').map((postion, pIndex) => {
                                                                            return (
                                                                                <a style={goods_span_style} onClick={() => this.scrollToAnchor(postion)} key={goods_view_key + " - " + postion}>
                                                                                    {postion}
                                                                                </a>
                                                                            )
                                                                        })
                                                                    )
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                    })}
                                </div>
                            )
                        })}
                        <Divider dashed={true}></Divider>
                    </div>)
                })}
            </div>
        )
    }

    render() {
        var findCurDataMap = this.props.location.state.findCurDataMap
        var findCurOrderList = this.props.location.state.findCurOrderList
        var position_map = {}
        for (var key in findCurDataMap) {
            let cur_list = findCurDataMap[key]
            for (var c_index in cur_list) {
                let cur = cur_list[c_index]
                for (var goods_id in cur.c_goods_list) {
                    var goods = cur.c_goods_list[goods_id]
                    if (goods.g_goods_position_list === undefined) {
                        continue;
                    }
                    // console.log(goods_id)
                    // console.log(JSON.stringify(goods))
                    var g_goods_position_list = goods.g_goods_position_list.split(",")
                    // console.log("g_goods_position_list - " + g_goods_position_list)
                    for (var index in g_goods_position_list) {
                        position_map[g_goods_position_list[index]] = goods.g_p_0 + ' - ' + goods.g_p_1 + ' - ' + goods.g_p_2 + ' - ' + goods.g_p_3 + ' - ' + goods.g_p_4 + ' - ' + goods.g_p_5 + ' - ' + goods.g_id
                    }
                }
            }
        }
        // console.log("position_map - " + JSON.stringify(position_map))
        return (
            <Layout.Content >
                <Panel style={{ backgroundColor: 'white' }}>
                    <Panel.Header type="light">
                        <Breadcrumb>
                            <Breadcrumb.Item>主页</Breadcrumb.Item>
                            <Breadcrumb.Item>分拣管理</Breadcrumb.Item>
                            <Breadcrumb.Item>仓库位置取货</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>按位置取货</h2>
                        <p>参考仓库地图,找到所选订单对应的课程教材</p>
                        <Divider style={{ marginTop: '10px', marginBottom: '30px' }} />
                    </Panel.Header>
                    {findCurOrderList.length === 0 ? (
                        <span style={{ marginLeft: '30px', color: 'red' }}>{"没有更多订单"}</span>
                    ) : (
                            <Row style={{ padding: '10px 30px 100px 30px', backgroundColor: 'white' }}>
                                <Col span={15}>
                                    {this.get_tree_view()}
                                </Col>
                                <Col span={1}>
                                    <Divider type={'vertical'} />
                                </Col>
                                <Col span={8} style={{ borderStyle: 'solid', borderWidth: '0px', borderColor: 'light' }}>
                                    <div>
                                        <p>
                                            {"条形码录入记录:"}
                                        </p>
                                        {this.state.scanHistoryList.map((code,index)=>{
                                            return (<p key={"scan_history"+index}>{code}</p>)
                                        })}
                                    </div>
                                </Col>
                            </Row>)}
                    <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                    {/* {JSON.stringify(findCurDataMap)}
                    {"\n\n"}
                    <p style={{ color: 'red' }}>{JSON.stringify(findCurOrderList)}</p> */}
                    <WhMap position_list={Object.keys(position_map)} show_p_id={(p_id) => { console.log("p_id  -" + position_map[p_id]) }} />
                </Panel>
            </Layout.Content>
        )
    }
}
