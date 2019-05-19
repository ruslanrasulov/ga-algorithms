import React from 'react';
import Highcharts from 'highcharts';
import {
    HighchartsChart,
    Chart,
    XAxis,
    YAxis,
    Title,
    Legend,
    LineSeries,
    withHighcharts
} from 'react-jsx-highcharts';
import { flatten } from 'lodash';

const plotOptions = {
    series: {
        pointStart: 1
    }
};

const AlgorithmChart = props => 
    <HighchartsChart plotOptions={plotOptions}>
        <Chart width={600} height={350} />
        <Title>Статистика бактерий и вирусов</Title>

        <Legend layout='vertical' align='right' verticalAlign='middle' />

        <XAxis>
            <XAxis.Title>Поколение</XAxis.Title>
        </XAxis>

        <YAxis>
            <YAxis.Title>Количество элементов</YAxis.Title>
            <LineSeries name='Бактерии' data={props.algorithm.generations.map(g => flatten(g.cells).filter(c => c.elementType === 0).length)} />
            <LineSeries name='Вирусы' data={props.algorithm.generations.map(g => flatten(g.cells).filter(c => c.elementType === 1).length)} />
        </YAxis>

    </HighchartsChart>

export default withHighcharts(AlgorithmChart, Highcharts);
