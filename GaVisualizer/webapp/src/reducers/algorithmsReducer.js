import * as actionTypes from '../actions/actionTypes';

const reducer = (state = [], action) => {
    switch(action.type) {
        case actionTypes.ADD_NEW_ALGORITHM_COMPLETE: {
            const { algorithmId } = action.payload;
            return state.concat([{ algorithmId }]);
        }
        case actionTypes.FETCH_CURRENT_STATE_COMPLETE:
        case actionTypes.START_ALGORITHM:
        case actionTypes.PAUSE_ALGORITHM:
        case actionTypes.RESUME_ALGORITHM:
        case actionTypes.UPDATE_TIMEOUT: {
            return updateAlgorithms(state, action.payload);
        }
        case actionTypes.FETCH_ALGORITHMS_COMPLETE: {
            return action.payload;
        }
        case actionTypes.REMOVE_ALGORITHM_COMPLETE: {
            const { algorithmId } = action.payload;

            return state.filter(a => a.algorithmId !== algorithmId);
        }
        default:
            return state;
    }
};

const updateAlgorithms = (state, newState) => {
    return state.map(item => {
        if (item.algorithmId === newState.algorithmId) {
            Object.assign(item, newState);
        }

        return item;
    });
}

export default reducer;