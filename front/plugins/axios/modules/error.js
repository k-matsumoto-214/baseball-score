import { axios } from '../index.js';

export default {
  registerError(error) {
    return axios.$post(`errors`, {
      id: null,
      teamId: error.teamId,
      playerId: error.playerId,
      eventId: error.eventId
    })
  },

  getErrorByEventId(eventId) {
    return axios.$get(`games/errors/${eventId}`)
  }
}
