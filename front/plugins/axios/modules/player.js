import { axios } from '../index.js';

export default {
  getPlayer(id) {
    return axios.$get(`players/${id}`)
  },

  updatePlayer(player) {
    return axios.$post(`players/${player.id}`, {
      name: player.name,
      number: player.number,
      birthday: player.birthday,
      position: player.position,
      image: player.image,
      comment: player.comment
    })
  },

  deletePlayer(id) {
    return axios.$delete(`players/${id}`)
  },

  getPlayers() {
    return axios.$get(`players`)
  },

  registerPlayer(player) {
    return axios.$post(`players`, {
      name: player.name,
      number: player.number,
      birthday: player.birthday,
      position: player.position,
      image: player.image,
      comment: player.comment
    })
  }
}