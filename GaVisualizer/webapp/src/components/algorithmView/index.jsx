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
        const boardWidth = this.board.current.width;
        const boardHeight = this.board.current.height;
        const cellWidth = this.board.current.width / lineCount;
        const cellHeight = this.board.current.height / lineCount;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.fillGrid(ctx, cells, cellWidth, cellHeight);
        this.drawGrid(ctx, cells, boardWidth, boardHeight, cellWidth, cellHeight);
    }

    onStart = () => {
        this.props.onAlgorithmStart(this.props.algorithmInfo.algorithmId, () => { 
            this.startIntervalUpdating();
        });
    }

    onUpdate = () => {
        if (!this.props.algorithmInfo.isPaused) {
            this.props.onAlgorithmUpdate(this.props.algorithmInfo.algorithmId);
        }
    }

    onPause = () => {
        this.props.onAlgorithmPause(this.props.algorithmInfo.algorithmId);
    }

    onResume = () => {
        this.props.onAlgorithmResume(this.props.algorithmInfo.algorithmId);
    }

    updateTimeout = () => {
        this.props.onTimeoutUpdate(this.props.algorithmInfo.algorithmId, this.timeoutRange.current.value);
    }

    startIntervalUpdating = () => {
        setTimeout(() => {
            this.onUpdate();
            this.startIntervalUpdating();
        }, this.props.algorithmInfo.timeout || 1000);
    }

    componentDidMount() {
        this.renderCanvas();
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    render = () => (
        <div className='alg-container'>
            <canvas className='alg-container__board' width={400} height={400} ref={this.board}>

            </canvas>
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