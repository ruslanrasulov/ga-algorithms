import * as actionTypes from '../actions/actionTypes';

const reducer = (state = [], action) => {
    switch(action.type) {
        case actionTypes.ADD_NEW_ALGORITHM_COMPLETE: {
            const algorithmInfo = action.payload;
            return state.concat([algorithmInfo]);
        }
        case actionTypes.FETCH_CURRENT_STATE_COMPLETE:
        case actionTypes.START_ALGORITHM:
        case actionTypes.PAUSE_ALGORITHM:
        case actionTypes.RESUME_ALGORITHM:
        case actionTypes.UPDATE_INTERVAL:
        case actionTypes.STOP_ALGORITHM_COMPLETE: {
            return updateAlgorithms(state, action.payload);
        }
        case actionTypes.FETCH_ALGORITHMS_COMPLETE: {
            return action.payload;
        }
        case actionTypes.REMOVE_ALGORITHM_COMPLETE: {
            const { algorithmId } = action.payload;

            return state.filter(a => a.algorithmId !== algorithmId);
        }
        case actionTypes.SET_ELEMENT_INFO: {
            const { algorithmId, elementInfo } = action.payload;

            return state.map(a => {
                if (a.algorithmId === algorithmId) {
                    return { ...a, elementInfo };
                }

                return a;
            })
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