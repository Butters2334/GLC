/* eslint-disable radix */
import React from 'react';
import 'moment/locale/zh-cn';
import PropTypes from 'prop-types';
// import Panel from '../../components/Panel';
import {
    // Button,
    Row,
    Col,
    Badge,
    // Layout,
} from 'antd';

//仓库地图
function WhMap(props) {
        var position_list = props.position_list
        if(position_list === undefined)
        {
            position_list = []
        }
        //先将仓库地图转为伪类后再生成
        let whClass = [
            // ['', ''],
            // ['', ''],
            // ['', ''],
            ['', 'A24'],
            ['', ''],
            ['', 'A23'],
            ['A25', 'A22'],
            ['', ''],
            ['A26', 'A21'],
            ['A27', 'A20'],
            ['', ''],
            ['A28', 'A19'],
            ['A29', 'A18'],
            ['', ''],
            ['A30', 'A17'],
            ['A31', 'A16'],
            ['', ''],
            ['A32', 'A15'],
            ['A33', 'A14'],
            ['', ''],
            ['A34', 'A13'],
            ['A35', 'A12'],
            ['', ''],
            ['A36', 'A11'],
            ['A37', 'A10'],
            ['', ''],
            ['A38', ''],
            ['A39', ''],
            ['', ''],
            ['A40', 'A9'],
            ['A41', 'A8'],
            ['', ''],
            ['A42', 'A7'],
            ['A43', 'A6'],
            ['', ''],
            ['A44', 'A5'],
            ['', 'A4'],
            ['', ''],
            ['', 'A3'],
            ['', 'A2'],
            ['', ''],
            ['', 'A1'],
        ]
        return (
            <div style={{backgroundColor:'white',padding:'10px 30px 100px 30px'}}>
                {whClass.map((item, index) => {
                    let leftItem = item[0];
                    let rightItem = item[1];
                    //左边部分18个,部分27个
                    let leftSubItem = []
                    for (var leftIndex = 0; leftIndex < 3; leftIndex++) {
                        var leftLine = []
                        for (var leftIndex2 = parseInt(leftItem.split('A')[1]) > 35 ? 6 : 9; leftIndex2 >= 1; leftIndex2--) {
                            leftLine.push(leftItem + '-' + (leftIndex * 9 + leftIndex2))
                        }
                        leftSubItem.push(leftLine)
                    }
                    let leftBorderWidth = leftItem === '' ? '0px' : '1px'
                    let leftTopBorderWidth = (leftItem !== '' && index > 0 && whClass[index - 1][0] !== '') ? '0px' : '1px'
                    let leftSubColr = (<Row key={index + 'sub_key'} style={{ borderStyle: 'solid', borderWidth: leftBorderWidth, borderTopWidth: leftTopBorderWidth, borderColor: 'light', height: '75px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                        <Col span={20} style={{ height: '100%', position: 'relative' }}>
                            {leftSubItem.map((list, lIndex) => {
                                return (<Row key={lIndex + 'sub_col_key'} style={{ height: '35%' }} >
                                    {list.map((leftSubColItem, itemIndex) => {
                                        return (<Col span={2} key={itemIndex + 'sub_col_key_fk'} style={{ height: '100%', width: '11%' }}>
                                            {position_list.indexOf(leftSubColItem) !== -1 ? (<Badge dot>
                                                <a id={leftSubColItem} style={{color:'red'}} onClick={() => {
                                                    props.show_p_id(leftSubColItem)
                                                }}>
                                                    {leftSubColItem.split('-')[1]}
                                                </a>
                                            </Badge>) : leftSubColItem.split('-')[1]}
                                        </Col>)
                                    })}
                                </Row>)
                            })}
                        </Col>
                        <Col span={4} style={{ borderStyle: 'solid', borderWidth: '0px', borderLeftWidth: '1px', borderColor: 'light', height: '100%', position: 'relative' }}>
                            <p style={{ width: '100%', height: '10px', position: 'absolute', margin: '25px 0 0px 0' }}>
                                {leftItem}
                            </p>
                        </Col>
                    </Row>)


                    //右边固定27个
                    let rightSubItem = []
                    for (var rightIndex = 0; rightIndex < 3; rightIndex++) {
                        var rightLine = []
                        for (var rightIndex2 = 1; rightIndex2 <= 9; rightIndex2++) {
                            rightLine.push(rightItem + '-' + (rightIndex * 9 + rightIndex2))
                        }
                        rightSubItem.push(rightLine)
                    }
                    let rightBorderWidth = rightItem === '' ? '0px' : '1px'
                    let rightTopBorderWidth = (rightItem !== '' && index > 0 && whClass[index - 1][1] !== '') ? '0px' : '1px'
                    let rightSubColr = (<Row key={index + 'sub_key'} style={{ borderStyle: 'solid', borderWidth: rightBorderWidth, borderTopWidth: rightTopBorderWidth, borderColor: 'light', height: '75px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                        <Col span={4} style={{ height: '100%', position: 'relative', borderStyle: 'solid', borderWidth: '0px', borderRightWidth: '1px', borderColor: 'light' }}>
                            <p style={{ width: '100%', height: '10px', position: 'absolute', margin: '25px 0 0px 0' }}>
                                {rightItem}
                            </p>
                        </Col>
                        <Col span={20} style={{ height: '100%', position: 'relative' }}>
                            {rightSubItem.map((list, lIndex) => {
                                return (<Row key={lIndex + 'sub_col_key'} style={{ height: '35%' }} gutter={10}>
                                    {list.map((rightSubColItem, itemIndex) => {
                                        return (<Col span={2} key={itemIndex + 'sub_col_key_fk'} style={{ height: '100%', width: '11%' }}>
                                            {position_list.indexOf(rightSubColItem) !== -1 ? (<Badge dot>
                                                <a class={rightSubColItem} style={{color:'red'}} onClick={() => {
                                                    props.show_p_id(rightSubColItem)
                                                }}>
                                                    {rightSubColItem.split('-')[1]}
                                                </a>
                                            </Badge>) : rightSubColItem.split('-')[1]}
                                        </Col>)
                                    })}
                                </Row>)
                            })}
                        </Col>
                    </Row>)

                    return (<Row key={index + '_key'} style={{ height: (leftItem === '' && rightItem === '') ? '30px' : '75px' }}>
                        <Col span={10} style={{}}>
                            {leftItem === '' ? '' : leftSubColr}
                        </Col>
                        <Col span={2}></Col>
                        <Col span={12} style={{}}>
                            {rightItem === '' ? '' : rightSubColr}
                        </Col>
                    </Row>)
                })}
            </div>
        )
}
WhMap.propTypes = {
    position_list: PropTypes.array.isRequired,
    show_p_id:PropTypes.func.isRequired,
  }
export default WhMap
