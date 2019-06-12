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

const AlgorithmChart = props => {
        const beforeLast = props.algorithm.generations.length - 1;
        const cells = props.algorithm.generations.slice(0, beforeLast).map(g => flatten(g.cells));
        const bacteriumPerGenerations = cells.map(cell => cell.filter(c => c.elementType === 0).length);
        const virusesPerGeneratinos = cells.map(cell => cell.filter(c => c.elementType === 1).length);

        return (
            <HighchartsChart plotOptions={plotOptions}>
                <Chart width={400} height={250} />
                <Title>Статистика бактерий и вирусов</Title>

                <Legend layout='vertical' align='right' verticalAlign='middle' />

                <XAxis>
                    <XAxis.Title>Поколение</XAxis.Title>
                </XAxis>

                <YAxis>
                    <YAxis.Title>Количество элементов</YAxis.Title>
                    <LineSeries name='Бактерии' data={bacteriumPerGenerations} />
                    <LineSeries name='Вирусы' data={virusesPerGeneratinos} />
                </YAxis>

            </HighchartsChart>
        )
    }

export default withHighcharts(AlgorithmChart, Highcharts);
