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
            <LineSeries name='Бактерии' data={props.iterations.map(i => i.bacteriaCount)} />
            <LineSeries name='Вирусы' data={props.iterations.map(i => i.virusCount)} />
        </YAxis>

    </HighchartsChart>

export default withHighcharts(AlgorithmChart, Highcharts);
