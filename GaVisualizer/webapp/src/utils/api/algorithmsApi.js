import axios from 'axios';

export default class AlgorithmsApi {
    static getApiUrl = (path) => process.env.API_URL + 'api/algorithms/' + path || '';

    static postNewAlgorithm = () => {
        return AlgorithmsApi.post();
    }

    static getCurrentState = (id) => {
        return AlgorithmsApi.get(`${id}/state`);
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

    static call = (action, url, body) => {
        const apiUrl = AlgorithmsApi.getApiUrl(url);

        if (body) {
            return action(apiUrl, body);
        }

        return action(apiUrl);
    }
}