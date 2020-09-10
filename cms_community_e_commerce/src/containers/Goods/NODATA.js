import React from 'react';
import 'moment/locale/zh-cn';
import {
    Layout,
    Empty
} from 'antd';

export default class NODATA extends React.Component {

  render() {
    return (
      <Layout.Content>
        <Empty description={"开发中"} style={{marginTop: '100px'}}/>
      </Layout.Content>
    )
  }
}
