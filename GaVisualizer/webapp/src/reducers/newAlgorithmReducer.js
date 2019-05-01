import * as actionTypes from '../actions/actionTypes';

const reducer = (state = [], action) => {
    switch(action.type) {
        case actionTypes.SET_NEW_ALGORITHM: {
            const { cells } = action.payload;
            return { ...state, cells };
        }
        default:
            return state;
    }
};

export default reducer;