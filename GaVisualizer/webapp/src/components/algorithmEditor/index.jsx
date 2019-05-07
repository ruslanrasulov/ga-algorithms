import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setNewAlgorithm } from '../../actions/algorithmsActions';
import { getNewAlgorithm } from '../../selectors/algorithmsSelectors';

import Modal from '../modal';
import Board from '../board';

import './_styles.scss';

class AlgorithmEdtor extends Component {
    saveFile(data) {
        const blob = new Blob([data], { type: 'application/json' });
        const filename = 'board.json';

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            const link = window.document.createElement('a');

            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    saveBoard = () => {
        const content = JSON.stringify(this.props.algorithmInfo, null, 2);
        this.saveFile(content);
    }

    onRadioBtnChange = e => {
        const a = {};
        a[e.target.name] = e.target.value;
        console.log(this.props.algorithmInfo.selectionType);
        this.props.setNewAlgorithm(a);
    }

    render() {
        const { onClick, onClose, setNewAlgorithm } = this.props;

        return (
            <Modal title='Добавить новый алгоритм' onClick={onClick} onClose={onClose}>
                <div className='algorithm-editor'>
                    <div className='algorithm-editor__board'>
                        <Board editMode={true} />
                    </div>
                    
                    <div className='algorithm-editor__panel'>
                        <div className='btn algorithm-editor__panel__btn'>
                            <InputFile label='Импорт настроек' onUpload={algorithmInfo => setNewAlgorithm(algorithmInfo)} />
                        </div>
                        <button type='button' className='btn algorithm-editor__panel__btn' onClick={this.saveBoard}>Экспорт настроек</button>

                        <div className='algorithm-editor__radio-btn-group'>
                            <div>Тип селекции:</div>

                            {/* Export to a new component */}
                            <div><input type='radio' name='selectionType' value='0' onChange={this.onRadioBtnChange} checked={this.props.algorithmInfo.selectionType === undefined || this.props.algorithmInfo.selectionType === '0'}/> Турнирная сетка</div>
                            <div><input type='radio' name='selectionType' value='1' onChange={this.onRadioBtnChange} checked={this.props.algorithmInfo.selectionType === '1'}/> Отбор усечением</div>
                            <div><input type='radio' name='selectionType' value='2' onChange={this.onRadioBtnChange} checked={this.props.algorithmInfo.selectionType === '2'}/> Пропорциональный отбор</div>
                        </div>

                        <div className='algorithm-editor__radio-btn-group'>
                            <div>Тип скрещивания:</div>

                            <div><input type='radio' name='crossoverType' value='0' onChange={this.onRadioBtnChange} checked={this.props.algorithmInfo.crossoverType === undefined || this.props.algorithmInfo.crossoverType === '0'}/> Точечное</div>
                            <div><input type='radio' name='crossoverType' value='1' onChange={this.onRadioBtnChange} checked={this.props.algorithmInfo.crossoverType === '1'}/> Двухточечное</div>
                            <div><input type='radio' name='crossoverType' value='2' onChange={this.onRadioBtnChange} checked={this.props.algorithmInfo.crossoverType === '2'}/> Многоточечное</div>
                            <div><input type='radio' name='crossoverType' value='3' onChange={this.onRadioBtnChange} checked={this.props.algorithmInfo.crossoverType === '3'}/> Равномерное</div>
                            <div><input type='radio' name='crossoverType' value='4' onChange={this.onRadioBtnChange} checked={this.props.algorithmInfo.crossoverType === '4'}/> Оператор инверсии</div>
                        </div>
                    </div>
                </div>
            </Modal>
        );  
    }
}

//TODO: move to separate file
class InputFile extends Component {
    constructor(props) {
        super(props);

        this.fileReader = new FileReader();
        this.inputFile = React.createRef();
    }

    onLoadEnd = () => {
        const content = this.fileReader.result;
        this.props.onUpload(JSON.parse(content));
    }

    handleFile(file) {
        this.fileReader.onloadend = this.onLoadEnd;
        this.fileReader.readAsText(file);
    }

    onChange = e => {
        this.handleFile(e.target.files[0]);
        e.target.value = '';
    }

    render = () => (
            <div>
                <button type='button' className='input-file__btn' onClick={() => this.inputFile.current.click()}>{this.props.label}</button>
                <input
                    className='input-file'
                    type='file'
                    accept='.json'
                    onChange={this.onChange}
                    ref={this.inputFile}
                />
            </div>
    );
}

const mapStateToProps = state => {
    return { algorithmInfo: getNewAlgorithm(state) }
};

const mapDispatchToProps = dispatch => ({
    setNewAlgorithm: (algorithmInfo) => dispatch(setNewAlgorithm(algorithmInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmEdtor);