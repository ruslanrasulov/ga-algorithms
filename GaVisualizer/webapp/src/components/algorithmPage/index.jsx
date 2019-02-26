import React, { Component } from 'react';
import { connect } from 'react-redux';
import AlgorithmView from '../algorithmView';
import { getAlgorithms } from '../../selectors/algorithmsSelectors';
import { createNewAlgorithm, getCurrentState } from '../../actions/algorithmsActions';
import './_styles.scss';

class AlgorithmPage extends Component {
    constuctor(props) {
        this.super(props);
    }

    onAddAlgorithm = () => {
        this.props.createNewAlgorithm();
    }

    onAlgorithmStart = id => {
        this.props.getCurrentState(id);
    }

    renderAlgorithms = () => {
        const { algorithms } = this.props;
        const elements = [];

        for (let i = 0; i < algorithms.length; i++) {
            elements.push(<AlgorithmView key={i} algorithmInfo={algorithms[i]} onAlgorithmStart={this.onAlgorithmStart} />);
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
    algorithms: getAlgorithms(state)
});

const mapDispatchToProps = dispatch => ({
    createNewAlgorithm: () => dispatch(createNewAlgorithm()),
    getCurrentState: (id) => dispatch(getCurrentState(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmPage);
