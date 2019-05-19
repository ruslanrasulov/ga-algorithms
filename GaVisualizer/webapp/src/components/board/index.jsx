import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getAlgorithmById, getNewAlgorithm } from '../../selectors/algorithmsSelectors';
import { setNewAlgorithm, setElementInfo } from '../../actions/algorithmsActions';

import './_styles.scss';

class Board extends Component {
    constructor(props) {
        super(props);

        this.board = React.createRef();
    }

    componentDidMount() {
        const { editMode, setNewAlgorithm } = this.props;
        const canvas = this.board.current;

        this.renderCanvas();

        if (editMode) {
            const algorithm = { generation: { cells: this.getInitialCells(20, 20) } };
            setNewAlgorithm(algorithm);

            canvas.addEventListener('click', this.setupBoard);
        }
        else {
            canvas.addEventListener('dblclick', this.showTooltip);
        }
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    setupBoard = (e) => {
        const { setNewAlgorithm, cells } = this.props;
        const { x, y } = this.getCellPosition(e.layerX, e.layerY);
        const newCells = cells.map(c => c.slice());

        if (newCells[x][y].elementType === 0) {
            newCells[x][y].elementType = 1;
        }
        else {
            newCells[x][y].elementType = 0;
        }

        setNewAlgorithm({ generation: { cells:  newCells } });
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
        const { cellWidth, cellHeight } = this.getBoardSize();

        this.fillGrid(ctx, cells, cellWidth, cellHeight);
        this.drawGrid(ctx, cells, canvas.width, canvas.height, cellWidth, cellHeight);
    }

    showTooltip = (e) => {
        if (!this.props.cells) return;
        
        const { cells, id, setElementInfo } = this.props;
        const { x, y } = this.getCellPosition(e.layerX, e.layerY);

        if (x < cells.length && cells.length > 0 && y < cells[0].length) {
            const currentElement = cells[x][y];
            setElementInfo(id, { x, y, ...currentElement });
        }
    }

    getCellPosition = (layerX, layerY) => {
        const { cellWidth, cellHeight } = this.getBoardSize();

        return {
            x: Math.floor(layerX / cellWidth),
            y: Math.floor(layerY / cellHeight)
        };
    }

    getBoardSize = () => {
        const { cells } = this.props;
        const canvas = this.board.current;

        const lineCount = cells.length;
        const cellWidth = canvas.width / lineCount;
        const cellHeight = canvas.height / lineCount;

        return { cellWidth, cellHeight };
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
    let cells;

    if (ownProps.editMode) {
        cells = getNewAlgorithm(state).generation.cells;
    }
    else {
        const generations = getAlgorithmById(state, ownProps.id).generations;
        cells = generations[ownProps.generationIndex].cells;
    }

    return { cells }
};

const mapDispatchToProps = dispatch => ({
    setNewAlgorithm: (algorithm) => dispatch(setNewAlgorithm(algorithm)),
    setElementInfo: (id, elementInfo) => dispatch(setElementInfo(id, elementInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);