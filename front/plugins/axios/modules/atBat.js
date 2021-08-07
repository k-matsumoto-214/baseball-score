import { axios } from '../index.js';

export default {
  getAtBatsByGameId(gameId) {
    return axios.$get(`games/at-bats/${gameId}`)
  },

  registerAtBat(atBat) {
    return axios.$post(`at-bats`, {
      id: null,
      gameId: atBat.gameId,
      teamId: atBat.teamId,
      batterId: atBat.batterId,
      pitcherId: atBat.pitcherId,
      inning: atBat.inning,
      outCount: atBat.outCount,
      firstRunnerId: atBat.firstRunnerId,
      secondRunnerId: atBat.secondRunnerId,
      thirdRunnerId: atBat.thirdRunnerId,
      playerChangeFlg: atBat.playerChangeFlg,
      direction: null,
      completeFlg: atBat.completeFlg,
      comment: null,
      result: null,
      lineupNumber: atBat.lineupNumber,
      topFlg: atBat.topFlg
    })
  },

  updateAtBat(atBat) {
    return axios.$post(`at-bats/${atBat.id}`, {
      gameId: atBat.gameId,
      batterId: atBat.batterId,
      pitcherId: atBat.pitcherId,
      inning: atBat.inning,
      outCount: atBat.outCount,
      firstRunnerId: atBat.firstRunnerId,
      secondRunnerId: atBat.secondRunnerId,
      thirdRunnerId: atBat.thirdRunnerId,
      playerChangeFlg: atBat.playerChangeFlg,
      direction: atBat.direction,
      completeFlg: atBat.completeFlg,
      comment: atBat.comment,
      result: atBat.result,
      lineupNumber: atBat.lineupNumber,
      topFlg: atBat.topFlg
    })
  },

  deleteAtBat(beforeAtBat, atBatId) {
    return axios.$post(`games/at-bats/${atBatId}`, {
      id: beforeAtBat.id,
      gameId: beforeAtBat.gameId,
      batterId: beforeAtBat.batterId,
      pitcherId: beforeAtBat.pitcherId,
      inning: beforeAtBat.inning,
      outCount: beforeAtBat.outCount,
      firstRunnerId: beforeAtBat.firstRunnerId,
      secondRunnerId: beforeAtBat.secondRunnerId,
      thirdRunnerId: beforeAtBat.thirdRunnerId,
      playerChangeFlg: beforeAtBat.playerChangeFlg,
      direction: null,
      completeFlg: null,
      comment: null,
      result: null,
      lineupNumber: beforeAtBat.lineupNumber,
      topFlg: beforeAtBat.topFlg
    })
  }
}