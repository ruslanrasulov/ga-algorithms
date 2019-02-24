import React, { Component } from 'react';
import './_styles.scss';

class AlgorithmView extends Component {
    constructor(props) {
        super(props);
        this.board = React.createRef();
    }

    renderCanvas() {
        const ctx = this.board.current.getContext('2d');
        const width = this.board.current.width;
        const height = this.board.current.height;
        const lineCount = 20;
        const cellWidth = this.board.current.width / lineCount;
        const cellHeight = this.board.current.height / lineCount;

        for (let i = 1; i < lineCount; i++) {
            ctx.beginPath();
            ctx.moveTo(cellWidth * i, 0);
            ctx.lineTo(cellWidth * i, width);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, cellHeight * i);
            ctx.lineTo(height, cellHeight* i);
            ctx.stroke();
        }
    }

    componentDidMount() {
        this.renderCanvas();
    }

    render = () => (
        <div className='alg-container'>
            <canvas className='alg-container__board' width={400} height={400} ref={this.board}>

            </canvas>
            <div className='alg-container__panel'>
                <div className='btn btn-start'>Start</div>
            </div>
        </div>
    );
}

export default AlgorithmView;