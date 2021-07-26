import { axios } from '../index.js';

export default {
  getGames() {
    return axios.$get(`games`)
  },

  registerGame(game) {
    return axios.$post(`games`, {
      opponentTeam: game.opponentTeam,
      date: game.date,
      field: game.field,
      topFlg: game.topFlg,
      topLineup: game.topLineup,
      bottomLineup: game.bottomLineup
    })
  },

  updateGame(game) {
    return axios.$post(`games/${game.id}`, {
      opponentTeam: game.opponentTeam,
      topScore: game.topScore,
      bottomScore: game.bottomScore,
      date: game.date,
      field: game.field,
      result: game.result,
      topFlg: game.topFlg,
      resultFlg: game.resultFlg,
      lineupingStatus: game.lineupingStatus,
      topLineup: game.topLineup,
      bottomLineup: game.bottomLineup
    })
  },

  getGame(id) {
    return axios.$get(`games/${id}`)
  },

  deleteGame(id) {
    return axios.$delte(`games/${id}`)
  }
}