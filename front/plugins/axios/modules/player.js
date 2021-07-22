import { axios } from '../index.js';

export default {
  getPlayer(id) {
    return axios.$get(`players/${id}`)
  },

  updatePlayer(data) {
    return axios.$post(`players/${data.id}`, data)
  },

  deletePlayer(id) {
    return axios.$delete(`players/${id}`)
  },

  getPlayers() {
    return axios.$get(`players`)
  },

  registerPlayer(data) {
    return axios.$post(`players`, data)
  }
}