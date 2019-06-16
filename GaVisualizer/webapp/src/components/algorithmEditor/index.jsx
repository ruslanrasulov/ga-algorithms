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
        const content = JSON.stringify(this.props.algorithm, null, 2);
        this.saveFile(content);
    }

    onRadioBtnChange = e => {
        const a = {};
        a[e.target.name] = e.target.value;

        this.props.setNewAlgorithm(a);
    }

    renderTitle() {
        return (
            <div className='algorithm-editor__title'>
                Добавить новый алгоритм
                <i className='algorithm-editor__btn-help fa fa-question-circle'></i>
                <div className="algorithm-editor__help-info">
                    <span className="text-bold">Селекция</span> – выбор хромосом, которые будут участвовать в последующем скрещивании. У хромосом с большим значением приспособленности больший шанс быть отобранной. Различают следующие виды селекции
                    <ul className="algorithm-editor__help-info__list">
                        <li>
                            <span className="text-bold">Турнирная селекция.</span> Хромосомы делятся на подгруппы, затем в подгруппах определяются наиболее приспособленные. Подгруппы обычно имеют размер 3-4 особи, но также могут иметь произвольный размер.
                        </li>
                        <li>
                            <span className="text-bold">Отбор усечением.</span> Хромосомы сортируются по значению фитнес-функции и затем отбираются.
                        </li>
                        <li>
                            <span className="text-bold">Пропорциональный отбор.</span> Вычисляется не только фитнес-функция для каждой хромосомы, но и среднее значение для всей популяции. Затем высчитывается отношение между значенем фитнес-функции хромосомы и средним значением по популяции. Если это значение больше 1, то особь допускается к скрещиванию.
                        </li>
                    </ul>
                    <span className="text-bold">Скрещивание.</span> Происходит скрещивание между особями. Гены для новой хромосомы выбираются на основе двух выбранных родительских хромосом. Различают следующие виды скрещивания:
                    <ul className='algorithm-editor__help-info__list'>
                        <li>
                            <span className="text-bold">Точечное скрещивание.</span> Выбирается некоторое число N таким образом, что для новой хромосомы наследуются первые N генов первого родителя и остальные гены второго родителя.
                        </li>
                        <li>
                            <span className="text-bold">Двухточечное скрещивание.</span> Отличается от точечного скрещивание тем, что вместо одного числа N выбираются два числа N1 и N2, которые разбивают набор генов на три части.
                        </li>
                        <li>
                            <span className="text-bold">Многоточечное скрещивание.</span> Выбираются несколько чисел N1,…Nm, которые разбивают хромосому на m+1 частей.
                        </li>
                        <li>
                            <span className="text-bold">Равномерное скрещивание.</span> Этот тип скрещивания подразумевает, что заранее известно, какой ген у какого родителя будет унаследован.
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    render() {
        const { onClick, onClose, setNewAlgorithm } = this.props;

        return (
            <div className='algorithm-editor'>
                <Modal title={this.renderTitle()} onClick={onClick} onClose={onClose}>
                <div className='algorithm-editor'>
                    <div className='algorithm-editor__board'>
                        <Board editMode={true} currentState={0} />
                    </div>
                    
                    <div className='algorithm-editor__panel'>
                        <div className='btn algorithm-editor__panel__btn'>
                            <InputFile label='Импорт настроек' onUpload={algorithm => setNewAlgorithm(algorithm)} />
                        </div>
                        <button type='button' className='btn algorithm-editor__panel__btn' onClick={this.saveBoard}>Экспорт настроек</button>

                        <div className='algorithm-editor__radio-btn-group'>
                            <div>Тип селекции:</div>

                            {/* Export to a new component */}
                            <div><input type='radio' name='selectionType' value='0' onChange={this.onRadioBtnChange} checked={this.props.algorithm.selectionType === undefined || this.props.algorithm.selectionType === '0'}/> Турнирная сетка</div>
                            <div><input type='radio' name='selectionType' value='1' onChange={this.onRadioBtnChange} checked={this.props.algorithm.selectionType === '1'}/> Отбор усечением</div>
                            <div><input type='radio' name='selectionType' value='2' onChange={this.onRadioBtnChange} checked={this.props.algorithm.selectionType === '2'}/> Пропорциональный отбор</div>
                        </div>

                        <div className='algorithm-editor__radio-btn-group'>
                            <div>Тип скрещивания:</div>

                            <div><input type='radio' name='crossoverType' value='0' onChange={this.onRadioBtnChange} checked={this.props.algorithm.crossoverType === undefined || this.props.algorithm.crossoverType === '0'}/> Точечное</div>
                            <div><input type='radio' name='crossoverType' value='1' onChange={this.onRadioBtnChange} checked={this.props.algorithm.crossoverType === '1'}/> Двухточечное</div>
                            <div><input type='radio' name='crossoverType' value='2' onChange={this.onRadioBtnChange} checked={this.props.algorithm.crossoverType === '2'}/> Многоточечное</div>
                            <div><input type='radio' name='crossoverType' value='3' onChange={this.onRadioBtnChange} checked={this.props.algorithm.crossoverType === '3'}/> Равномерное</div>
                            {/* <div><input type='radio' name='crossoverType' value='4' onChange={this.onRadioBtnChange} checked={this.props.algorithm.crossoverType === '4'}/> Оператор инверсии</div> */}
                        </div>
                    </div>
                </div>
            </Modal>
            </div>
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
    return { algorithm: getNewAlgorithm(state) }
};

const mapDispatchToProps = dispatch => ({
    setNewAlgorithm: (algorithm) => dispatch(setNewAlgorithm(algorithm))
});

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmEdtor);