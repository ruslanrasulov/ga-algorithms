import React, { Component } from 'react';
import { connect } from 'react-redux';
import { flatten } from 'lodash';

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
            const algorithm = { generations: [{ cells: this.getInitialCells(5, 5) }] };
            setNewAlgorithm(algorithm);

            canvas.addEventListener('click', this.setupBoard);
        }
        else {
            canvas.addEventListener('dblclick', this.showTooltip);
        }
    }

    componentDidUpdate() {
        switch (this.props.algorithm.currentState) {
            case 2: {
                this.fadeElements();
            } break;
            case 3: {
                this.crossoverElements();
            } break;
            case 4: {
                this.mutateElements();
            } break;
            default: {
                this.renderCanvas();
            } break;
        }
    }

    setupBoard = (e) => {
        const { setNewAlgorithm, algorithm } = this.props;
        const { x, y } = this.getCellPosition(e.layerX, e.layerY);
        const cells = algorithm.generations[algorithm.generations.length - 1].cells;

        const newCells = cells.map(c => c.slice());

        if (newCells[x][y].elementType === 0) {
            newCells[x][y].elementType = 1;
        }
        else {
            newCells[x][y].elementType = 0;
        }

        setNewAlgorithm({ generation: { cells:  newCells } });
    }

    // drawGrid(ctx, cells, boardWidth, boardHeight, cellWidth, cellHeight) {
    //     ctx.strokeStyle = '#000000';

    //     for (let i = 0; i < 6; i++) {
    //         for (let j = 0; j < 6; j++) {
    //             ctx.beginPath();
    //             ctx.moveTo(cellWidth * i, 0);
    //             ctx.lineTo(cellWidth * i, boardWidth);
    //             ctx.stroke();

    //             ctx.beginPath();
    //             ctx.moveTo(0, cellHeight * j);
    //             ctx.lineTo(boardHeight, cellHeight * j);
    //             ctx.stroke();
    //         }
    //     }
    // }

    fillGrid(ctx, cells, cellWidth, cellHeight) {
        ctx.font = "15px Impact";

        //const { generation: { selectedElements } } = this.props;
        const { metaData, currentCrossoverElement } = this.props.algorithm;
        const newElements = metaData && metaData.newElements;
        ctx.save();
        for (let i = 0; i < cells.length; i++) { //TODO: For temproary purpose
            for (let j = 0; j < cells[0].length; j++) {
                if (cells[i][j] === null) {
                    continue;
                }

                if (!this.props.editMode && newElements && currentCrossoverElement !== undefined && newElements.slice(currentCrossoverElement).some(e => e.x === i && e.y === j)) {
                    continue;
                }

                ctx.globalAlpha = 0.5 + cells[i][j].fitnessValue * 0.08;

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

        ctx.restore();
    }

    renderCanvas() {
        const canvas = this.board.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const { algorithm: { generations } } = this.props;
        const cells = generations[generations.length - 1].cells;
        if (!cells) return;
        
        const { cellWidth, cellHeight } = this.getBoardSize();

        this.fillGrid(ctx, cells, cellWidth, cellHeight);
        //this.drawGrid(ctx, cells, canvas.width, canvas.height, cellWidth, cellHeight);
    }

    showTooltip = (e) => {
        const { algorithm: { generations }, id, setElementInfo, generationIndex } = this.props;
        const cells = generations[generations.length - 1].cells;

        if (!cells) return;
        
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
            x: Math.floor(layerX / (cellWidth - 20)),
            y: Math.floor(layerY / cellHeight)
        };
    }

    getBoardSize = () => {
        const { algorithm: { generations }} = this.props;
        const cells = generations[generations.length - 1].cells;
        const canvas = this.board.current;
        const marginSize = 10;

        const lineCount = cells.length;
        const cellWidth = canvas.width / lineCount - marginSize * 2;
        const cellHeight = canvas.height / lineCount - marginSize * 2;

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

        const { algorithm: { generations, metaData: { selectedElements } } } = this.props;
        const cells = generations[generations.length - 1].cells;

        if (!cells) return;

        const { cellWidth, cellHeight } = this.getBoardSize();
        
        ctx.save();

        for (let i = 0; i < selectedElements.length; i++) {
            const x = selectedElements[i].item1;
            const y = selectedElements[i].item2;
            const cell = selectedElements[i].item3;

            this.fadeElement(ctx, x, y, cell, cellWidth, cellHeight);
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

    fadeElement(ctx, i, j, cell, cellWidth, cellHeight, step = 0) {
        const { x, y } = this.calculatePosition(i, j, cellWidth, cellHeight);

        const currentAlpha = 0.5 + cell.fitnessValue * 0.08 - step * 0.01;
        ctx.globalAlpha = currentAlpha < 0 ? 0 : currentAlpha;
        ctx.fillStyle = '#000000';
        ctx.clearRect(x - 1, y - 1, cellWidth + 2, cellHeight + 2);

        this.drawCell(ctx, cell, x, y, cellWidth, cellHeight);
        this.drawCellValues(ctx, cell, x, y);

        if (step === 100) {
            ctx.globalAlpha = 1;
            return;
        }

        requestAnimationFrame(() => this.fadeElement(ctx, i, j, cell, cellWidth, cellHeight, step + 1));
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

            if (gene === null || gene === 2) {
                const productivity = `P: ${cell.productivity.value.toFixed(3)}`;
                ctx.fillText(productivity, textX, textY + 15);
            }

            if (gene === null || gene === 1) {
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

        const { algorithm } = this.props;
        const { generations, metaData: { newElements } } = algorithm;
        const cells = generations[generations.length - 1].cells;

        if (!cells) return;

        const { cellWidth, cellHeight } = this.getBoardSize();

        const newElement = newElements[algorithm.currentCrossoverElement];
        const flattenCells = flatten(cells);

        const firstParent = flattenCells.find(c => c.id === newElement.firstParentId);
        const secondParent = flattenCells.find(c => c.id === newElement.secondParentId)

        const elements = [];
        elements.push({dest: { i: newElement.x, j: newElement.y}, firstParent: { i: firstParent.x, j: firstParent.y }, secondParent: { i: secondParent.x, j: secondParent.y }});

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
        const { algorithm: { generations } } = this.props;
        const cells = generations[generations.length - 1].cells;

        this.drawCell(ctx, cells[cell.i][cell.j], cell.x, cell.y, cellWidth, cellHeight);
        this.drawCellValues(ctx, cells[cell.i][cell.j], cell.x, cell.y, gene);
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

    render = () => (
        <div>
            <canvas className='board' width={480} height={480} ref={this.board} />
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    let algorithm;

    if (ownProps.editMode) {
        algorithm = getNewAlgorithm(state);
    }
    else {
        algorithm = getAlgorithmById(state, ownProps.id);
    }

    return { algorithm };
};

const mapDispatchToProps = dispatch => ({
    setNewAlgorithm: (algorithm) => dispatch(setNewAlgorithm(algorithm)),
    setElementInfo: (id, x, y, generationIndex) => dispatch(setElementInfo(id, x, y, generationIndex))
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);