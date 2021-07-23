import { axios } from '../index.js';

export default {
  getGames() {
    return axios.$get(`games`)
  },

  createGame(game) {
    return axios.$post(`games`, {
      opponentTeam: game.opponentTeam,
      date: game.date,
      field: game.field,
      topFlg: game.topFlg
    })
  }
}