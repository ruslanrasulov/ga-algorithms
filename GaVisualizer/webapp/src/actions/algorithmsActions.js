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
    payload: state
});

export const getCurrentState = id => dispatch => {
    dispatch(getCurrentStateStart());

    algorithmsApi.getCurrentState(id).then(result => {
        dispatch(getCurrentStateComplete(result.data));
    });
}

export const startAlgorithm = (algorithmId, callback) => dispatch => {
    dispatch({
        type: actionTypes.START_ALGORITHM,
        payload: { algorithmId, isPaused: false }
    });

    callback();
};

export const pauseAlgorithm = algorithmId => ({
    type: actionTypes.PAUSE_ALGORITHM,
    payload: { algorithmId, isPaused: true }
});

export const resumeAlgorithm = algorithmId => ({
    type: actionTypes.RESUME_ALGORITHM,
    payload: { algorithmId, isPaused: false }
});

export const updateTimeout = (algorithmId, timeout) => ({
    type: actionTypes.UPDATE_TIMEOUT,
    payload: { algorithmId,  timeout }
});