//订单概要模块UI
import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default class OrderCharts extends React.Component {
  getOption = () => {
    const {
        seriesData,
        legendData,
        // dataTime,
    } = this.props

    return {
      title : {
        text: '订单情况概要',
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
    //   xAxis:{
    //     type:'category'
    //   },
      series : [
        {
        // name: {dataTime},
        name:'实时数据',
        type: 'pie',
        // coordinateSystem:'cartesian2d',
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
        opts={{renderer:'canvas'}}
      />
    )
  }
}
