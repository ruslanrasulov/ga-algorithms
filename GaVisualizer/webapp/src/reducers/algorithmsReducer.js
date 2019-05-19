import * as actionTypes from '../actions/actionTypes';

const reducer = (state = [], action) => {
    switch(action.type) {
        case actionTypes.ADD_NEW_ALGORITHM_COMPLETE: {
            return state.concat([action.payload]);
        }
        case actionTypes.START_ALGORITHM:
        case actionTypes.PAUSE_ALGORITHM:
        case actionTypes.RESUME_ALGORITHM:
        case actionTypes.UPDATE_INTERVAL:
        case actionTypes.STOP_ALGORITHM_COMPLETE: {
            return updateAlgorithms(state, action.payload);
        }
        case actionTypes.FETCH_CURRENT_STATE_COMPLETE: {
            const { id } = action.payload;
            const algorithm = state.find(a => a.id === id);

            if (algorithm.isPaused || algorithm.isStopped) {
                return state;
            }

            if (algorithm.elementInfo !== undefined) {
                const { x, y } = algorithm.elementInfo;
                
                const newElementInfo = Object.assign(action.payload.cells[x][y], { x, y });
                const newAglorithm = action.payload;
                const newState = { ...newAglorithm, ...{ elementInfo: newElementInfo } };

                return updateAlgorithms(state, newState);
            }
            else {
                return updateAlgorithms(state, action.payload);
            }
        }

        case actionTypes.FETCH_ALGORITHMS_COMPLETE: {
            return action.payload;
        }
        case actionTypes.REMOVE_ALGORITHM_COMPLETE: {
            const { id } = action.payload;

            return state.filter(a => a.id !== id);
        }
        case actionTypes.SET_ELEMENT_INFO: {
            const { id, elementInfo } = action.payload;

            return state.map(a => {
                if (a.id === id) {
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
        if (item.id === newState.id) {
            return { ...item, ...newState };
        }

        return item;
    });
}

export default reducer;