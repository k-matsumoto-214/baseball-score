import { axios } from '../index.js';

export default {
  getAtBatsByGameId(gameId) {
    return axios.$get(`games/at-bats/${gameId}`)
  }
}