import { axios } from '../index.js';

export default {
  getTeam() {
    return axios.$get(`teams`)
  },

  updateTeam(data) {
    return axios.$post(`teams`, data)
  },

  deleteTeam() {
    return axios.$delete(`teams`)
  },

  registerTeam(data) {
    return axios.$post(`signup`, data)
  }
}