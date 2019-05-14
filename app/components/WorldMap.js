import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/map';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/visualMap';
import 'echarts/map/js/world'

//import lodash
const _ = require('lodash');

class WorldMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            regionOption: {},
        }
    }

    makeMapData(rawData, geoCoordMap) {
        console.log('geoCoordMap: ', geoCoordMap)
        console.log('rawData: ',rawData)
        let mapData = [];
        for (let i = 0; i < rawData.length; i++) {
            let geoCoord = geoCoordMap[rawData[i]];
            console.log('geoCo is ', geoCoord)
            if (geoCoord) {
                mapData.push({
                    name: rawData[i],
                    value: geoCoord.concat(rawData[i])
                });
            }
        }
        console.log('ok',mapData)
        return mapData;
    }

    getToday() {
        let weekdays = new Array(
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        );
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        let day = weekdays[today.getDay()]
        today = mm + '-' + dd + '-' + yyyy + ', ' + day;
        return today
    }

    generateRegionOption(rawData, geoCoordMap, name) {
        let option = {
            backgroundColor: new echarts.graphic.RadialGradient(0.5, 0.5, 0.4, [{
                offset: 0,
                color: '#006994'
            }, {
                offset: 1,
                color: '#006994'
            }]),
            title: {
                text: name + ' Weather: ' + this.getToday(),
                left: 'center',
                top: 5,
                itemGap: 0,
                textStyle: {
                    color: '#eee'
                },
                z: 200
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    console.log('params is ', params)
                    let value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
                    return params.seriesName + '<br/>' + params.name + ' : ' + value;
                }
            },
            geo: {
                map: 'world',
                silent: true,
                label: {
                    emphasis: {
                        show: false,
                        areaColor: '#eee'
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 0.5,
                        borderColor: '#006994'
                    }
                },
                left: '10%',
                top: '10%',
                bottom: '5%',
                right: '10%',
                roam: true
            },
            series: [
                {
                    name: 'The current weather of ' + name,
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    symbolSize: 15,
                    data: this.makeMapData(rawData, geoCoordMap),
                    activeOpacity: 1,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            color: '#FF0000',
                        }
                    },
                },
            ]
        }
        this.setState({ regionOption: option });
    }

    componentDidMount() {
        this.generateRegionOption(this.props.rawData, this.props.geoCoordMap, this.props.name)
    }

    componentWillReceiveProps(nextProps) {
        try {
            if (!_.isEqual(nextProps.rawData, this.props.rawData)) {
                this.generateRegionOption(nextProps.rawData, nextProps.geoCoordMap, nextProps.name)
            }
        } catch (e) {
            return
        }
    }

    render() {
        return (
            <ReactEcharts
                id="region"
                style={{ 'height': '500px' }}
                option={this.state.regionOption}>
            </ReactEcharts>
        )
    }
}

WorldMap.propTypes = {
    geoCoordMap: PropTypes.object,
    rawData: PropTypes.array,
    name: PropTypes.string,
};

export default (WorldMap)