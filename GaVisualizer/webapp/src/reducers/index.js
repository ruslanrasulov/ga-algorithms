import { combineReducers } from 'redux';
import algorithms from './algorithmsReducer';
import newAlgorithm from './newAlgorithmReducer';

const rootReducer = combineReducers({ algorithms, newAlgorithm });

export default rootReducer;