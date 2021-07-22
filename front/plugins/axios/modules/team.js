import { axios } from '../index.js';

export default {
  getTeam() {
    return axios.$get(`teams`)
  },

  updateTeam(team) {
    return axios.$post(`teams`, {
      name: team.name,
      comment: team.comment,
      image: team.image
    })
  },

  deleteTeam() {
    return axios.$delete(`teams`)
  },

  registerTeam(team) {
    return axios.$post(`/signup`, {
      accountId: team.accountId,
      password: team.password,
      name: team.name
    })
  }
}