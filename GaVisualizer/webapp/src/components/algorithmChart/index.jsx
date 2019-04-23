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

const AlgorithmChart = () => 
    <HighchartsChart plotOptions={plotOptions}>
        <Chart />
        <Title>Virus/Bacteria statistic per iteration</Title>

        <Legend layout='vertical' align='right' verticalAlign='middle' />

        <XAxis>
            <XAxis.Title>Iteration</XAxis.Title>
        </XAxis>

        <YAxis>
            <YAxis.Title>Element count</YAxis.Title>
            <LineSeries name='Bacteria' data={[30, 24, 25, 38, 45]} />
            <LineSeries name='Viruses' data={[30, 36, 35, 22, 15]} />
        </YAxis>

    </HighchartsChart>

export default withHighcharts(AlgorithmChart, Highcharts);
