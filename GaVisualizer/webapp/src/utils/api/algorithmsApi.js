import axios from 'axios';

export default class AlgorithmsApi {
    static getApiUrl = (path) => process.env.API_URL + 'api/algorithms/' + (path || '');

    static postNewAlgorithm = (body) => {
        return AlgorithmsApi.post(null, body);
    }

    static getCurrentState = (id) => {
        return AlgorithmsApi.get(`${id}/state`);
    }

    static getNextState = (id) => {
        return AlgorithmsApi.get(`${id}/next-state`);
    }

    static getAlgorithms = () => {
        return AlgorithmsApi.get();
    }

    static removeAlgorithm = id => {
        return AlgorithmsApi.delete(id);
    }

    static stopAlgorithm = id => {
        const body = { isStopped: true };

        return AlgorithmsApi.patch(id, body);
    }

    static get = (url) => {
        return AlgorithmsApi.call((url) => axios.get(url), url);
    }

    static post = (url, body) => {
        return AlgorithmsApi.call((url, body) => axios.post(url, body), url, body);
    }

    static put = (url, body) => {
        return AlgorithmsApi.call((url, body) => axios.put(url, body), url, body);
    }

    static delete = (url) => {
        return AlgorithmsApi.call((url) => axios.delete(url), url);
    }

    static patch = (url, body) => {
        return AlgorithmsApi.call((url, body) => axios.patch(url, body), url, body);
    }

    static call = (action, url, body) => {
        const apiUrl = AlgorithmsApi.getApiUrl(url);

        if (body) {
            return action(apiUrl, body);
        }

        return action(apiUrl);
    }
}