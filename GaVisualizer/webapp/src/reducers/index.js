import { combineReducers } from 'redux';
import algorithms from './algorithmsReducer';

const rootReducer = combineReducers({
    algorithms,
});

export default rootReducer;