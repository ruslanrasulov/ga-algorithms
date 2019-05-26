import * as actionTypes from './actionTypes';
import algorithmsApi from '../utils/api/algorithmsApi';

export const createNewAlgorithmStart = () => ({
    type: actionTypes.ADD_NEW_ALGORITHM_START
});

export const createNewAlgorithmComplete = algorithm => ({
    type: actionTypes.ADD_NEW_ALGORITHM_COMPLETE,
    payload: algorithm
});

export const createNewAlgorithm = algorithm => dispatch => {
    dispatch(createNewAlgorithmStart());

    algorithmsApi.postNewAlgorithm(algorithm).then(result => {
        dispatch(createNewAlgorithmComplete(result.data));
    });
}

export const getCurrentStateStart = () => ({
    type: actionTypes.FETCH_CURRENT_STATE_START
});

export const getCurrentStateComplete = state => ({
    type: actionTypes.FETCH_CURRENT_STATE_COMPLETE,
    payload: state
});

export const getCurrentState = (id, callback) => dispatch => {
    dispatch(getCurrentStateStart());

    algorithmsApi.getNextState(id).then(result => {
        dispatch(getCurrentStateComplete(result.data));
        if (callback) {
            callback();
        }
    });
}

export const startAlgorithm = (id, callback) => dispatch => {
    dispatch({
        type: actionTypes.START_ALGORITHM,
        payload: { id, isPaused: false, isStarted: true, isStopped: false }
    });

    callback();
};

export const pauseAlgorithm = id => ({
    type: actionTypes.PAUSE_ALGORITHM,
    payload: { id, isPaused: true }
});

export const resumeAlgorithm = (id, callback) => dispatch => {
    dispatch({
        type: actionTypes.RESUME_ALGORITHM,
        payload: { id, isPaused: false }
    });

    callback();
};

export const updateInterval = (id, timeout) => ({
    type: actionTypes.UPDATE_INTERVAL,
    payload: { id,  timeout }
});

export const getAlgorithmsStart = () => ({
    type: actionTypes.FETCH_ALGORITHMS_START
});

export const getAlgorithmsComplete = algorithms => ({
    type: actionTypes.FETCH_ALGORITHMS_COMPLETE,
    payload: algorithms
});

export const getAlgorithms = () => dispatch => {
    dispatch(getAlgorithmsStart());

    algorithmsApi.getAlgorithms().then(result => {
        dispatch(getAlgorithmsComplete(result.data));
    });
}

export const removeAlgorirthmStart = id => ({
    type: actionTypes.REMOVE_ALGORITHM_START,
    payload: { id }
});

export const removeAlgorirthmComplete = id => ({
    type: actionTypes.REMOVE_ALGORITHM_COMPLETE,
    payload: { id }
});

export const removeAlgorithm = id => dispatch => {
    dispatch(removeAlgorirthmStart(id));

    algorithmsApi.removeAlgorithm(id).then(result => {
        if (result.status === 200) {
            dispatch(removeAlgorirthmComplete(id));
        }
    });
}

export const stopAlgorithmStart = id => ({
    type: actionTypes.STOP_ALGORITHM_START,
    payload: { id }
});

export const stopAlgorithmComplete = algorithm => ({
    type: actionTypes.STOP_ALGORITHM_COMPLETE,
    payload: { 
        ...algorithm,
        isStopped: true,
        isPaused: false,
        isStarted: false,
        generations: [{ cells: null }]
    }
});

export const stopAlgorithm = id => dispatch => {
    dispatch(stopAlgorithmStart(id));

    algorithmsApi.stopAlgorithm(id).then(result => {
        dispatch(stopAlgorithmComplete(result.data));
    });
}

export const setNewAlgorithm = algorithm => ({
    type: actionTypes.SET_NEW_ALGORITHM,
    payload: algorithm
});

export const setElementInfo = (id, x, y, generationIndex) => ({
    type: actionTypes.SET_ELEMENT_INFO,
    payload: {
        id,
        x,
        y,
        generationIndex
    }
});

export const setGenerations = (id, leftGenerationIndex, rightGenerationIndex) => ({
    type: actionTypes.SET_GENERATIONS,
    payload: { id, leftGenerationIndex, rightGenerationIndex }
});

export const setCrossoverElement = (id, currentCrossoverElement) => ({
    type: actionTypes.SET_CROSSOVER_ELEMENT,
    payload: { id, currentCrossoverElement }
});