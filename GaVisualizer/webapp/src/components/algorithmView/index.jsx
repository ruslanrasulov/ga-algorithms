import React, { Component } from 'react';

// import AlgorithmChart from '../algorithmChart';
import Board from '../board';
//import ElementInfo from '../elementInfo';

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

    setGenerations = e => {
        const splitedIndecies = e.currentTarget.dataset.indecies.split('-');
        const { onSetGenerations, algorithm: { id } } = this.props;

        onSetGenerations({
            id,
            leftGenerationIndex: +splitedIndecies[0] - 1,
            rightGenerationIndex: +splitedIndecies[1] - 1
        })
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

    renderGenerationsNavigation = () => {
        const { length } = this.props.algorithm.generations;
        
        if (length < 2) {
            return null;
        }

        const links = [];
        
        for (let i = 1; i < length; i++) {
            const linkElements = `${i}-${i+1}`;
            links.push(<span key={i} onClick={this.setGenerations} data-indecies={linkElements}>{linkElements}</span>);
        }

        return links;
    }

    //TODO: remove multiply boards showing
    renderBoards = () => {
        const { id, generations, leftGenerationIndex, rightGenerationIndex } = this.props.algorithm;
        const generationIndexes = [];

        if (leftGenerationIndex === undefined || rightGenerationIndex === undefined) {
            // if (generations.length > 1) {
            //     generationIndexes.push(generations.length - 2);
            // }
            generationIndexes.push(generations.length - 1);
        }
        else {
            //generationIndexes.push(leftGenerationIndex);
            generationIndexes.push(rightGenerationIndex);
        }

        return generationIndexes.map(i =>
            <div className='alg-container__board' key={id + i}>
                <Board id={id} generationIndex={i} />
            </div>);
    }

    updateState = () => {
        this.props.onNext(this.props.algorithm.id);
    }

    getSelectionType = () => {
        switch (this.props.algorithm.selectionType) {
            case 0: {
                return 'Турнирная сетка';
            }
            case 1: {
                return 'Отбор усечением';
            }
            case 2: {
                return 'Пропорциональный отбор';
            }
        }
    }

    getCrossoverType = () => {
        switch (this.props.algorithm.crossoverType) {
            case 0: {
                return 'Точечное';
            }
            case 1: {
                return 'Двухточечное';
            }
            case 3: {
                return 'Многоточечное';
            }
            case 4: {
                return 'Равномерное';
            }
            case 5: {
                return 'Оператор инверсии';
            }
        }
    }

    getCurrentStep = () => {
        switch (this.props.algorithm.currentState) {
            case 0: {
                return '';
            }
            case 1: {
                return 'Мутация';
            }
            case 2: {
                return 'Вычисление фитес функции';
            }
            case 3: {
                return 'Селекция';
            }
            case 4: {
                return 'Скрещивание';
            }
        }
    }

    render = () => {
        const { algorithm } = this.props;
        const { updateIntervalValue } = this.state;

        return (
            <div className='alg-container'>
                {this.renderBoards()}
                {/* {this.renderGenerationsNavigation()} */}

                <div className='alg-container__element-info'>
                    <div>Поколение: {algorithm.generations.length}</div>
                    <div>Тип селекции: {this.getSelectionType()}</div>
                    <div>Тип скрещивания: {this.getCrossoverType()}</div>
                    <div>Текущий шаг: {this.getCurrentStep()}</div>
                </div>

                <div className='alg-container__chart'>
                    {/* <AlgorithmChart algorithm={algorithm} /> */}
                </div>

                <div className='alg-container__panel'>
                    <button className='btn' onClick={this.updateState}>Next {algorithm.currentState}</button>
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