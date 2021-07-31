import { axios } from '../index.js';

export default {
  registerBatteryError(batteryError) {
    return axios.$post(`batteryErrors`, {
      id: null,
      eventId: batteryError.eventId,
      teamId: batteryError.teamId,
      pitcherId: batteryError.pitcherId,
      catcherId: batteryError.catcherId,
      wpFlg: batteryError.wpFlg
    })
  }
}