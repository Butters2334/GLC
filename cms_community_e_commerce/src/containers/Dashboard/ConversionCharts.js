//异常提示模块UI

import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default class ConversionCharts extends React.Component {
  getOption = () => {
    const {
        seriesData,
        legendData,
    } = this.props

    return {
      title : {
        text: '今日状态',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: legendData,
      },
      series : [
        {
        name: '统计情况',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:seriesData,
        itemStyle: {
          emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
        }
      ]
    }
  }

  render() {
    return (
      <ReactEcharts
        option={this.getOption()}
        style={{
          height: 300,
          backgroundColor: '#fff',
          padding: '24px'
        }}
      />
    )
  }
}
