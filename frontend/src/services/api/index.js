export default (httpClient) => ({
  getStates: async () => {
    try {
      const result = await httpClient.get('/states?abbreviation=asc')
      return result.data
    } catch (error) {
      throw new Error('Error on request states')
    }
  },
  getCitiesByState: async (abbreviation) => {
    try {
      const result = await httpClient.get(`/cities/${abbreviation}`)
      return result.data
    } catch (error) {
      throw new Error('Error on request cities by state')
    }
  },
})
