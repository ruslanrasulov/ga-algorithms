import React, { Component } from 'react';
import AlgorithmView from '../algorithmView';
import './_styles.scss';

class AlgorithmPage extends Component {
    constuctor(props) {
        this.super(props);
    }

    state = {
        algorithmCount: 1
    }

    onAddAlgorithm = () => {
        this.setState((prevState) => ({
            algorithmCount: prevState.algorithmCount + 1
        }));
    }

    renderAlgorithms = () => {
        const elements = [];
        const { algorithmCount } = this.state;

        for (let i = 0; i < algorithmCount; i++) {
            elements.push(<AlgorithmView key={i}/>);
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

export default AlgorithmPage;