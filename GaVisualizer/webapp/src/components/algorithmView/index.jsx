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
            algorithm: { id }
        } = this.props;

        onAlgorithmStart(id, this.startIntervalUpdating);
    }

    onUpdate = () => {
        const {
            onAlgorithmUpdate,
            algorithm: { id, isPaused, isStarted }
        } = this.props;

        if (isStarted && !isPaused) {
            onAlgorithmUpdate(id, this.startIntervalUpdating);
        }
    }

    onPause = () => {
        const { 
            onAlgorithmPause,
            algorithm: { id }
        } = this.props;

        onAlgorithmPause(id);
    }

    onResume = () => {
        const { 
            onAlgorithmResume,
            algorithm: { id }
        } = this.props;

        onAlgorithmResume(id, this.startIntervalUpdating);
    }

    onRemove = () => {
        const { 
            onAlgorithmRemove,
            algorithm: { id } 
        } = this.props;
        
        this.onStop();
        onAlgorithmRemove(id);
    }

    onStop = () => {
        const { 
            onAlgorithmStop,
            algorithm: { id } 
        } = this.props;

        onAlgorithmStop(id);
    }

    updateInterval = () => {
        const currentValue = this.intervalRange.current.value;
        const {
            onIntervalUpdate,
            algorithm: { id } 
        } = this.props;

        this.setState({ updateIntervalValue: currentValue });

        onIntervalUpdate(id, currentValue);
    }

    startIntervalUpdating = () => {
        const { timeout, isStopped, isStarted } = this.props.algorithm;
        
        if (isStarted && isStopped) return;
        
        setTimeout(() => {
            this.onUpdate();
        }, timeout || 1000);
    }

    render = () => {
        const { algorithm } = this.props;
        const { updateIntervalValue } = this.state;
        const elementInfo = algorithm ? algorithm.elementInfo : null;

        return (
            <div className='alg-container'>
                <div className="alg-container__board">
                    {algorithm.generations.map((g, i) => <Board key={algorithm.id + i} id={algorithm.id} generationIndex={i} />)}
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
                    <AlgorithmChart algorithm={algorithm} />
                </div>

                <div className='alg-container__panel'>
                    {algorithm.isStarted
                        ? <div className='btn btn-error alg-container__panel__panel-element' onClick={this.onStop}>Стоп</div>
                        : <div className='btn btn-success alg-container__panel__panel-element' onClick={this.onStart}>Старт</div> }

                    {algorithm.isPaused 
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