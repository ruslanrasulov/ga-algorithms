export const getAlgorithms = state => state.algorithms;
export const getAlgorithmById = (state, id) => state.algorithms.find(a => a.id === id);
export const getNewAlgorithm = state => state.newAlgorithm;