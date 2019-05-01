import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAlgorithmById, getNewAlgorithm } from '../../selectors/algorithmsSelectors';
import { setNewAlgorithm } from '../../actions/algorithmsActions';

import './_styles.scss';

class Board extends Component {
    constructor(props) {
        super(props);

        this.board = React.createRef();
    }

    componentDidMount() {
        this.renderCanvas();
        if (this.props.editMode) {
            this.props.setNewAlgorithm({ cells: this.getInitialCells(20, 20) });
            this.board.current.addEventListener('click', this.setupBoard);
        }
        else {
            this.board.current.addEventListener('mousemove', this.showTooltip);
        }
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    setupBoard = (e) => {
        const { x, y } = this.getCellPosition(e.layerX, e.layerY);
        const newCells = this.props.cells.map(c => c.slice());

        if (newCells[x][y].elementType === 0) {
            newCells[x][y].elementType = 1;
        }
        else {
            newCells[x][y].elementType = 0;
        }

        this.props.setNewAlgorithm({ cells: newCells });
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
        ctx.font = "15px Impact";

        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[0].length; j++) {
                let rectFillStyle;
                let textFillStyle;

                if (cells[i][j].elementType === 0) { //bacterium
                    rectFillStyle = '#00ff00';
                    textFillStyle = '#000000';
                }
                else if (cells[i][j].elementType === 1){ //virus
                    rectFillStyle = '#ff0000';
                    textFillStyle = '#ffffff';
                }

                const x = cellWidth * i;
                const y = cellHeight * j;

                ctx.fillStyle = rectFillStyle;
                ctx.fillRect(x, y, cellWidth, cellHeight);

                if (!this.props.editMode) {
                    const age = cells[i][j].age || 0;
                    const textX = x  + 6;
                    const textY = y + 15;

                    ctx.fillStyle = textFillStyle;
                    ctx.fillText(age, textX, textY);
                }
            }
        }
    }

    renderCanvas() {
        const canvas = this.board.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!this.props.cells) return;
        
        const { cells } = this.props;

        const lineCount = cells.length;
        const cellWidth = canvas.width / lineCount;
        const cellHeight = canvas.height / lineCount;

        this.fillGrid(ctx, cells, cellWidth, cellHeight);
        this.drawGrid(ctx, cells, canvas.width, canvas.height, cellWidth, cellHeight);
    }

    showTooltip = (e) => {
        if (!this.props.cells) return;
        
        const { cells } = this.props;
        const { x, y } = this.getCellPosition(e.layerX, e.layerY);

        if (x < cells.length && y < cells[0].length) {
            console.log(cells[x][y]);
        }
    }

    getCellPosition = (layerX, layerY) => {
        const { cells } = this.props;
        const canvas = this.board.current;
        
        const lineCount = cells.length;
        const cellWidth = canvas.width / lineCount;
        const cellHeight = canvas.height / lineCount;

        return {
            x: Math.floor(layerX / cellWidth),
            y: Math.floor(layerY / cellHeight)
        };
    }

    getInitialCells(x, y) {
        const cells = [];
    
        for (let i = 0; i < x; i++) {
            cells.push([]);
    
            for (let j = 0; j < y; j++) {
                cells[i].push({ elementType: 0 });
            }
        }

        return cells;
    }

    render = () => (
        <canvas className='board' width={400} height={400} ref={this.board} />
    )
}

const mapStateToProps = (state, ownProps) => {
    const cells = ownProps.editMode
        ? getNewAlgorithm(state).cells
        : getAlgorithmById(state, ownProps.algorithmId).cells;

    return { cells: cells }
};

const mapDispatchToProps = dispatch => ({
    setNewAlgorithm: (algorithmInfo) => dispatch(setNewAlgorithm(algorithmInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);