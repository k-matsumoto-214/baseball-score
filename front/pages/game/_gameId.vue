<template>
  <v-container>
    <v-card
      class="mx-auto fill-width pt-7"
      max-width="640"
      flat
    >
      <v-card-subtitle></v-card-subtitle>
      <div v-if="!game.resultFlg">
        <div v-if="game.lineupingStatus === 0">
          <v-card-text>
            <p class="text-subtitle-1">スタメンを登録してください</p>
          </v-card-text>
          <v-row justify="center">
            <v-col cols="5">
              <p>選手一覧</p>
              <draggable v-model="players" group="starters" :animation="300" :delay="50"
                style="padding:5px 0; height: 550px; overflow-y: scroll;"
              >
                <lineup-list
                  v-for="player in players"
                  :key="player.id"
                  :player="player"
                />
              </draggable>
            </v-col>
            <v-col cols="7">         
              <p>スタメン</p>
              <v-row justify="center">
                <v-col cols="9">
                  <draggable v-model="starters" group="starters" :animation="300" :delay="50" style="padding:5px 0">
                    <lineup-list
                      v-for="(starter,idx) in starters"
                      :key="starter.id"
                      :player="starter"
                      :number="idx + 1"
                    />
                    <p v-if="starters.length === 0" class="grey lighten-2 py-1 px-2 rounded-pill text-center">ここにドラッグ</p>
                  </draggable>
                </v-col>
                <v-col cols="3">
                  <draggable v-model="fields" :animation="300" :delay="50" style="padding:5px 0">
                    <field-list
                      v-for="(field,idx) in fields"
                      :key="idx"
                      :fieldNumber="field"
                    />
                  </draggable>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <p class="text-center" style="color: #FF4081">{{ errorMessage }}</p>
          <v-row justify="center">
            <v-btn
              class="mr-4 mt-4 mb-2"
              color="primary"
              @click="saveStarters()"
            >
              確定
            </v-btn>
          </v-row>
        </div>
        <div v-else-if="game.lineupingStatus === 2">
          <v-row>
            <v-col cols="2" style="padding: 0px;">
              <v-simple-table class="grey lighten-3">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Team
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        {{ game.topFlg ? team.name : game.opponentTeam }}
                      </td>
                    </tr>
                    <tr>
                      <td style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        {{ !game.topFlg ? team.name : game.opponentTeam }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="9" style="padding: 0 1px;">
              <v-simple-table class="grey lighten-3">
                <template v-slot:default>
                  <thead>
                    <tr class="text-center">
                      <th class="inningHeader  ">1</th>
                      <th class="inningHeader  ">2</th>
                      <th class="inningHeader  ">3</th>
                      <th class="inningHeader  ">4</th>
                      <th class="inningHeader  ">5</th>
                      <th class="inningHeader  ">6</th>
                      <th class="inningHeader  ">7</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr class="text-center">
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="1">1</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                  </tr>
                  <tr class="home">
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="0">0</td>
                    <td class="inning  " data-score="1">1</td>
                    <td class="inning  " data-score="0">0</td>
                  </tr>
                </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="1" style="padding: 0px;">
              <v-simple-table class="grey lighten-3">
                <template v-slot:default>
                  <thead>
                    <tr class="text-center">
                      <th class="inningHeader">R</th>
                      <th class="inningHeader">H</th>
                      <th class="inningHeader">E</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="text-center">
                      <td class="inning  " data-score="0">0</td>
                      <td class="inning  " data-score="0">0</td>
                      <td class="inning  " data-score="0">0</td>
                    </tr>
                    <tr class="home">
                      <td class="inning  " data-score="0">0</td>
                      <td class="inning  " data-score="0">0</td>
                      <td class="inning  " data-score="0">0</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
          <div v-if="nowBatter !== null">
            <inning-info :atBat="atBat" />
            <v-row justify="space-between" class="mt-3">
              <v-col cols="5">
                <pitcher-info
                  :nowPitcher="nowPitcher"
                />
              </v-col>
              <v-col cols="2" style="margin: auto 0; font-size: 30px; color: #F06292;">
                <p class="text-center">VS</p>
              </v-col>
              <v-col cols="5">
                <batter-info 
                  :nowBatter="nowBatter"
                />
              </v-col>
            </v-row>
            <v-row justify="center" class="my-5">
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="pink lighten-1"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="white--text mr-5"
                  >
                    <span>安打</span>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(0)">ヒット</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(1)">二塁打</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(2)">三塁打</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(3)">本塁打</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="light-blue lighten-1"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="white--text mr-5"
                  >
                  　<span>出塁</span>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(4)">四球</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(5)">死球</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(6)">エラー</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(10)">振逃</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(13)">特殊</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-show="atBat.outCount !== 2 &&
                      (firstRunner !== null || secondRunner !== null || thirdRunner !== null)"
                    color="amber lighten-1"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="white--text mr-5"
                  >
                  　<span>犠打</span>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(7)">犠打</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-show="thirdRunner !== null">
                    <v-list-item-title @click="openResultModal(8)">
                      犠飛
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="grey lighten-1"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="white--text"
                  >
                    <span>凡打</span>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(11)">ゴロ</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(12)">フライ</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(9)">三振</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(14)">特殊</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
            <v-row justify="center" class="my-5">
              <v-btn
                v-if="firstRunner !== null || secondRunner !== null || thirdRunner !== null"
                color="blue darken-4"
                dark
                class="white--text mr-5"
                @click="openStealModal()"
              >
                <span>盗塁</span>
              </v-btn>
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="firstRunner !== null || secondRunner !== null || thirdRunner !== null"
                    color="teal darken-3"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="white--text mr-5"
                  >
                  　<span>失策</span>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(4)">四球</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(5)">死球</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(6)">エラー</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(10)">振逃</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="openResultModal(13)">特殊</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
            <!-- <v-btn
              color="teal lighten-2"
              dark
              v-bind="attrs"
              v-on="on"
              class="white--text"
            >
              <span>イベント</span>
            </v-btn> -->
            <v-dialog
              v-model="isOpenResultModal"
              max-width="640"
              fullscreen
              ref="hit_modal"
            >
              <v-card>
                <v-container>
                  <p class="mt-2">ランナー状況を入力してください</p>
                  <v-row justify="center">
                    <v-col cols="6">
                      <p>一塁</p>
                      <draggable v-model="firstRunners" group="runners" :animation="300" :delay="50" style="padding:5px 0">
                        <runner-list
                          v-for="(firstRunner) in firstRunners"
                          :key="firstRunner.id"
                          :player="firstRunner"
                        />
                        <p v-if="firstRunners.length === 0" class="grey lighten-2 py-1 px-2 rounded-pill text-center">ここにドラッグ</p>
                      </draggable>
                    </v-col>
                    <v-col cols="6">
                      <p>二塁</p>
                      <draggable v-model="secondRunners" group="runners" :animation="300" :delay="50" style="padding:5px 0">
                        <runner-list
                          v-for="(secondRunner) in secondRunners"
                          :key="secondRunner.id"
                          :player="secondRunner"
                        />
                        <p v-if="secondRunners.length === 0" class="grey lighten-2 py-1 px-2 rounded-pill text-center">ここにドラッグ</p>
                      </draggable>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="6">
                      <p>三塁</p>
                      <draggable v-model="thirdRunners" group="runners" :animation="300" :delay="50" style="padding:5px 0">
                        <runner-list
                          v-for="(thirdRunner) in thirdRunners"
                          :key="thirdRunner.id"
                          :player="thirdRunner"
                        />
                        <p v-if="thirdRunners.length === 0" class="grey lighten-2 py-1 px-2 rounded-pill text-center">ここにドラッグ</p>
                      </draggable>
                    </v-col>
                    <v-col cols="6">
                      <p style="color: #EC407A">得点</p>
                      <draggable v-model="homeRunners" group="runners" :animation="300" :delay="50" style="padding:5px 0">
                        <runner-list
                          v-for="(homeRunner) in homeRunners"
                          :key="homeRunner.id"
                          :player="homeRunner"
                        />
                        <p v-if="homeRunners.length === 0" class="grey lighten-2 py-1 px-2 rounded-pill text-center">ここにドラッグ</p>
                      </draggable>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <p style="color: #42A5F5">アウト</p>
                      <draggable v-model="outRunners" group="runners" :animation="300" :delay="50" style="padding:5px 0">
                        <runner-list
                          v-for="(outRunner) in outRunners"
                          :key="outRunner.id"
                          :player="outRunner"
                        />
                        <p v-if="outRunners.length === 0" class="grey lighten-2 py-1 px-2 rounded-pill text-center">ここにドラッグ</p>
                      </draggable>
                    </v-col>
                  </v-row>
                  <div
                    v-if="!(atBat.result === 4 ||
                    atBat.result === 5 ||
                    atBat.result === 9 ||
                    atBat.result === 10 ||
                    atBat.result === 13 ||
                    atBat.result === 14)"
                  >
                    <p class="mt-2">打球方向を選択してください</p>
                    <hit-direction-selector
                      class="mt-5"
                      :direction="atBat.direction"
                      @change-direction="atBat.direction=$event"
                    />
                  </div>
                  <v-text-field
                    v-model="atBat.comment"
                    :error-messages="commentErrors"
                    :counter="200"
                    outlined
                    label="コメント"
                    class="mt-3"
                    @input="$v.atBat.comment.$touch()"
                    @blur="$v.atBat.comment.$touch()"
                  ></v-text-field>
                  <p class="text-center" style="color: #FF4081">{{ directionErrorMessage }}</p>
                  <p class="text-center" style="color: #FF4081">{{ runnerErrorMessage }}</p>
                  <v-row justify="center">
                    <v-btn
                      class="mr-4 mb-4"
                      color="primary"
                      @click="saveResult()"
                    >
                      確定
                    </v-btn>
                    <v-btn
                      class="mb-4"
                      @click="closeResultModal()"
                    >
                      戻る
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="isOpenRbiAndEernedModal"
              max-width="640"
              fullscreen
            >
              <v-card>
                <v-container>
                  <div>
                    <p class="mt-2">得点の自責点、打点を設定してください</p>
                    <div
                      v-for="homeRunner in homeRunners"
                      :key="homeRunner.id"
                    >
                      <div class="d-flex">
                        <v-list-item-avatar>
                          <v-img :src="homeRunner.image ? homeRunner.image : '../noimage.png'"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-text="homeRunner.name" style="margin-left: 5px"></v-list-item-title>
                        </v-list-item-content>
                        <v-checkbox
                          v-model="homeRunner.earnedFlg"
                          :label="'自責点'"
                          class="mr-4 ml-2"
                        ></v-checkbox>
                        <v-checkbox
                          v-model="homeRunner.rbiFlg"
                          :label="'打点'"
                          class="mr-4"
                        ></v-checkbox>
                      </div>
                    </div>
                  </div>
                  <v-row justify="center">
                    <v-btn
                      class="mt-8 mb-4"
                      color="primary"
                      @click="saveResult()"
                    >
                      確定
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="isOpenStealModal"
              max-width="640"
              fullscreen
              ref="steal_modal"
            >
              <v-card>
                <v-container>
                  <p class="mt-2">盗塁状況を入力してください</p>
                  <div class="d-flex" v-if="firstRunner !== null">
                    一塁
                    <v-list-item-avatar>
                      <v-img :src="firstRunner.image ? firstRunner.image : '../noimage.png'"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="firstRunner.name" style="margin-left: 5px"></v-list-item-title>
                    </v-list-item-content>
                    <v-radio-group v-model="firstRunner.successFlg">
                      <v-radio
                        :label="`成功`"
                        :value="'true'"
                      ></v-radio>
                      <v-radio
                        :label="`失敗`"
                        :value="'false'"
                      ></v-radio>
                      <v-radio 
                        :label="`企図なし`"
                        :value="'null'"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                  <div class="d-flex" v-if="secondRunner !== null">
                    二塁
                    <v-list-item-avatar>
                      <v-img :src="secondRunner.image ? secondRunner.image : '../noimage.png'"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="secondRunner.name" style="margin-left: 5px"></v-list-item-title>
                    </v-list-item-content>
                    <v-radio-group v-model="secondRunner.successFlg">
                      <v-radio
                        :label="`成功`"
                        :value="'true'"
                      ></v-radio>
                      <v-radio
                        :label="`失敗`"
                        :value="'false'"
                      ></v-radio>
                      <v-radio 
                        :label="`企図なし`"
                        :value="'null'"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                  <div class="d-flex" v-if="thirdRunner !== null">
                    三塁
                    <v-list-item-avatar>
                      <v-img :src="thirdRunner.image ? thirdRunner.image : '../noimage.png'"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="thirdRunner.name" style="margin-left: 5px"></v-list-item-title>
                    </v-list-item-content>
                    <v-radio-group v-model="thirdRunner.successFlg">
                      <v-radio
                        :label="`成功`"
                        :value="'true'"
                      ></v-radio>
                      <v-radio
                        :label="`失敗`"
                        :value="'false'"
                      ></v-radio>
                      <v-radio 
                        :label="`企図なし`"
                        :value="'null'"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                  <v-text-field
                    v-model="event.comment"
                    :error-messages="eventCommentErrors"
                    :counter="200"
                    outlined
                    label="コメント"
                    class="mt-3"
                    @input="$v.event.comment.$touch()"
                    @blur="$v.event.comment.$touch()"
                  ></v-text-field>
                  <p class="text-center" style="color: #FF4081">{{ stealErrorMessage }}</p>
                  <v-row justify="center">
                    <v-btn
                      class="mr-4 mb-4"
                      color="primary"
                      @click="saveSteal()"
                    >
                      確定
                    </v-btn>
                    <v-btn
                      class="mb-4"
                      @click="closeStealModal()"
                    >
                      戻る
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="isOpenEernedModal"
              max-width="640"
              fullscreen
            >
              <v-card>
                <v-container>
                  <div>
                    <p class="mt-2">得点の自責点を設定してください</p>
                    <div class="d-flex" v-if="thirdRunner !== null">
                      <v-list-item-avatar>
                        <v-img :src="thirdRunner.image ? thirdRunner.image : '../noimage.png'"></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title v-text="thirdRunner.name" style="margin-left: 5px"></v-list-item-title>
                      </v-list-item-content>
                      <v-checkbox
                        v-model="thirdRunner.earnedFlg"
                        :label="'自責点'"
                        class="mr-4 ml-2"
                      ></v-checkbox>
                    </div>
                  </div>
                  <v-row justify="center">
                    <v-btn
                      class="mt-8 mb-4"
                      color="primary"
                      @click="saveSteal()"
                    >
                      確定
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { maxLength } from 'vuelidate/lib/validators'
import GameApi from '@/plugins/axios/modules/game'
import PlayerApi from '@/plugins/axios/modules/player'
import TeamApi from '@/plugins/axios/modules/team'
import AtBatApi from '@/plugins/axios/modules/atBat'
import RunApi from '@/plugins/axios/modules/run'
import EventApi from '@/plugins/axios/modules/event'
import RunOutApi from '@/plugins/axios/modules/runOut'
import StealApi from '@/plugins/axios/modules/steal'
import draggable from 'vuedraggable'
import lineupList from '@/components/lineupList.vue'
import fieldList from '@/components/fieldList.vue'
import batterInfo from '@/components/batterInfo.vue'
import pitcherInfo from '@/components/pitcherInfo.vue'
import inningInfo from '@/components/inningInfo.vue'
import runnerList from '@/components/runnerList.vue'
import rbiEarnedSelector from '@/components/rbiEarnedSelector.vue'

