import * as actionTypes from './actionTypes';
import algorithmsApi from '../utils/api/algorithmsApi';

export const createNewAlgorithmStart = () => ({
    type: actionTypes.ADD_NEW_ALGORITHM_START
});

export const createNewAlgorithmComplete = algorithmId => ({
    type: actionTypes.ADD_NEW_ALGORITHM_COMPLETE,
    payload: { algorithmId }
});

export const createNewAlgorithm = () => dispatch => {
    dispatch(createNewAlgorithmStart());

    algorithmsApi.postNewAlgorithm({}).then(result => {
        dispatch(createNewAlgorithmComplete(result.data.algorithmId));
    });
}

export const getCurrentStateStart = () => ({
    type: actionTypes.FETCH_CURRENT_STATE_START
});

export const getCurrentStateComplete = state => ({
    type: actionTypes.FETCH_CURRENT_STATE_COMPLETE,
    payload: { state }
});

export const getCurrentState = id => dispatch => {
    dispatch(getCurrentStateStart());

    algorithmsApi.getCurrentState(id).then(result => {
        dispatch(getCurrentStateComplete(result.data));
    });
}