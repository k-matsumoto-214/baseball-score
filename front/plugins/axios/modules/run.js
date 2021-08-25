import { axios } from '../index.js';

export default {
  registerRun(run) {
    return axios.$post(`runs`, {
      id: null,
      teamId: run.teamId,
      gameId: run.gameId,
      eventId: run.eventId,
      atBatId: run.atBatId,
      batterId: run.batterId,
      pitcherId: run.pitcherId,
      runnerId: run.runnerId,
      inning: run.inning,
      earnedFlg: run.earnedFlg,
      rbiFlg: run.rbiFlg,
      topFlg: run.topFlg
    })
  },

  getRunsByEventId(eventId) {
    return axios.$get(`games/runs/${eventId}`)
  },

  getRunsByGameId(gameId) {
    return axios.$get(`games/result/runs/${gameId}`)
  }
}