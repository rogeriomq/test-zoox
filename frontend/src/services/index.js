import axios from 'axios'

import ApiService from './api'

const HTTPClientForAPI = axios.create({
  baseURL: 'http://localhost:3333',
  headers: { 'X-API-key': '46c9f332-79bc-4f29-baa5-9f1f69ab17fa' },
})

export const apiClient = ApiService(HTTPClientForAPI)
