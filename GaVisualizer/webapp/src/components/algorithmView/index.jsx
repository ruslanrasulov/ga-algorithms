import React, { Component } from 'react';
import './_styles.scss';

class AlgorithmView extends Component {
    constructor(props) {
        super(props);

        this.board = React.createRef();
        this.timeoutRange = React.createRef();
    }

    drawGrid(ctx, cells, boardWidth, boardHeight, cellWidth, cellHeight) {
        ctx.strokeStyle = '#000000';

        for (let i = 0; i < cells.length + 1; i++) {
            for (let j = 0; j < cells[0].length + 1; j++) {
                ctx.beginPath();
                ctx.moveTo(cellWidth * i, 0);
                ctx.lineTo(cellWidth * i, boardWidth);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(0, cellHeight * j);
                ctx.lineTo(boardHeight, cellHeight * j);
                ctx.stroke();
            }
        }
    }

    fillGrid(ctx, cells, cellWidth, cellHeight) {
        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[0].length; j++) {
                if (cells[i][j].virusImmunity !== undefined) {
                    ctx.fillStyle = '#00ff00';
                }
                else {
                    ctx.fillStyle = '#ff0000';
                }

                ctx.fillRect(cellWidth * i, cellHeight * j, cellWidth, cellHeight);
            }
        }
    }

    renderCanvas() {
        if (!this.props.algorithmInfo.cells) return;

        const { cells } = this.props.algorithmInfo;
        const canvas = this.board.current;
        const ctx = canvas.getContext('2d');

        const lineCount = cells.length;
        const cellWidth = canvas.width / lineCount;
        const cellHeight = canvas.height / lineCount;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.fillGrid(ctx, cells, cellWidth, cellHeight);
        this.drawGrid(ctx, cells, canvas.width, canvas.height, cellWidth, cellHeight);
    }

    onStart = () => {
        const { 
            onAlgorithmStart,
            algorithmInfo: { algorithmId } 
        } = this.props;

        onAlgorithmStart(algorithmId, () => {  this.startIntervalUpdating(); });
    }

    onUpdate = () => {
        const { 
            onAlgorithmUpdate,
            algorithmInfo: { algorithmId, isPaused } 
        } = this.props;

        if (!isPaused) {
            onAlgorithmUpdate(algorithmId);
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

        onAlgorithmResume(algorithmId);
    }

    updateTimeout = () => {
        const { 
            onTimeoutUpdate,
            algorithmInfo: { algorithmId } 
        } = this.props;

        onTimeoutUpdate(algorithmId, this.timeoutRange.current.value);
    }

    startIntervalUpdating = () => {
        const { timeout } = this.props.algorithmInfo;

        setTimeout(() => {
            this.onUpdate();
            this.startIntervalUpdating();
        }, timeout || 1000);
    }

    componentDidMount() {
        this.renderCanvas();
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    render = () => (
        <div className='alg-container'>
            <canvas className='alg-container__board' width={400} height={400} ref={this.board} />

            <div className='alg-container__panel'>
                <div className='btn btn-start alg-container__panel__panel-element' onClick={this.onStart}>Start</div>
                {!this.props.algorithmInfo.isPaused 
                    ? <div className='btn btn-pause alg-container__panel__panel-element' onClick={this.onPause}>Pause</div>
                    : <div className='btn btn-resume alg-container__panel__panel-element' onClick={this.onResume}>Resume</div>}

                <input 
                    type='range'
                    min='500'
                    max='5000'
                    className='alg-container__panel__input-timeout alg-container__panel__panel-element'
                    defaultValue={1000}
                    ref={this.timeoutRange}
                    onMouseUp={this.updateTimeout} />
            </div>
        </div>
    );
}

export default AlgorithmView;