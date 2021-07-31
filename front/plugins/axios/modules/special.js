import { axios } from '../index.js';

export default {
  registerSpecial(special) {
    return axios.$post(`specials`, {
      id: null,
      teamId: special.teamId,
      eventId: special.eventId
    })
  }
}