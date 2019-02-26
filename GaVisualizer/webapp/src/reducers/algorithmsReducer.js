import * as actionTypes from '../actions/actionTypes';

const reducer = (state = [], action) => {
    switch(action.type) {
        case actionTypes.ADD_NEW_ALGORITHM_COMPLETE: {
            const { algorithmId } = action.payload;
            return state.concat([{ algorithmId }]);
        }
        case actionTypes.FETCH_CURRENT_STATE_COMPLETE: {
            const algorithmState = action.payload.state;

            return state.map(item => {
                if (item.algorithmId === algorithmState.algorithmId) {
                    return Object.assign(item, algorithmState);
                }

                return item;
            });
        }
        default:
            return state;
    }
};

export default reducer;