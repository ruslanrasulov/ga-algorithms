import React, { Component } from 'react';
import { connect } from 'react-redux';

import AlgorithmView from '../algorithmView';
import AlgorithmEditor from '../algorithmEditor';
import HelpWindow from '../helpWindow';

import { getAlgorithms as selectAlgorithms, getNewAlgorithm } from '../../selectors/algorithmsSelectors';
import { 
    createNewAlgorithm,
    getCurrentState,
    pauseAlgorithm,
    startAlgorithm,
    resumeAlgorithm,
    updateInterval,
    getAlgorithms,
    removeAlgorithm,
    stopAlgorithm,
    setGenerations,
    setCrossoverElement
} from '../../actions/algorithmsActions';

import './_styles.scss';

class AlgorithmPage extends Component {
    constuctor(props) {
        this.super(props);
    }

    state = {}

    componentDidMount = () => {
        this.props.getAlgorithms();
    }

    onAddAlgorithm = () => {
        this.setState({ showModal: false });
        this.props.createNewAlgorithm(this.props.newAlgorithm);
    }

    onAlgorithmStart = (id, callback) => {
        this.props.startAlgorithm(id, callback);
    }

    onAlgorithmUpdate = (id, callback) => {
        this.props.getCurrentState(id, callback);
    }

    onAlgorithmPause = id => {
        this.props.pauseAlgorithm(id);
    }

    onAlgorithmResume = (id, callback) => {
        this.props.resumeAlgorithm(id, callback);
    }

    onAlgorithmRemove = id => {
        this.props.removeAlgorithm(id);
    }

    onAlgorithmStop = id => {
        this.props.stopAlgorithm(id);
    }

    onIntervalUpdate = (id, value, callback) => {
        this.props.updateInterval(id, value, callback);
    }

    onSetGenerations = ({ id, leftGenerationIndex, rightGenerationIndex }) => {
        this.props.setGenerations(id, leftGenerationIndex, rightGenerationIndex);
    }

    onNext = (id, useAnimation) => {
        const algorithm = this.props.algorithms.find(a => a.id === id);

        if (useAnimation && algorithm.currentState === 4 && algorithm.currentCrossoverElement !== undefined && algorithm.currentCrossoverElement < algorithm.metaData.newElements.length - 1) {
            this.props.setCrossoverElement(id, algorithm.currentCrossoverElement + 1);
        }
        else {
            this.props.getCurrentState(id, useAnimation);
        }
    }

    renderAlgorithms = () => {
        const { algorithms } = this.props;
        const elements = [];

        for (let i = 0; i < algorithms.length; i++) {
            elements.push(<AlgorithmView 
                key={i}
                algorithm={algorithms[i]}
                onAlgorithmStart={this.onAlgorithmStart}
                onAlgorithmPause={this.onAlgorithmPause}
                onAlgorithmUpdate={this.onAlgorithmUpdate}
                onAlgorithmResume={this.onAlgorithmResume}
                onIntervalUpdate={this.onIntervalUpdate}
                onAlgorithmRemove={this.onAlgorithmRemove}
                onAlgorithmStop={this.onAlgorithmStop}
                onSetGenerations={this.onSetGenerations}
                onNext={this.onNext} />);
        }

        return elements;
    }

    showHelp = () => {
        this.setState({ showHelp: true });
    }

    closeHelp = () => {
        this.setState({ showHelp: false });
    }

    showModal = () => {
        this.setState({ showModal: true });
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    render = () => (
        <div>
            <div className='btn-help fa fa-question-circle' onClick={this.showHelp}></div>
            <div className='btn btn-success btn-add-algorithm' onClick={this.showModal}>Добавить новый алгоритм</div>
            {this.renderAlgorithms()}
            {this.state.showModal
                ? <AlgorithmEditor onClick={this.onAddAlgorithm} onClose={this.closeModal}/>
                : null
            }
            {this.state.showHelp
                ? <HelpWindow onClose={this.closeHelp} />
                : null
            }
        </div>
    );
}

const mapStateToProps = state => ({
    algorithms: selectAlgorithms(state),
    newAlgorithm: getNewAlgorithm(state)
});

const mapDispatchToProps = dispatch => ({
    createNewAlgorithm: (newAlgorithm) => dispatch(createNewAlgorithm(newAlgorithm)),
    getCurrentState: (id, useAnimation, callback) => dispatch(getCurrentState(id, useAnimation, callback)),
    startAlgorithm: (id, callback) => dispatch(startAlgorithm(id, callback)),
    pauseAlgorithm: id => dispatch(pauseAlgorithm(id)),
    resumeAlgorithm: (id, callback) => dispatch(resumeAlgorithm(id, callback)),
    updateInterval: (id, value) => dispatch(updateInterval(id, value)),
    getAlgorithms: () => dispatch(getAlgorithms()),
    removeAlgorithm: id => dispatch(removeAlgorithm(id)),
    stopAlgorithm: id => dispatch(stopAlgorithm(id)),
    setGenerations: (id, leftGenerationIndex, rightGenerationIndex) => dispatch(setGenerations(id, leftGenerationIndex, rightGenerationIndex)),
    setCrossoverElement: (id, currentCrossoverElement) => dispatch(setCrossoverElement(id, currentCrossoverElement))
});

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmPage);
