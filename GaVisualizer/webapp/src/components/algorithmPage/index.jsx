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
    updateTimeout,
    getAlgorithms
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

    onAlgorithmUpdate = id => {
        this.props.getCurrentState(id);
    }

    onAlgorithmPause = id => {
        this.props.pauseAlgorithm(id);
    }

    onAlgorithmResume = id => {
        this.props.resumeAlgorithm(id);
    }

    onTimeoutUpdate = (id, value, callback) => {
        this.props.updateTimeout(id, value, callback);
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
                onTimeoutUpdate={this.onTimeoutUpdate} />);
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
    getCurrentState: id => dispatch(getCurrentState(id)),
    startAlgorithm: (id, callback) => dispatch(startAlgorithm(id, callback)),
    pauseAlgorithm: id => dispatch(pauseAlgorithm(id)),
    resumeAlgorithm: id => dispatch(resumeAlgorithm(id)),
    updateTimeout: (id, value) => dispatch(updateTimeout(id, value)),
    getAlgorithms: () => dispatch(getAlgorithms())
});

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmPage);
