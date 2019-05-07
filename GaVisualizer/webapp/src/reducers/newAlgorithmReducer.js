import * as actionTypes from '../actions/actionTypes';

const reducer = (state = [], action) => {
    switch(action.type) {
        case actionTypes.SET_NEW_ALGORITHM: {
            const newAlgorithm = action.payload;

            return { ...state, ...newAlgorithm };
        }
        default:
            return state;
    }
};

export default reducer;