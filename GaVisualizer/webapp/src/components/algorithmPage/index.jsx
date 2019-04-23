import React, { Component } from 'react';
import { connect } from 'react-redux';

import AlgorithmView from '../algorithmView';
import { getAlgorithms as selectAlgorithms } from '../../selectors/algorithmsSelectors';
import { 
    createNewAlgorithm,
    getCurrentState,
    pauseAlgorithm,
    startAlgorithm,
    resumeAlgorithm,
    updateInterval,
    getAlgorithms,
    removeAlgorithm,
    stopAlgorithm
} from '../../actions/algorithmsActions';

import './_styles.scss';

class AlgorithmPage extends Component {
    constuctor(props) {
        this.super(props);
    }

    componentDidMount = () => {
        this.props.getAlgorithms();
    }

    onAddAlgorithm = () => {
        this.props.createNewAlgorithm();
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

    renderAlgorithms = () => {
        const { algorithms } = this.props;
        const elements = [];

        for (let i = 0; i < algorithms.length; i++) {
            elements.push(<AlgorithmView 
                key={i}
                algorithmInfo={algorithms[i]}
                onAlgorithmStart={this.onAlgorithmStart}
                onAlgorithmPause={this.onAlgorithmPause}
                onAlgorithmUpdate={this.onAlgorithmUpdate}
                onAlgorithmResume={this.onAlgorithmResume}
                onIntervalUpdate={this.onIntervalUpdate}
                onAlgorithmRemove={this.onAlgorithmRemove} 
                onAlgorithmStop={this.onAlgorithmStop} />);
        }

        return elements;
    }

    render = () => (
        <div>
            <div className='btn btn-add' onClick={this.onAddAlgorithm}>Add a new algorithm</div>
            {this.renderAlgorithms()}
        </div>
    );
}

const mapStateToProps = state => ({
    algorithms: selectAlgorithms(state)
});

const mapDispatchToProps = dispatch => ({
    createNewAlgorithm: () => dispatch(createNewAlgorithm()),
    getCurrentState: (id, callback) => dispatch(getCurrentState(id, callback)),
    startAlgorithm: (id, callback) => dispatch(startAlgorithm(id, callback)),
    pauseAlgorithm: id => dispatch(pauseAlgorithm(id)),
    resumeAlgorithm: (id, callback) => dispatch(resumeAlgorithm(id, callback)),
    updateInterval: (id, value) => dispatch(updateInterval(id, value)),
    getAlgorithms: () => dispatch(getAlgorithms()),
    removeAlgorithm: id => dispatch(removeAlgorithm(id)),
    stopAlgorithm: id => dispatch(stopAlgorithm(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmPage);
