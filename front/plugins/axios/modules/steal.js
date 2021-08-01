import { axios } from '../index.js';

export default {
  registerSteal(steal) {
    return axios.$post(`steals`, {
      id: null,
      eventId: steal.eventId,
      teamId: steal.teamId,
      runnerId: steal.runnerId,
      pitcherId: steal.pitcherId,
      catcherId: steal.catcherId,
      successFlg: steal.successFlg
    })
  },

  getStealsByEventId(eventId) {
    return axios.$get(`games/steals/${eventId}`)
  }
}