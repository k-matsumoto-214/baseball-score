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
      earndFlg: run.earnedFlg,
      rbiFlg: run.rbiFlg
    })
  }
}