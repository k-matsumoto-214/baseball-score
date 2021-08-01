import { axios } from '../index.js';

export default {
  registerRunOut(runOut) {
    return axios.$post(`run-outs`, {
      id: null,
      playerId: runOut.playerId,
      teamId: runOut.teamId,
      eventId: runOut.eventId
    })
  },

  getRunOutsByEventId(eventId) {
    return axios.$get(`games/run-outs/${eventId}`)
  }
}