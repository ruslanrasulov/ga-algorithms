export const getAlgorithms = state => state.algorithms;
export const getAlgorithmById = (state, algorithmId) => state.algorithms.find(a => a.algorithmId === algorithmId);
export const getNewAlgorithm = state => state.newAlgorithm;