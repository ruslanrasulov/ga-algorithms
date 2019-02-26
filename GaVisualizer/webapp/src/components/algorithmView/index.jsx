import React, { Component } from 'react';
import './_styles.scss';

class AlgorithmView extends Component {
    constructor(props) {
        super(props);
        this.board = React.createRef();
    }

    renderCanvas() {
        if (!this.props.algorithmInfo.cells) return;

        const { cells } = this.props.algorithmInfo;
        const ctx = this.board.current.getContext('2d');
        const width = this.board.current.width;
        const height = this.board.current.height;
        const lineCount = cells.length;
        const cellWidth = this.board.current.width / lineCount;
        const cellHeight = this.board.current.height / lineCount;

        ctx.strokeStyle = '#000000';

        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[0].length; j++) {

                ctx.beginPath();
                ctx.moveTo(cellWidth * i, 0);
                ctx.lineTo(cellWidth * i, width);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(0, cellHeight * j);
                ctx.lineTo(height, cellHeight * j);
                ctx.stroke();

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

    onStart = () => {
        if (this.props.onAlgorithmStart) {
            this.props.onAlgorithmStart(this.props.algorithmInfo.algorithmId);
        }
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    render = () => (
        <div className='alg-container'>
            <canvas className='alg-container__board' width={400} height={400} ref={this.board}>

            </canvas>
            <div className='alg-container__panel'>
                <div className='btn btn-start' onClick={this.onStart}>Start</div>
            </div>
        </div>
    );
}

export default AlgorithmView;