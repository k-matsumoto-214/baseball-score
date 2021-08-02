import { axios } from '../index.js';

export default {
  registerBatteryError(batteryError) {
    return axios.$post(`battery-errors`, {
      id: null,
      eventId: batteryError.eventId,
      teamId: batteryError.teamId,
      pitcherId: batteryError.pitcherId,
      catcherId: batteryError.catcherId,
      wpFlg: batteryError.wpFlg
    })
  },

  getBatteryErrorByEventId(eventId) {
    return axios.$get(`games/battery-errors/${eventId}`)
  }
}