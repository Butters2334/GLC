//仓库布局

import React from 'react';
import 'moment/locale/zh-cn';
import {
    Layout,
    Breadcrumb,
    Divider,
} from 'antd';
import Panel from '../../components/Panel';
import WhMap from './WhMap'

export default class Warehouse extends React.Component {

    render() {
        return (
            <Layout.Content >
                <Panel style={{ backgroundColor: 'white' }}>
                    <Panel.Header type="light">
                        <Breadcrumb>
                            <Breadcrumb.Item>主页</Breadcrumb.Item>
                            <Breadcrumb.Item>仓库管理</Breadcrumb.Item>
                            <Breadcrumb.Item>仓库布局</Breadcrumb.Item>
                        </Breadcrumb>
                        <h2>仓库布局</h2>
                        <p>查看仓库地图,可以实时查看订单需要的教材</p>
                        <Divider style={{ marginTop: '10px', marginBottom: '30px' }} />
                    </Panel.Header>
                    <WhMap position_list={[]} show_p_id={(p_id)=>{console.log("p_id"+p_id)}}/>
                </Panel>
            </Layout.Content>
        )
    }
}
