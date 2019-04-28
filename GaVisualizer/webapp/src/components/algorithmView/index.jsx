import React, { Component } from 'react';
import AlgorithmChart from '../algorithmChart';
import './_styles.scss';
import Board from '../board';

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
            algorithmInfo: { algorithmId, isPaused } 
        } = this.props;

        if (!isPaused) {
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
        const { timeout, isStopped } = this.props.algorithmInfo;
        
        if (isStopped) return;

        setTimeout(() => {
            this.onUpdate();
        }, timeout || 1000);
    }

    render = () => (
        <div className='alg-container'>
            <div className="alg-container__board">
                <Board algorithmId={this.props.algorithmInfo.algorithmId} width={400} height={400} />
            </div>

            <div className='alg-container__chart'>
                <AlgorithmChart />
            </div>

            <div className='alg-container__panel'>
                {this.props.algorithmInfo.isStarted
                    ? <div className='btn btn-stop alg-container__panel__panel-element' onClick={this.onStop}>Stop</div>
                    : <div className='btn btn-start alg-container__panel__panel-element' onClick={this.onStart}>Start</div> }

                {this.props.algorithmInfo.isPaused 
                    ? <div className='btn btn-resume alg-container__panel__panel-element' onClick={this.onResume}>Resume</div>
                    : <div className='btn btn-pause alg-container__panel__panel-element' onClick={this.onPause}>Pause</div> }

                <input 
                    type='range'
                    min='500'
                    max='5000'
                    className='alg-container__panel__input-timeout alg-container__panel__panel-element'
                    defaultValue={this.state.updateIntervalValue}
                    ref={this.intervalRange}
                    onMouseUp={this.updateInterval} />
                <label>Update interval ({this.state.updateIntervalValue} ms)</label>

                <div className='btn btn-remove alg-container__panel__panel-element' onClick={this.onRemove}>Remove</div>
            </div>
        </div>
    );
}

export default AlgorithmView;