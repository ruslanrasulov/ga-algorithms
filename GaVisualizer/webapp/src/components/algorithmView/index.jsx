import React, { Component } from 'react';

import AlgorithmChart from '../algorithmChart';
import Board from '../board';
import ElementInfo from '../elementInfo';

import './_styles.scss';

class AlgorithmView extends Component {
    constructor(props) {
        super(props);

        this.state = { updateIntervalValue: 1000 };

        this.board = React.createRef();
        this.intervalRange = React.createRef();
    }

    onStart = () => {
        const {
            onAlgorithmStart,
            algorithmInfo: { algorithmId }
        } = this.props;

        onAlgorithmStart(algorithmId, this.startIntervalUpdating);
    }

    onUpdate = () => {
        const {
            onAlgorithmUpdate,
            algorithmInfo: { algorithmId, isPaused, isStarted }
        } = this.props;

        if (isStarted && !isPaused) {
            onAlgorithmUpdate(algorithmId, this.startIntervalUpdating);
        }
    }

    onPause = () => {
        const { 
            onAlgorithmPause,
            algorithmInfo: { algorithmId }
        } = this.props;

        onAlgorithmPause(algorithmId);
    }

    onResume = () => {
        const { 
            onAlgorithmResume,
            algorithmInfo: { algorithmId }
        } = this.props;

        onAlgorithmResume(algorithmId, this.startIntervalUpdating);
    }

    onRemove = () => {
        const { 
            onAlgorithmRemove,
            algorithmInfo: { algorithmId } 
        } = this.props;
        
        this.onStop();
        onAlgorithmRemove(algorithmId);
    }

    onStop = () => {
        const { 
            onAlgorithmStop,
            algorithmInfo: { algorithmId } 
        } = this.props;

        onAlgorithmStop(algorithmId);
    }

    updateInterval = () => {
        const currentValue = this.intervalRange.current.value;
        const {
            onIntervalUpdate,
            algorithmInfo: { algorithmId } 
        } = this.props;

        this.setState({ updateIntervalValue: currentValue });

        onIntervalUpdate(algorithmId, currentValue);
    }

    startIntervalUpdating = () => {
        const { timeout, isStopped, isStarted } = this.props.algorithmInfo;
        
        if (isStarted && isStopped) return;
        
        setTimeout(() => {
            this.onUpdate();
        }, timeout || 1000);
    }

    render = () => {
        const { algorithmInfo } = this.props;
        const { updateIntervalValue } = this.state;
        const elementInfo = algorithmInfo ? algorithmInfo.elementInfo : null;

        return (
            <div className='alg-container'>
                <div className="alg-container__board">
                    <Board algorithmId={algorithmInfo.algorithmId} width={400} height={400} />
                </div>

                <div className="alg-container__element-info">
                    {
                        elementInfo
                            ? <ElementInfo 
                                elementType={elementInfo.elementType}
                                socialValue={elementInfo.socialValue}
                                productivity={elementInfo.productivity}
                                age={elementInfo.age}
                                fitnessValue={elementInfo.fitnessValue} />
                            : null
                    }
                </div>

                <div className='alg-container__chart'>
                    <AlgorithmChart iterations={algorithmInfo.iterations} />
                </div>

                <div className='alg-container__panel'>
                    {algorithmInfo.isStarted
                        ? <div className='btn btn-error alg-container__panel__panel-element' onClick={this.onStop}>Стоп</div>
                        : <div className='btn btn-success alg-container__panel__panel-element' onClick={this.onStart}>Старт</div> }

                    {algorithmInfo.isPaused 
                        ? <div className='btn btn-info alg-container__panel__panel-element' onClick={this.onResume}>Возобновить</div>
                        : <div className='btn btn-warning alg-container__panel__panel-element' onClick={this.onPause}>Пауза</div> }

                    <input 
                        type='range'
                        min='500'
                        max='5000'
                        className='alg-container__panel__input-timeout alg-container__panel__panel-element'
                        defaultValue={updateIntervalValue}
                        ref={this.intervalRange}
                        onMouseUp={this.updateInterval} />
                    <label>Интервал обновления ({updateIntervalValue} мс)</label>

                    <div className='btn btn-error alg-container__panel__panel-element' onClick={this.onRemove}>Удалить</div>
                </div>
            </div>
        );
    }
}

export default AlgorithmView;