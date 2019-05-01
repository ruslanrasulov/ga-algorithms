import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setNewAlgorithm } from '../../actions/algorithmsActions';
import { getNewAlgorithm } from '../../selectors/algorithmsSelectors';

import Modal from '../modal';
import Board from '../board';

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

    render() {
        const { onClick, onClose, setNewAlgorithm } = this.props;

        return (
            <Modal title='Add a new algorithm' onClick={onClick} onClose={onClose}>
                <Board editMode={true} />
                
                <InputFile label='Upload board' onUpload={algorithmInfo => setNewAlgorithm(algorithmInfo)} />
                <button type='button' onClick={this.saveBoard}>Download board</button>
            </Modal>
        );  
    }
}

class InputFile extends Component {
    fileReader = new FileReader();

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
                <label>{this.props.label}</label>
                <input 
                    type='file'
                    accept='.json'
                    onChange={this.onChange}
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