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
        <Title>Virus/Bacteria statistic per iteration</Title>

        <Legend layout='vertical' align='right' verticalAlign='middle' />

        <XAxis>
            <XAxis.Title>Iteration</XAxis.Title>
        </XAxis>

        <YAxis>
            <YAxis.Title>Element count</YAxis.Title>
            <LineSeries name='Bacteria' data={props.iterations.map(i => i.bacteriaCount)} />
            <LineSeries name='Viruses' data={props.iterations.map(i => i.virusCount)} />
        </YAxis>

    </HighchartsChart>

export default withHighcharts(AlgorithmChart, Highcharts);
