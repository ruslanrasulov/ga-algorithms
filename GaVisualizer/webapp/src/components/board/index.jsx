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
                if (i === j && this.state.hide) {
                    continue;
                }

                const { x, y } = this.calculatePosition(i, j, cellWidth, cellHeight);
                this.drawCell(ctx, cells[i][j], x, y, cellWidth, cellHeight);
                this.drawCellValues(ctx, cells[i][j], x, y);
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
        ctx.save();
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
        this.drawCellValues(ctx, this.props.generation.cells[i][j], x, y);

        if (step === 100) {
            ctx.globalAlpha = 1;
            return;
        }

        requestAnimationFrame(() => this.fadeElement(ctx, i, j, cellWidth, cellHeight, step + 1));
    }

    drawCellValues = (ctx, cell, x, y, gene = null) => {
        let textFillStyle;

        if (cell.elementType === 0) { //bacterium
            textFillStyle = '#000000';
        }
        else if (cell.elementType === 1){ //virus
            textFillStyle = '#ffffff';
        }

        if (!this.props.editMode) {
            const textX = x  + 6;
            const textY = y + 15;
            
            ctx.fillStyle = textFillStyle;
            
            if (gene === null) {
                const age = `Age: ${cell.age}`;
                ctx.fillText(age, textX, textY);
            }

            if (gene === null || gene === 1) {
                const productivity = `P: ${cell.productivity.value.toFixed(3)}`;
                ctx.fillText(productivity, textX, textY + 15);
            }

            if (gene === null || gene === 2) {
                const socialValue = `S: ${cell.socialValue.value.toFixed(3)}`;
                ctx.fillText(socialValue, textX, textY + 30);
            }
        }
    }

    drawCell = (ctx, cell, x, y, cellWidth, cellHeight) => {
        let rectFillStyle;

        if (cell.elementType === 0) { //bacterium
            rectFillStyle = '#00ff00';
        }
        else if (cell.elementType === 1){ //virus
            rectFillStyle = '#ff0000';
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(x, y, cellWidth, cellHeight);

        ctx.fillStyle = rectFillStyle;
        ctx.fillRect(x, y, cellWidth, cellHeight);
    }

    crossoverElements = () => {
        const canvas = this.board.current;
        const ctx = canvas.getContext('2d');

        if (!this.props.generation.cells) return;
        const { cellWidth, cellHeight } = this.getBoardSize();

        const elements = [];

        elements.push({dest: { i: 0, j: 0}, firstParent: { i: 1, j: 2 }, secondParent: { i: 1, j: 0 }});
        elements.push({dest: { i: 1, j: 1}, firstParent: { i: 2, j: 3 }, secondParent: { i: 2, j: 1 }});
        elements.push({dest: { i: 2, j: 2}, firstParent: { i: 3, j: 2 }, secondParent: { i: 1, j: 2 }});
        elements.push({dest: { i: 3, j: 3}, firstParent: { i: 4, j: 2 }, secondParent: { i: 1, j: 3 }});
        elements.push({dest: { i: 4, j: 4}, firstParent: { i: 4, j: 1 }, secondParent: { i: 1, j: 4 }});

        ctx.save();
        this.crossoverElement(ctx, elements, cellWidth, cellHeight, 1);
    }

    iniitalizePositionsIfRequired = (cell, cellWidth, cellHeight) => {
        if (cell.x === undefined || cell.y === undefined) {
            const { x, y } = this.calculatePosition(cell.i, cell.j, cellWidth, cellHeight);
            cell.x = x;
            cell.y = y;
        }
    }

    setupNextPosition = (cell, dest, step) => {
        const { x, y } = this.calculateNextPosition(cell.x, cell.y, dest.x, dest.y, step);
        cell.x = x;
        cell.y = y;
    }

    drawParent = (ctx, cell, cellWidth, cellHeight, gene) => {
        this.drawCell(ctx, this.props.generation.cells[cell.i][cell.j], cell.x, cell.y, cellWidth, cellHeight);
        this.drawCellValues(ctx, this.props.generation.cells[cell.i][cell.j], cell.x, cell.y, gene);
    }

    crossoverElement = (ctx, elements, cellWidth, cellHeight) => {
        const step = 1;
        let breakCrossover = true;

        this.renderCanvas();

        for (let i = 0; i < elements.length; i++) {
            const { dest, firstParent, secondParent } = elements[i];

            this.iniitalizePositionsIfRequired(dest, cellWidth, cellHeight);
            this.iniitalizePositionsIfRequired(firstParent, cellWidth, cellHeight);
            this.iniitalizePositionsIfRequired(secondParent, cellWidth, cellHeight);

            this.setupNextPosition(firstParent, dest, step);
            this.setupNextPosition(secondParent, dest, step);

            this.drawParent(ctx, firstParent, cellWidth, cellHeight, 1);
            this.drawParent(ctx, secondParent, cellWidth, cellHeight, 2);

            if (firstParent.x !== dest.x || firstParent.y !== dest.y || secondParent.x !== dest.x || secondParent.y !== dest.y) {
                breakCrossover = false;
            }
        }

        if (breakCrossover) {
            return;
        }

        requestAnimationFrame(() => this.crossoverElement(ctx, elements, cellWidth, cellHeight));
    }

    calculateNextPosition = (x1, y1, x2, y2, step) => {
        let x;
        let y;

        if (x1 < x2) {
            x = x1 + step;
        }
        else if (x1 > x2) {
            x = x1 - step;
        }
        else {
            x = x1;
        }

        if (y1 < y2) {
            y = y1 + step;
        }
        else if (y1 > y2) {
            y = y1 - step;
        }
        else {
            y = y1;
        }

        return { x, y };
    }

    updateState = () => {
        this.setState((prevState) => { 
            switch (prevState.currentState) {
                case 0: {
                    this.renderCanvas();
                    return { currentState: 1, hide: false };
                }
                case 1: {
                    this.fadeElements();
                    return { currentState: 2 };
                }
                case 2: {
                    this.crossoverElements();
                    return { currentState: 3, hide: true };
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