export default {
  components: {
    draggable,
    lineupList,
    fieldList,
    batterInfo,
    pitcherInfo,
    inningInfo,
    runnerList,
    rbiEarnedSelector
  },
  layout: 'loggedIn',
  mixins: [validationMixin],
  validations: {
    atBat: {
      comment: { maxLength: maxLength(200) }
    },
    event: {
      comment: { maxLength: maxLength(200) }
    }
  },
  data() {
    return {
      game: {
        id: null,
        teamId: null,
        opponentTeam : null,
        topScore: null,
        bottomScore: null,
        date: null,
        field: null,
        winFlg: null,
        topFlg: null,
        resultFlg: false,
        lineupingStatus: null,
        topLineup: null,
        bottomLineup: null
      },
      team: {},
      players: [],
      starters: [],
      opponentTeamId: 1000,
      fields: [],
      defaultFields: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
      atBats: [],
      atBat: {
        id: null,
        teamId: null,
        gameId: null,
        batterId: null,
        pitcherId: null,
        inning: null,
        outCount: null,
        firstRunnerId: null,
        secondRunnerId: null,
        thirdRunnerId: null,
        playerChangeFlg: false,
        direction: null,
        completeFlg: false,
        comment: null,
        result: null,
        lineupNumber: null,
        topFlg: false
      },
      events: [],
      event: {
        comment: null
      },
      runOuts: [],
      runOut: {
        id :null,
        playerId: null,
        teamId: null,
        eventId: null
      },
      runs: [],
      run: {
        id: null,
        teamId: null,
        gameId: null,
        eventId: null,
        atBatId: null,
        batterId: null,
        pitcherId: null,
        runnerId: null,
        inning: null,
        earndFlg: null,
        rbiFlg: null
      },
      specials: [],
      special: {
        id: null,
        eventId: null,
        teamId: null,
        comment: null
      },
      errors: [],
      error: {
        id: null,
        teamId: null,
        eventId: null,
        playerId: null
      },
      steals: [],
      steal: {
        id: null,
        teamId: null,
        eventId: null,
        playerId: null
      },
      batteryErrors: [],
      batteryError: {
        id: null,
        eventId :null,
        teamId: null,
        pitcherId: null,
        catcherId: null,
        wpFlg: null
      },
      firstRunner: null,
      secondRunner: null,
      thirdRunner: null,
      firstRunners: [],
      secondRunners: [],
      thirdRunners: [],
      homeRunners: [],
      outRunners: [],
      nowBatter: null,
      nowPitcher: null,
      errorMessage: '',
      directionErrorMessage: '',
      runnerErrorMessage: '',
      stealErrorMessage: '',
      isDeleted: false,
      isStarted: false,
      isOpenResultModal: false,
      isOpenRbiAndEernedModal: false,
      isOpenStealModal: false,
      isOpenEernedModal: false
    }
  },
  created() {
    this.game.id = Number(this.$route.params.gameId)
    this.fetchGame()
    PlayerApi.getPlayers(this.game.id)
    .then((res) => {
      this.players = res
      this.addMobPlayers()
      this.fetchAtBats()
    })
    this.fetchTeam()
  },
 watch: {
    players: function() {
      this.errorMessage = ''
      if (this.starters.length <= 9) {
        this.fields = this.defaultFields.filter((number) => number <= this.starters.length)
      } else {
        this.fields = [...this.defaultFields]
        for (let i = 0; i < (this.starters.length - 9); i++)
        this.fields.push(this.starters.length - i)
      }
    },
    atBats: function() {
      if (this.game.lineupingStatus === 0) {
        return
      }
      let nowAtBat = null
      let nowBatterId = null
      let nowPitcherId = null
      if (this.isStarted) {
        nowAtBat = this.atBats.slice(-1)[0]
        // バッター情報
        nowBatterId = nowAtBat.batterId
        this.nowBatter = this.players.filter((player) => player.id === nowBatterId)[0]
        this.nowBatter.lineupNumber = nowAtBat.lineupNumber

        // ピッチャー情報
        nowPitcherId = nowAtBat.pitcherId
        this.nowPitcher = this.players.filter((player) => player.id === nowPitcherId)[0]

        // 試合情報
        this.atBat.id = nowAtBat.id

      } else {
        // バッター情報
        nowBatterId = this.game.topLineup[0].orderDetails.slice(-1)[0].playerId
        this.nowBatter = this.players.filter((player) => player.id === nowBatterId)[0]
        this.nowBatter.lineupNumber = 1

        // ピッチャー情報
        nowPitcherId = this.game.bottomLineup.filter((lineup) => {
          return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
        })[0].orderDetails.slice(-1)[0].playerId
        this.nowPitcher = this.players.filter((player) => player.id === nowPitcherId)[0]
      }
      this.atBat.batterId = this.nowBatter.id
      this.atBat.pitcherId = this.nowPitcher.id
      this.atBat.outCount = nowAtBat === null ? 0 : nowAtBat.outCount
      this.atBat.inning = nowAtBat === null ? 1 : nowAtBat.inning
      this.atBat.topFlg = nowAtBat === null ? 1 : nowAtBat.topFlg
      this.atBat.lineupNumber = nowAtBat === null ? 1 : nowAtBat.lineupNumber

      // 走者情報
      this.atBat.firstRunnerId = nowAtBat === null ? null : nowAtBat.firstRunnerId
      this.atBat.secondRunnerId = nowAtBat === null ? null : nowAtBat.secondRunnerId
      this.atBat.thirdRunnerId = nowAtBat === null ? null : nowAtBat.thirdRunnerId
      this.setRunners()

      // 試合情報
      this.atBat.gameId = this.game.id
      this.atBat.teamId = this.game.teamId

      if (!this.isStarted) { // 試合開始一番打者の打席登録
        AtBatApi.registerAtBat(this.atBat)
        .then(() => {
          this.fetchAtBats()
        })
        .catch((error) => {
          console.log(error)
        })
      }
    }
  },
  computed: {
    commentErrors () {
      const errors = []
      if (!this.$v.atBat.comment.$dirty) return errors
      !this.$v.atBat.comment.maxLength && errors.push('コメントは200文字以内です。')
      return errors
    },
    eventCommentErrors () {
      const errors = []
      if (!this.$v.event.comment.$dirty) return errors
      !this.$v.event.comment.maxLength && errors.push('コメントは200文字以内です。')
      return errors
    }
  },
  methods: {
    saveStarters() {
      this.errorMessage = ''
      if (this.starters.length < 9) {
        this.errorMessage = 'スタメンが9人未満です。'
        return
      }
      if (this.game.topFlg) {
        this.game.topLineup = this.createOrders()
      } else {
        this.game.bottomLineup = this.createOrders()
      }
      this.game.lineupingStatus = 2
      this.updateGame()
      location.reload();
    },
    createOrders() {
      let lineup = []
      for(let i = 1; i <= this.starters.length; i++) {
        lineup.push( 
          { 
            'orderNumber': i ,
            'orderDetails': [
              {
                'fieldNumber': this.fields[(i - 1)],
                'playerId': this.starters[(i - 1)].id
              }
            ]
          }
        )
      }
      return lineup
    },
    fetchGame() {
      GameApi.getGame(this.game.id)
      .then((res) => {
        this.game = res
      })
      .catch((error) => {
        console.log(error)
      })
    },
    fetchPlayers() {
      PlayerApi.getPlayers()
      .then((res) => {
        this.players = res
      })
      .catch((error) => {
        console.log(error)
      })
    },
    fetchTeam() {
      TeamApi.getTeam()
      .then((res) => {
        this.team = res
      })
      .catch((error) => {
        console.log(error)
      })
    },
    updateGame() {
      GameApi.updateGame(this.game)
      .then(() => {
      })
      .catch((error) => {
        console.log(error)
      })
    },
    deleteGame() {
      GameApi.deleteGame(this.player.id)
      .then(() => {
        this.$router.push({ path: '/game' , query : { isDeleted: true } })
      })
      .catch((error) => {
        console.log(error)
      })
    },
    addMobPlayers() {
      if (this.players.some(player => player.id === 1000) ) return
      this.players.push(
        { 'id': 1000, 'name': 'mob1', 'image': null },  { 'id': 1001, 'name': 'mob2', 'image': null},  { 'id': 1002, 'name': 'mob3', 'image': null},  
        { 'id': 1003, 'name': 'mob4', 'image': null },  { 'id': 1004, 'name': 'mob5', 'image': null }, { 'id': 1005, 'name': 'mob6', 'image': null }, 
        { 'id': 1006, 'name': 'mob7', 'image': null },  { 'id': 1007, 'name': 'mob8', 'image': null }, { 'id': 1008, 'name': 'mob9', 'image': null },
      )
    },
    fetchAtBats() {
      AtBatApi.getAtBatsByGameId(this.game.id)
      .then((res) => {
        this.isStarted = true
        this.atBats = res
      })
      .catch((error) => {
        if (error.status === 404) {
          this.atBats = []
        } else {
          console.log(error)
        }
      })
    },
    setRunners() {
      if (this.atBat.firstRunnerId !== null) {
        this.firstRunner = this.players.filter((player) => player.id === this.atBat.firstRunnerId)[0]
      }
      if (this.atBat.secondRunnerId !== null) {
        this.secondRunner = this.players.filter((player) => player.id === this.atBat.secondRunnerId)[0]
      }
      if (this.atBat.thirdRunnerId !== null) {
        this.thirdRunner = this.players.filter((player) => player.id === this.atBat.thirdRunnerId)[0]
      }
    },
    openResultModal(val) {
      this.directionErrorMessage = ''
      this.runnerErrorMessage = ''
      this.isOpenResultModal = true
      // v-if用にセットを使う
      this.$set(this.atBat, "result", val);
      switch (val) {
        case 0: { // 1B
          this.firstRunners.push(this.nowBatter)
          if(this.firstRunner !== null) {
            this.secondRunners.push(this.firstRunner)
          }
          if(this.secondRunner !== null) {
            this.thirdRunners.push(this.secondRunner)
          }
          if(this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 1: { // 2B
          this.secondRunners.push(this.nowBatter)
          if (this.firstRunner !== null) {
            this.thirdRunners.push(this.firstRunner)
          }
          if (this.secondRunner !== null) {
            this.homeRunners.push(this.secondRunner)
          }
          if (this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 2: { // 3B
          this.thirdRunners.push(this.nowBatter)
          if (this.firstRunner !== null) {
            this.homeRunners.push(this.firstRunner)
          }
          if (this.secondRunner !== null) {
            this.homeRunners.push(this.secondRunner)
          }
          if (this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 3: { // HR
          this.homeRunners.push(this.nowBatter)
          if (this.firstRunner !== null) {
            this.homeRunners.push(this.firstRunner)
          }
          if (this.secondRunner !== null) {
            this.homeRunners.push(this.secondRunner)
          }
          if (this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 4: { // BB
          this.firstRunners.push(this.nowBatter)
          if (this.firstRunner !== null) {
            this.secondRunners.push(this.firstRunner)
          }
          if (this.firstRunner !== null && this.secondRunner !== null) {
            this.thirdRunners.push(this.secondRunner)
          }
          if (this.firstRunner !== null && this.secondRunner !== null && this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 5: { // DB
          this.firstRunners.push(this.nowBatter)
          if (this.firstRunner !== null) {
            this.secondRunners.push(this.firstRunner)
          }
          if (this.firstRunner !== null && this.secondRunner !== null) {
            this.thirdRunners.push(this.secondRunner)
          }
          if (this.firstRunner !== null && this.secondRunner !== null && this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 6: { // E
          this.firstRunners.push(this.nowBatter)
          if(this.firstRunner !== null) {
            this.secondRunners.push(this.firstRunner)
          }
          if(this.secondRunner !== null) {
            this.thirdRunners.push(this.secondRunner)
          }
          if(this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 7: { // バント
          this.outRunners.push(this.nowBatter)
          if(this.firstRunner !== null) {
            this.secondRunners.push(this.firstRunner)
          }
          if(this.secondRunner !== null) {
            this.thirdRunners.push(this.secondRunner)
          }
          if(this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 8: { // 犠牲フライ
          this.outRunners.push(this.nowBatter)
          if(this.firstRunner !== null) {
            this.secondRunners.push(this.firstRunner)
          }
          if(this.secondRunner !== null) {
            this.thirdRunners.push(this.secondRunner)
          }
          if(this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 9: { // 三振
          this.outRunners.push(this.nowBatter)
          if(this.firstRunner !== null) {
            this.firstRunners.push(this.firstRunner)
          }
          if(this.secondRunner !== null) {
            this.secondRunners.push(this.secondRunner)
          }
          if(this.thirdRunner !== null) {
            this.thirdRunners.push(this.thirdRunner)
          }
          break
        }
        case 10: { // 振り逃げ
          this.firstRunners.push(this.nowBatter)
          if(this.firstRunner !== null) {
            this.secondRunners.push(this.firstRunner)
          }
          if(this.secondRunner !== null) {
            this.thirdRunners.push(this.secondRunner)
          }
          if(this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 11: { // ゴロ
          this.outRunners.push(this.nowBatter)
          if(this.firstRunner !== null) {
            this.secondRunners.push(this.firstRunner)
          }
          if(this.secondRunner !== null) {
            this.thirdRunners.push(this.secondRunner)
          }
          if(this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 12: { // フライ
          this.outRunners.push(this.nowBatter)
          if(this.firstRunner !== null) {
            this.firstRunners.push(this.firstRunner)
          }
          if(this.secondRunner !== null) {
            this.secondRunners.push(this.secondRunner)
          }
          if(this.thirdRunner !== null) {
            this.thirdRunners.push(this.thirdRunner)
          }
          break
        }
        case 13: { // 特殊出塁
          this.firstRunners.push(this.nowBatter)
          if(this.firstRunner !== null) {
            this.secondRunners.push(this.firstRunner)
          }
          if(this.secondRunner !== null) {
            this.thirdRunners.push(this.secondRunner)
          }
          if(this.thirdRunner !== null) {
            this.homeRunners.push(this.thirdRunner)
          }
          break
        }
        case 14: { // 特殊アウト
          this.outRunners.push(this.nowBatter)
          if(this.firstRunner !== null) {
            this.firstRunners.push(this.firstRunner)
          }
          if(this.secondRunner !== null) {
            this.secondRunners.push(this.secondRunner)
          }
          if(this.thirdRunner !== null) {
            this.thirdRunners.push(this.thirdRunner)
          }
          break
        }
      }
    },
    closeResultModal() {
      this.isOpenResultModal = false
      this.$refs.hit_modal.scrollTop = 0;
      this.resetRunners()
      this.atBat.direction = null
      this.atBat.comment = null
    },
    saveResult() {
      this.directionErrorMessage = ''
      this.runnerErrorMessage = ''
      // 打球方向が必要な打撃結果の時はバリデーションあり
      if (!(this.atBat.result === 4 ||
            this.atBat.result === 5 ||
            this.atBat.result === 9 ||
            this.atBat.result === 10 ||
            this.atBat.result === 13 ||
            this.atBat.result === 14)) {
        if (this.atBat.direction === null) {
          this.directionErrorMessage = '打球方向を選択してください。'
          return
        }
      }
      if (this.firstRunners.length > 1) {
        this.runnerErrorMessage = '一塁ランナーが重複しています。'
        return
      }
      if (this.secondRunners.length > 1) {
        this.runnerErrorMessage = '二塁ランナーが重複しています。'
        return
      }
      if (this.thirdRunners.length > 1) {
        this.runnerErrorMessage = '三塁ランナーが重複しています。'
        return
      }
      if (this.atBat.outCount + this.outRunners.length > 3) {
        this.runnerErrorMessage = 'アウトの合計数が3を超えています。'
        return
      }
      // 得点がある場合は自責点・打点の確認を行う
      if (this.homeRunners.length > 0 && !this.isOpenRbiAndEernedModal) {
        if (this.atBat.result === 6 || this.atBat.result === 10) { // エラーか振り逃げの場合は打点初期値false
          this.homeRunners.filter((homeRunner) => {
            homeRunner.earnedFlg = true
            homeRunner.rbiFlg = false
          })
        } else {
          this.homeRunners.filter((homeRunner) => {
            homeRunner.earnedFlg = true
            homeRunner.rbiFlg = true
          })
        }
        this.isOpenRbiAndEernedModal = true
        return
      } else {
        this.isOpenRbiAndEernedModal = false
      }
      // 打席結果イベントの登録処理：　親イベント
      if (this.outRunners.length !== 0 || this.homeRunners.length !== 0) {
        let newEvent = {
          id: null,
          gameId: this.game.id,
          teamId: this.game.teamId,
          inning: this.atBat.inning,
          atBatId: this.atBat.id,
          resultFirstRunnerId: this.firstRunners.length !== 0 ? this.firstRunners[0].id : null,
          resultSecondRunnerId: this.secondRunners.length !== 0 ? this.secondRunners[0].id : null,
          resultThirdRunnerId: this.thirdRunners.length !== 0 ? this.thirdRunners[0].id : null,
          resultOutCount: this.atBat.outCount + this.outRunners.length,
          timing: 1 // 打撃時イベント
        }
        EventApi.registerEvent(newEvent)
        .then((res) => {
          
          // 打席結果イベントの登録処理：　得点
          this.homeRunners.filter((homeRunner) => {
            let newRun = {
              id: null,
              teamId: this.game.teamId,
              gameId: this.game.id,
              eventId: res.id,
              atBatId: this.atBat.id,
              batterId: this.atBat.batterId,
              pitcherId: this.atBat.pitcherId,
              runnerId: homeRunner.id,
              inning: this.atBat.inning,
              earnedFlg: homeRunner.earnedFlg,
              rbiFlg: homeRunner.rbiFlg
            }
            RunApi.registerRun(newRun)
            .catch((error) => {
              console.log(error)
            })
          })

          // 打席結果イベントの登録処理：　走塁死
          this.outRunners.filter((outRunner) => {
            let newRunOut = {
              id: null,
              playerId: outRunner.id,
              teamId: this.game.teamId,
              eventId: res.id
            }
            RunOutApi.registerRunOut(newRunOut)
            .catch((error) => {
              console.log(error)
            })
          })

        })
        .catch((error) => {
          console.log(error)
        })
      }
      
      // 打席結果の登録処理
      this.atBat.completeFlg = true
      AtBatApi.updateAtBat(this.atBat)
      .then(() => {
        let newAtBat = {
          gameId: this.atBat.gameId,
          inning: this.atBat.inning,
          outCount: null,
          pitcherId: this.atBat.pitcherId,
          batterId: null,
          firstRunnerId: null,
          secondRunnerId: null,
          firstRunnerId: null,
          playerChangeFlg: false,
          direction: null,
          completeFlg: false,
          comment: null,
          result: null,
          lineupNumber: null,
          topFlg: this.atBat.topFlg
        }
        const outCount = this.outRunners.length + this.atBat.outCount; // ToDo: アウトカウントの確認　イベントと打席結果の総合計
        const isChange = (outCount === 3)  // 3アウトになっていれば交代
        // 次の攻撃の打順をチェック
        if (isChange) {
          newAtBat.outCount = 0 // 攻守交替の場合はアウトカウントリセット
          if (this.atBat.inning === 1 && this.atBat.topFlg) { // 1回裏の場合は1番から
            newAtBat.lineupNumber = 1
            newAtBat.batterId = 
              this.game.bottomLineup.filter((lineup) => {
                return lineup.orderNumber === newAtBat.lineupNumber
              })[0].orderDetails.slice(-1)[0].playerId

            // イニングと表裏フラグを設定
            newAtBat.topFlg = false
            newAtBat.inning = 1          
          } else {
            const beforeAtBat = this.atBats.filter((atBat) => {
              return atBat.topFlg !== this.atBat.topFlg
            }).slice(-1)[0]
            const beforeLineup = beforeAtBat.topFlg ? this.game.topLineup : this.game.bottomLineup //打者ID取得に使うラインナップを決定
            
            if (beforeAtBat.completeFlg) { // 前回攻撃時の最終打者の攻撃が終了していれば打順を＋1
              newAtBat.lineupNumber = 
                beforeAtBat.lineupNumber < beforeLineup.length ? beforeAtBat.lineupNumber + 1 : 1
            } else {
              newAtBat.lineupNumber = beforeAtBat.lineupNumber
            }

            // バッターIDを取得する
            newAtBat.batterId = beforeLineup.filter((lineup) => {
              return lineup.orderNumber === newAtBat.lineupNumber
            })[0].orderDetails.slice(-1)[0].playerId

            // イニングと表裏フラグを設定
            newAtBat.topFlg = beforeAtBat.topFlg 
            newAtBat.inning = this.atBat.topFlg ? this.atBat.inning : (this.atBat.inning + 1)
          }
        } else {
          const beforeLineup = this.atBat.topFlg ? this.game.topLineup : this.game.bottomLineup //打者ID取得に使うラインナップを決定
          newAtBat.lineupNumber = this.atBat.lineupNumber + 1 <= beforeLineup.length ? this.atBat.lineupNumber + 1 : 1
          newAtBat.batterId = beforeLineup.filter((lineup) => {
            return lineup.orderNumber === newAtBat.lineupNumber
          })[0].orderDetails.slice(-1)[0].playerId
          // 攻撃継続の時はランナーも引き継ぐ
          newAtBat.firstRunnerId = this.firstRunners.length !== 0 ? this.firstRunners[0].id : null
          newAtBat.secondRunnerId = this.secondRunners.length !== 0 ? this.secondRunners[0].id : null
          newAtBat.thirdRunnerId = this.thirdRunners.length !== 0 ? this.thirdRunners[0].id : null
          // 継続の場合は打席のアウト数＋打撃後のアウト数がアウトカウント
          newAtBat.outCount = this.atBat.outCount + this.outRunners.length
        }
        AtBatApi.registerAtBat(newAtBat)
        .then(() => {
          this.closeResultModal()
          this.resetRunner()
          this.fetchAtBats()
        })
        .catch((error) => {
          console.log(error)
        })
      })
      .catch((error) => {
        console.log(error)
      })
    },
    resetRunners() {
      this.firstRunners = []
      this.thirdRunners = []
      this.secondRunners = []
      this.homeRunners = []
      this.outRunners = []
    },
    resetRunner() {
      this.firstRunner = null
      this.thirdRunner = null
      this.secondRunner = null
    },
    openStealModal() {
      this.isOpenStealModal = true
      if (this.firstRunner !== null) this.firstRunner.successFlg = 'null'
      if (this.secondRunner !== null) this.secondRunner.successFlg = 'null'
      if (this.thirdRunner !== null) this.thirdRunner.successFlg = 'null'
    },
    closeStealModal() {
      this.isOpenStealModal = false
      this.$refs.steal_modal.scrollTop = 0;
      this.event.comment = null
    },
    saveSteal() {
      this.stealErrorMessage = ''
      if (this.firstRunner !== null && this.firstRunner.successFlg === 'true') { // 一塁ランナーが成功したとき
        if (this.secondRunner !== null && this.secondRunner.successFlg === 'null') { // 二塁ランナーがいて企図なしの時
          this.stealErrorMessage = 'ランナーが重複しています。'
          return
        }
      }
      if (this.secondRunner !== null && this.secondRunner.successFlg === 'true') { // 二塁ランナーが成功したとき
         if (this.thirdRunner !== null && this.thirdRunner.successFlg === 'null') { // 三塁ランナーがいて企図なしの時
          this.stealErrorMessage = 'ランナーが重複しています。'
          return
        }
      }

      // 盗塁後のランナー状況を算出
      let resultFirstRunner = null
      let resultSecondRunner = null
      let resultThirdRunner = null
      let resultHomeRunner = null
      if (this.firstRunner !== null) {
        switch (this.firstRunner.successFlg) {
          case 'true': 
            this.firstRunner.successFlg = true
            resultSecondRunner = this.firstRunner
            break
          case 'false':
            this.firstRunner.successFlg = false
            break
          case 'null':
            this.firstRunner.successFlg = null
            resultFirstRunner = this.firstRunner
            break
        }
      }
      if (this.secondRunner !== null) {
        switch (this.secondRunner.successFlg) {
          case 'true': 
            this.secondRunner.successFlg = true
            resultThirdRunner = this.secondRunner
            break
          case 'false':
            this.secondRunner.successFlg = false
            break
          case 'null':
            this.secondRunner.successFlg = null
            resultSecondRunner = this.secondRunner
            break
        }
      }
      if (this.thirdRunner !== null) {
        switch (this.thirdRunner.successFlg) {
          case 'true': 
            this.thirdRunner.successFlg = true
            resultHomeRunner = this.thirdRunner
            break
          case 'false':
            this.thirdRunner.successFlg = false
            break
          case 'null':
            this.thirdRunner.successFlg = null
            resultThirdRunner = this.thirdRunner
            break
        }
      }

      // 得点がある場合は自責点の確認を行う
      if (resultHomeRunner !== null && !this.isOpenEernedModal) {
        resultHomeRunner.earnedFlg = true
        resultHomeRunner.rbiFlg = false
        this.isOpenEernedModal = true
        return
      } else {
        this.isOpenEernedModal = false
      }

      // キャッチャー情報の取得
      let catcherId
      const fieldLineup = this.atBat.topFlg ? this.game.bottomLineup : this.game.topLineup
      fieldLineup.filter((lineup) => {
        if (lineup.orderDetails.slice(-1)[0].fieldNumber === 2) {
          catcherId = lineup.orderDetails.slice(-1)[0].playerId
        }
      })

      // 盗塁企図したランナーの配列を取得
      const runners = [this.firstRunner , this.secondRunner , this.thirdRunner]
      const stealRunners = runners.filter((runner) => {
        return (runner !== null && runner.successFlg !== null)
      })

      // 盗塁後のアウトカウントを取得
      const outRunners = runners.filter((runner) => {
        return (runner !== null && runner.successFlg === false)
      })
      const outCount = this.atBat.outCount + outRunners.length
      if (outCount > 3) {
        this.stealErrorMessage = 'アウトカントが3を超えています。'
        return
      }

      // 盗塁企図が0でないときイベントの登録
      if (stealRunners.length !== 0) {
        let newEvent = {
          id: null,
          gameId: this.game.id,
          teamId: this.game.teamId,
          inning: this.atBat.inning,
          atBatId: this.atBat.id,
          resultFirstRunnerId: resultFirstRunner !== null ? resultFirstRunner.id : null,
          resultSecondRunnerId: resultSecondRunner !== null ? resultSecondRunner.id : null,
          resultThirdRunnerId: resultThirdRunner !== null ? resultThirdRunner.id : null,
          resultOutCount: outCount,
          timing: 0,
          comment: this.event.comment
        }
        EventApi.registerEvent(newEvent)
        .then((res) => {
          // 盗塁の記録
          stealRunners.filter((stealRunner) => {
            let newSteal = {
              id: null,
              eventId: res.id,
              teamId: this.game.teamId,
              runnerId: stealRunner.id,
              pitcherId: this.nowPitcher.id,
              catcherId: catcherId,
              successFlg: stealRunner.successFlg
            }
            StealApi.registerSteal(newSteal)
            .catch((error) => {
              console.log(error)
            })
          })

          // 得点の記録
          if (resultHomeRunner !== null) {
            let newRun = {
              id: null,
              teamId: this.game.teamId,
              gameId: this.game.id,
              eventId: res.id,
              atBatId: this.atBat.id,
              batterId: this.atBat.batterId,
              pitcherId: this.atBat.pitcherId,
              runnerId: resultHomeRunner.id,
              inning: this.atBat.inning,
              earnedFlg: resultHomeRunner.earnedFlg,
              rbiFlg: false
            }
            RunApi.registerRun(newRun)
            .catch((error) => {
              console.log(error)
            })
          }

          // 打席テーブルのアウトカウント・ランナーを更新
          if (outCount < 3) {
            this.atBat.firstRunnerId = resultFirstRunner !== null ? resultFirstRunner.id : null
            this.atBat.secondRunnerId = resultSecondRunner !== null ? resultSecondRunner.id : null
            this.atBat.thirdRunnerId = resultThirdRunner !== null ? resultThirdRunner.id : null
            this.atBat.outCount = outCount
            AtBatApi.updateAtBat(this.atBat)
            .then(() => {
              this.resetRunner()
              this.fetchAtBats()
            })
            .catch((error) => {
              console.log(error)
            })
          // アウトが3つの時は攻守交替・打席結果は未完了で更新
          } else {
            AtBatApi.updateAtBat(this.atBat)
            .then(() => {
              let newAtBat = {
                gameId: this.atBat.gameId,
                inning: this.atBat.inning,
                outCount: 0,
                pitcherId: null,
                batterId: null,
                firstRunnerId: null,
                secondRunnerId: null,
                firstRunnerId: null,
                playerChangeFlg: false,
                direction: null,
                completeFlg: false,
                comment: null,
                result: null,
                lineupNumber: null,
                topFlg: false,
              }
              // 次の攻撃の打順をチェック
              if (this.atBat.inning === 1 && this.atBat.topFlg) { // 1回裏の場合は1番から
                newAtBat.lineupNumber = 1
                newAtBat.batterId = 
                  this.game.bottomLineup.filter((lineup) => {
                    return lineup.orderNumber === newAtBat.lineupNumber
                  })[0].orderDetails.slice(-1)[0].playerId

                // イニングと表裏フラグを設定
                newAtBat.topFlg = false
                newAtBat.inning = 1          
              } else {
                const beforeAtBat = this.atBats.filter((atBat) => {
                  return atBat.topFlg !== this.atBat.topFlg
                }).slice(-1)[0]
                const beforeLineup = beforeAtBat.topFlg ? this.game.topLineup : this.game.bottomLineup //打者ID取得に使うラインナップを決定
                
                if (beforeAtBat.completeFlg) { // 前回攻撃時の最終打者の攻撃が終了していれば打順を＋1
                  newAtBat.lineupNumber = 
                    beforeAtBat.lineupNumber < beforeLineup.length ? beforeAtBat.lineupNumber + 1 : 1
                } else {
                  newAtBat.lineupNumber = beforeAtBat.lineupNumber
                }

                // バッターIDを取得する
                newAtBat.batterId = beforeLineup.filter((lineup) => {
                  return lineup.orderNumber === newAtBat.lineupNumber
                })[0].orderDetails.slice(-1)[0].playerId

                // イニングと表裏フラグを設定
                newAtBat.topFlg = beforeAtBat.topFlg 
                newAtBat.inning = this.atBat.topFlg ? this.atBat.inning : (this.atBat.inning + 1)
              }
              AtBatApi.registerAtBat(newAtBat)
              .then(() => {
                this.resetRunner()
                this.fetchAtBats()
              })
              .catch((error) => {
                console.log(error)
              })
            })
            .catch((error) => {
              console.log(error)
            })
          }
        })
      }
      this.closeStealModal()
    }
  }
}
</script>