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
      bottomLineup: game.bottomLineup,
      inning: game.inning,
      winningPitcher: game.winningPitcher !== null ? game.winningPitcher.id : null,
      losingPitcher: game.losingPitcher !== null ? game.losingPitcher.id : null,
      savePitcher: game.savePitcher !== null ? game.savePitcher.id : null,
      comment: game.comment
    })
  },

  getGame(id) {
    return axios.$get(`games/${id}`)
  },

  deleteGame(id) {
    return axios.$delte(`games/${id}`)
  },

  getScore(id) {
    return axios.$get(`games/scores/${id}`)
  },

  getProcess(id) {
    return axios.$get(`games/process/${id}`)
  },

  getStatsForBatter(id) {
    return axios.$get(`games/stats/batters/${id}`)
  },

  getStatsForPitcher(id) {
    return axios.$get(`games/stats/pitchers/${id}`)
  }
}