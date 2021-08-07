import { axios } from '../index.js';

export default {
  registerPlayerChange(playerChange) {
    return axios.$post(`player-changes`, {
      temaId: playerChange.teamId,
      gameId: playerChange.gameId,
      atBatId: playerChange.atBatId,
      outPlayerId: playerChange.outPlayerId,
      inPlayerId: playerChange.inPlayerId,
      changeStatus: playerChange.changeStatus,
      beforeField: playerChange.beforeField,
      afterField: playerChange.afterField,
      eventId: playerChange.eventId
    })
  },

  getPlayerChangesByEventId(eventId) {
    return axios.$get(`games/player-changes/${eventId}`)
  },
}