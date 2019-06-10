import { flatten, sortBy, take } from 'lodash';
import * as actionTypes from '../actions/actionTypes';

const reducer = (state = [], action) => {
    switch(action.type) {
        case actionTypes.ADD_NEW_ALGORITHM_COMPLETE: {
            return state.concat([selectTopElements(action.payload)]);
        }
        case actionTypes.START_ALGORITHM:
        case actionTypes.PAUSE_ALGORITHM:
        case actionTypes.RESUME_ALGORITHM:
        case actionTypes.UPDATE_INTERVAL:
        case actionTypes.STOP_ALGORITHM_COMPLETE:
        case actionTypes.SET_GENERATIONS: {
            return updateAlgorithms(state, action.payload);
        }
        case actionTypes.FETCH_CURRENT_STATE_COMPLETE: {
            const algorithm = action.payload;
            const updatedAlgorithm = selectTopElements(algorithm);
            
            return updateAlgorithms(state, { ...updatedAlgorithm, currentCrossoverElement: 0 });
        }

        case actionTypes.FETCH_ALGORITHMS_COMPLETE: {
            return action.payload.map(a => selectTopElements(a));
        }
        case actionTypes.REMOVE_ALGORITHM_COMPLETE: {
            const { id } = action.payload;

            return state.filter(a => a.id !== id);
        }
        case actionTypes.SET_ELEMENT_INFO: {
            const { id, x, y, generationIndex } = action.payload;
            const algorithm = state.find(a => a.id === id);
            const lastGeneration = algorithm.generations[generationIndex];
            const selectedElement = lastGeneration.cells[x][y];

            return state.map(a => {
                if (a.id === id) {
                    return { ...a, selectedElement };
                }

                return a;
            })
        }
        case actionTypes.SET_CROSSOVER_ELEMENT: {
            const { id, currentCrossoverElement } = action.payload;
            const algorithm = state.find(a => a.id === id);

            return updateAlgorithms(state, { ...algorithm, currentCrossoverElement });
        }
        default:
            return state;
    }
};

const selectTopElements = algorithm => {
    const lastGeneration = algorithm.generations[algorithm.generations.length - 1];
    const flattenCells = flatten(lastGeneration.cells).filter(c => c !== null);

    const topFiveFitElements = take(sortBy(flattenCells, c => c.fitnessValue).reverse(), 5);
    const topFiveLongLivedElements = take(sortBy(flattenCells, c => c.age).reverse(), 5);

    return { ...algorithm,  topFiveFitElements, topFiveLongLivedElements };
}

const updateAlgorithms = (state, newState) => {
    return state.map(item => {
        if (item.id === newState.id) {
            return { ...item, ...newState };
        }

        return item;
    });
}

export default reducer;