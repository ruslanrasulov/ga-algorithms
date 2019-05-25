import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getAlgorithmById, getNewAlgorithm } from '../../selectors/algorithmsSelectors';
import { setNewAlgorithm, setElementInfo } from '../../actions/algorithmsActions';

import './_styles.scss';

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = { currentState: 0 };
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
        const { setNewAlgorithm, generation: { cells } } = this.props;
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

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
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

        //const { generation: { selectedElements } } = this.props;

        for (let i = 0; i < 5; i++) { //TODO: For temproary purpose
            for (let j = 0; j < 5; j++) {
                const { x, y } = this.calculatePosition(i, j, cellWidth, cellHeight);
                this.drawCell(ctx, cells[i][j], x, y, cellWidth, cellHeight);
                // let rectFillStyle;
                // let textFillStyle;

                // const selectedCell = selectedElements && selectedElements.find(c => c === cells[i][j].id);

                // if (selectedCell) {
                //     rectFillStyle = '#ffffff';
                //     textFillStyle = '#000000';
                // }
                // else if (cells[i][j].elementType === 0) { //bacterium
                //     rectFillStyle = '#00ff00';
                //     textFillStyle = '#000000';
                // }
                // else if (cells[i][j].elementType === 1){ //virus
                //     rectFillStyle = '#ff0000';
                //     textFillStyle = '#ffffff';
                // }

                // const x = cellWidth * i;
                // const y = cellHeight * j;

                // ctx.fillStyle = rectFillStyle;
                // ctx.fillRect(x, y, cellWidth, cellHeight);

                // if (!this.props.editMode) {
                //     const age = `Age: ${cells[i][j].age}`;
                //     const productivity = `P: ${cells[i][j].productivity.value.toFixed(3)}`;
                //     const socialValue = `S: ${cells[i][j].socialValue.value.toFixed(3)}`;

                //     const textX = x  + 6;
                //     const textY = y + 15;

                //     ctx.fillStyle = textFillStyle;
                //     ctx.fillText(age, textX, textY);
                //     ctx.fillText(productivity, textX, textY + 15);
                //     ctx.fillText(socialValue, textX, textY + 30);
                // }
            }
        }
    }

    renderCanvas() {
        const canvas = this.board.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!this.props.generation.cells) return;
        
        const { generation: { cells } } = this.props;
        const { cellWidth, cellHeight } = this.getBoardSize();

        this.fillGrid(ctx, cells, cellWidth, cellHeight);
        //this.drawGrid(ctx, cells, canvas.width, canvas.height, cellWidth, cellHeight);
    }

    showTooltip = (e) => {
        if (!this.props.generation.cells) return;
        
        const { generation: { cells }, id, setElementInfo, generationIndex } = this.props;
        const { x, y } = this.getCellPosition(e.layerX, e.layerY);

        this.setState({
            selectedCell: { x, y }
        });

        if (x < cells.length && cells.length > 0 && y < cells[0].length) {
            setElementInfo(id, x, y, generationIndex);
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
        //const { generation: { cells } } = this.props;
        const canvas = this.board.current;

        //const lineCount = cells.length;
        const cellWidth = canvas.width / 6;
        const cellHeight = canvas.height / 6;

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

    fadeElements = () => {
        const canvas = this.board.current;
        const ctx = canvas.getContext('2d');

        if (!this.props.generation.cells) return;
        const { cellWidth, cellHeight } = this.getBoardSize();

        for (let i = 0; i < 5; i++) {
            this.fadeElement(ctx, i, i, cellWidth, cellHeight);
        }
    }

    calculatePosition = (i, j, cellWidth, cellHeight) => {
        let x = 0;
        let y = 0;

        if (i === 0) {
            x = 0;
        }
        else {
            x = i * cellWidth + i * 10;
        }

        if (j === 0) {
            y = 0;
        }
        else {
            y = j * cellHeight + j * 10;
        }

        return { x, y };
    }

    fadeElement(ctx, i, j, cellWidth, cellHeight, step = 0) {
        const { x, y } = this.calculatePosition(i, j, cellWidth, cellHeight);

        ctx.globalAlpha = 1 - step * 0.01;
        ctx.fillStyle = '#000000';
        ctx.clearRect(x - 1, y - 1, cellWidth + 2, cellHeight + 2);

        this.drawCell(ctx, this.props.generation.cells[i][j], x, y, cellWidth, cellHeight);

        if (step === 100) {
            ctx.restore();
            return;
        }

        requestAnimationFrame(() => this.fadeElement(ctx, i, j, cellWidth, cellHeight, step + 1));
    }

    drawCell = (ctx, cell, x, y, cellWidth, cellHeight) => {
        let rectFillStyle;
        let textFillStyle;

        if (cell.elementType === 0) { //bacterium
            rectFillStyle = '#00ff00';
            textFillStyle = '#000000';
        }
        else if (cell.elementType === 1){ //virus
            rectFillStyle = '#ff0000';
            textFillStyle = '#ffffff';
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(x, y, cellWidth, cellHeight);

        ctx.fillStyle = rectFillStyle;
        ctx.fillRect(x, y, cellWidth, cellHeight);

        if (!this.props.editMode) {
            const age = `Age: ${cell.age}`;
            const productivity = `P: ${cell.productivity.value.toFixed(3)}`;
            const socialValue = `S: ${cell.socialValue.value.toFixed(3)}`;

            const textX = x  + 6;
            const textY = y + 15;

            ctx.fillStyle = textFillStyle;
            ctx.fillText(age, textX, textY);
            ctx.fillText(productivity, textX, textY + 15);
            ctx.fillText(socialValue, textX, textY + 30);
        }
    }

    updateState = () => {
        this.setState((prevState) => { 
            switch (prevState.currentState) {
                case 0: {
                    this.renderCanvas();
                    return { currentState: 1 };
                }
                case 1: {
                    this.fadeElements();
                    return { currentState: 2 };
                }
                case 2: {
                    this.crossoverElements();
                    return { currentState: 0 };
                }
            }
        });
    }

    render = () => (
        <div>
            <canvas className='board' width={480} height={480} ref={this.board} />
            <button className="btn" onClick={this.updateState}>Next</button>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    let generation;

    if (ownProps.editMode) {
        generation = { cells: getNewAlgorithm(state).generation.cells };
    }
    else {
        const generations = getAlgorithmById(state, ownProps.id).generations;
        generation = generations[ownProps.generationIndex];
    }

    return { generation };
};

const mapDispatchToProps = dispatch => ({
    setNewAlgorithm: (algorithm) => dispatch(setNewAlgorithm(algorithm)),
    setElementInfo: (id, x, y, generationIndex) => dispatch(setElementInfo(id, x, y, generationIndex))
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);