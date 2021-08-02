import { axios } from '../index.js';

export default {
  registerEvent(event) {
    return axios.$post(`events`, {
      id: null,
      gameId: event.gameId,
      teamId: event.teamId,
      inning: event.inning,
      atBatId: event.atBatId,
      resultFirstRunnerId: event.resultFirstRunnerId,
      resultSecondRunnerId: event.resultSecondRunnerId,
      resultThirdRunnerId: event.resultThirdRunnerId,
      resultOutCount: event.resultOutCount,
      timing: event.timing,
      comment: event.comment,
      eventType: event.eventType
    })
  },

  getEventsByAtBatId(atBatId) {
    return axios.$get(`games/events/${atBatId}`)
  }
}
