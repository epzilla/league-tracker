import * as qwest from 'qwest';
import LocalStorageService from './local-storage-service'
const base = `${window.location.protocol}//${window.location.hostname}:3000/api/`;

export default {
  get: url => qwest.get(`${base}${url}`, null, { responseType: 'json', cache: true }).then(res => res.response),

  post: (url, data) => qwest.post(`${base}${url}`, data, { dataType: 'json', responseType: 'json', cache: true }).then(res => res.response),

  put: (url, data) => qwest.put(`${base}${url}`, data, { dataType: 'json', responseType: 'json', cache: true }).then(res => res.response),

  upload: (url, data) => qwest.post(`${base}${url}`, data, { dataType: 'formdata', cache: true }).then(res => res.response),

  del: (url, data) => qwest.delete(`${base}${url}`, data, { dataType: 'formdata', cache: true }),

  getExternal: url => qwest.get(url, null, { responseType: 'json', cache: true }).then(res => res.response)
};