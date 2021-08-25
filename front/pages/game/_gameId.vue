<template>
    <v-card
      class="mx-auto fill-width pt-7"
      max-width="640"
      flat
    >
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
                  :isReserve="true"
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
                      :isReserve="false"
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
          <v-tabs grow dark style="height: 40px;" class="mt-3 black">
            <v-tab @click="editGame()" class="black">結果入力</v-tab>
            <v-tab @click="showProcess()" class="black">試合経過</v-tab>
            <v-tab @click="showStats()" class="black">選手成績</v-tab>
          </v-tabs>
          <v-row v-if="score !== null" class="mt-2" style="width: 100%; margin: auto 0;">
            <v-col style="padding: 0 0px; width: 10%;">
              <v-simple-table dark dense style="padding: 0 0px; border-radius: 0px;" class="black">
                  <thead>
                    <tr>
                      <th class="text-left">
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
              </v-simple-table>
            </v-col>
            <v-col style="padding: 0 0px; width: 80%;">
              <v-simple-table dark dense style="padding: 0 0px; border-radius: 0px;" class="black">
                <thead>
                  <tr>
                    <th
                      v-for="topScore, idx in score.runs.topScores"
                      :key="idx"
                      class="text-center"
                    >
                      {{ idx + 1 }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      v-for="topScore, idx in score.runs.topScores"
                      :key="idx"
                      class="text-center"
                      v-bind:class="{ active: atBat.inning === (idx + 1) && atBat.topFlg }"
                    >
                      {{ score.runs.topScores[idx] !== null ? score.runs.topScores[idx].score : 0 }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      v-for="topScore, idx in score.runs.topScores"
                      :key="idx"
                      class="text-center"
                      v-bind:class="{ active: atBat.inning === (idx + 1) && !atBat.topFlg }"
                    >
                      {{ score.runs.bottomScores[idx] !== null ? score.runs.bottomScores[idx].score : 0 }}
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
            <v-col style="padding: 0 0px; width: 10%;">
              <v-simple-table dark dense style="padding: 0 0px; border-radius: 0px;" class="black">
                  <thead>
                    <tr class="text-center">
                      <th class="text-center">R</th>
                      <th class="text-center">H</th>
                      <th class="text-center">E</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="text-center">
                      <td>{{ score.runs.topScore }}</td>
                      <td>{{ score.topHit }}</td>
                      <td>{{ score.topError }}</td>
                    </tr>
                    <tr class="text-center">
                      <td>{{ score.runs.bottomScore }}</td>
                      <td>{{ score.bottomHit }}</td>
                      <td>{{ score.bottomError }}</td>
                    </tr>
                  </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
          <div v-if="nowBatter !== null && isGameEdit">
            <v-container>
              <inning-info :atBat="atBat" />
              <v-row justify="space-between" class="mt-3">
                <v-col cols="5">
                  <pitcher-info
                    :nowPitcher="nowPitcher"
                  />
                </v-col>
                <v-col cols="2" style="margin: auto 0; font-size: 30px; color: #F44336;">
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
                      v-bind:disabled="atBat.outCount === 2 ||
                        (firstRunner === null && secondRunner === null && thirdRunner === null)"
                      color="amber lighten-1"
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
                      color="blue-grey lighten-1"
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
                  v-bind:disabled="firstRunner === null && secondRunner === null && thirdRunner === null"
                  color="blue darken-4"
                  class="white--text mr-5"
                  @click="openStealModal()"
                >
                  <span>盗塁</span>
                </v-btn>
                <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind:disabled="firstRunner === null && secondRunner === null && thirdRunner === null"
                      color="teal darken-3"
                      v-bind="attrs"
                      v-on="on"
                      class="white--text mr-5"
                    >
                      <span>失策</span>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title @click="openBatteryErrorModal(false)">捕逸</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title @click="openBatteryErrorModal(true)">暴投</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title @click="openErrorModal()">エラー</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-btn
                  v-bind:disabled="firstRunner === null && secondRunner === null && thirdRunner === null"
                  color="purple lighten-2"
                  class="white--text mr-5"
                  @click="openSpecialModal()"
                >
                  <span>特殊</span>
                </v-btn>
                <v-btn
                  color="brown darken-1"
                  class="white--text"
                  @click="openFieldPlayerChangeModal()"
                >
                  <span>交代</span>
                </v-btn>
              </v-row>
              <event-info
                :eventDetails="eventDetails"
                :players="players"
                :startRunners="startRunners"
                :startOutCount="startOutCount"
              />
              <v-row
                justify="space-between"
                class="mt-5 px-2 mb-2"
                style="height: 20px"
              >
                <p
                  v-if="beforeAtBat !== null"
                  class="text-caption"
                  style="color: #90A4AE;"
                  @click="isOpenDeleteAtBatModal = true"
                >
                  前の打者へ
                </p>
                <p 
                  v-if="beforeAtBat !== null"
                  class="text-caption"
                  style="color: #90A4AE;"
                  @click="isOpenEndModal = true"
                >
                  試合を終了する
                </p>
              </v-row>
            </v-container>
          </div>
          <div v-else-if="isGameProcess">
            <div v-for="process,idx in processes" :key="idx">
                <v-subheader class="grey darken-4 white--text">{{ process.inningInfo }}</v-subheader>
                <div v-for="batterProcess, idx in process.batterProcesses" :key="idx">
                  <v-list-item-content class="grey darken-1 white--text px-2">
                    <div class="d-flex">
                      <p class="mb-0">{{ batterProcess.batter }}</p>
                      <p class="mb-0" style="color: whitesmoke;">　{{ batterProcess.situation }}</p>
                    </div>
                  </v-list-item-content>
                  <div v-if="batterProcess.beforeBattingEvents.length !== 0" class="px-2 pt-2">
                    <div class="grey lighten-2 rounded-lg px-5 py-2">
                      <div v-for="beforeBattingEvent, idx in batterProcess.beforeBattingEvents" :key="idx">
                        <v-list-item-subtitle class="event">{{ beforeBattingEvent }}</v-list-item-subtitle>
                      </div>
                    </div>
                  </div>
                  <div class="px-2 py-2">
                    <v-list-item-subtitle style="font-weight: 600;">{{ batterProcess.battingResult }}</v-list-item-subtitle>
                    <v-list-item-subtitle class="text-caption">{{ batterProcess.battingResultComment }}</v-list-item-subtitle>
                  </div>
                  <div v-if="batterProcess.afterBattingEvents.length !== 0" class="px-2 pb-2">
                    <div class="grey lighten-2 rounded-lg px-5 py-2">
                      <div v-for="afterBattingEvent, idx in batterProcess.afterBattingEvents" :key="idx">
                        <v-list-item-subtitle class="event">{{ afterBattingEvent }}</v-list-item-subtitle>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <v-fab-transition>
                <v-btn
                  color="#039BE5"
                  fab
                  dark
                  small
                  bottom
                  right
                  fixed
                  @click="$vuetify.goTo(0)"
                >
                  <v-icon>mdi-apple-keyboard-control</v-icon>
                </v-btn>
              </v-fab-transition>
          </div>
          <div v-else-if="isGameStats">
            <v-list-item-subtitle class="px-2 pt-2">打者</v-list-item-subtitle>
            <v-col style="padding: 0 0px; width: 100%;" class="pb-5">
              <v-simple-table dense fixed-header style="padding: 0 0px; border-radius: 0px;">
                <thead>
                  <tr class="text-center">
                    <th class="text-center">選手</th>
                    <th class="text-center">打席</th>
                    <th class="text-center">打数</th>
                    <th class="text-center">一</th>
                    <th class="text-center">二</th>
                    <th class="text-center">三</th>
                    <th class="text-center">本</th>
                    <th class="text-center">犠</th>
                    <th class="text-center">振</th>
                    <th class="text-center">四死</th>
                    <th class="text-center">打点</th>
                    <th class="text-center">得点</th>
                    <th class="text-center">盗</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="stat, idx in statsForBatter" :key="idx" class="text-center">
                      <td>{{ stat.name }}</td>
                      <td>{{ stat.appear }}</td>
                      <td>{{ stat.batting }}</td>
                      <td>{{ stat.hit }}</td>
                      <td>{{ stat.two }}</td>
                      <td>{{ stat.three }}</td>
                      <td>{{ stat.hr }}</td>
                      <td>{{ stat.sac }}</td>
                      <td>{{ stat.k }}</td>
                      <td>{{ stat.bb }}</td>
                      <td>{{ stat.rbi }}</td>
                      <td>{{ stat.score }}</td>
                      <td>{{ stat.steal }}</td>
                    </tr>
                </tbody>
              </v-simple-table>
            </v-col>
            <v-list-item-subtitle class="px-2 pt-2">投手</v-list-item-subtitle>
            <v-col style="padding: 0 0px; width: 100%;" class="pb-5">
              <v-simple-table dense fixed-header style="padding: 0 0px; border-radius: 0px;">
                <thead>
                  <tr class="text-center">
                    <th class="text-center">選手</th>
                    <th class="text-center">回</th>
                    <th class="text-center">失</th>
                    <th class="text-center">責</th>
                    <th class="text-center">安</th>
                    <th class="text-center">本</th>
                    <th class="text-center">四死</th>
                    <th class="text-center">振</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="stat, idx in statsForPitcher" :key="idx" class="text-center">
                      <td>{{ stat.name }}</td>
                      <td>{{ stat.inning }}</td>
                      <td>{{ stat.r }}</td>
                      <td>{{ stat.er }}</td>
                      <td>{{ stat.hit }}</td>
                      <td>{{ stat.hr }}</td>
                      <td>{{ stat.bb }}</td>
                      <td>{{ stat.k }}</td>
                    </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </div>   
        </div>       
      </div>  
      <div v-else-if="game.resultFlg">
        <v-tabs grow dark style="height: 40px;" class="mt-3 black">
          <v-tab @click="showResult()" class="black">試合結果</v-tab>
          <v-tab @click="showProcess()" class="black">試合経過</v-tab>
          <v-tab @click="showStats()" class="black">選手成績</v-tab>
        </v-tabs>
        <v-row v-if="score !== null" class="mt-2" style="width: 100%; margin: auto 0;">
          <v-col style="padding: 0 0px; width: 10%;">
            <v-simple-table dark dense style="padding: 0 0px; border-radius: 0px;" class="black">
                <thead>
                  <tr>
                    <th class="text-left">
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
            </v-simple-table>
          </v-col>
          <v-col style="padding: 0 0px; width: 80%;">
            <v-simple-table dark dense style="padding: 0 0px; border-radius: 0px;" class="black">
              <thead>
                <tr>
                  <th
                    v-for="topScore, idx in score.runs.topScores"
                    :key="idx"
                    class="text-center"
                  >
                    {{ idx + 1 }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    v-for="topScore, idx in score.runs.topScores"
                    :key="idx"
                    class="text-center"
                  >
                    {{ score.runs.topScores[idx] !== null ? score.runs.topScores[idx].score : 0 }}
                  </td>
                </tr>
                <tr>
                  <td
                    v-for="topScore, idx in score.runs.topScores"
                    :key="idx"
                    class="text-center"
                  >
                    {{ score.runs.bottomScores[idx] !== null ? score.runs.bottomScores[idx].score : 0 }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
          <v-col style="padding: 0 0px; width: 10%;">
            <v-simple-table dark dense style="padding: 0 0px; border-radius: 0px;" class="black">
                <thead>
                  <tr class="text-center">
                    <th class="text-center">R</th>
                    <th class="text-center">H</th>
                    <th class="text-center">E</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="text-center">
                    <td>{{ score.runs.topScore }}</td>
                    <td>{{ score.topHit }}</td>
                    <td>{{ score.topError }}</td>
                  </tr>
                  <tr class="text-center">
                    <td>{{ score.runs.bottomScore }}</td>
                    <td>{{ score.bottomHit }}</td>
                    <td>{{ score.bottomError }}</td>
                  </tr>
                </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
        <div v-if="isGameResult">
          <v-list-item-content class="ml-10">
            <v-list-item-title>VS {{ game.opponentTeam }}</v-list-item-title>
            <v-list-item-subtitle>日付: {{ game.date }}</v-list-item-subtitle>
            <v-list-item-subtitle>場所: {{ game.field }}</v-list-item-subtitle>
          </v-list-item-content>
          <div class="d-flex" style="justify-content: center;">
            <p
              class="text-h3 mr-3"
            >
              {{ game.topScore }} - {{ game.bottomScore }}
            </p>
            <p
              class="text-h3"
              :style="styleResult(game.result)"
              style="font-weight: normal;"
            >
              {{ formatResult(game.result) }}
            </p>
          </div>
          <div class="px-5">
            <p
              class="text-body-2 grey lighten-2 rounded-lg px-5 pb-5"
              style="white-space: pre-line;"
            >
              {{ game.comment }}
            </p>
           </div>
          <v-simple-table style="padding: 0 0px; border-radius: 0px;" class="mt-5 mx-5">
            <tbody>
              <tr class="text-center">
                <th style="width: 60px;">勝</th>
                <td>{{ resultWinningPitcher }}</td>
              </tr>
              <tr class="text-center">
                <th style="width: 60px;">負</th>
                <td>{{ resultLosingPitcher }}</td>
              </tr>
               <tr class="text-center">
                <th style="width: 60px;">S</th>
                <td>{{ resultSavePitcher }}</td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-simple-table style="padding: 0 0px; border-radius: 0px;" class="mx-5">
            <tbody>
              <tr class="text-center">
                <th style="width: 60px;">本</th>
                <td v-for="resultHomerun, idx in resultHomeruns" :key="idx">{{ resultHomerun }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </div>
        <div v-else-if="isGameProcess">
          <div v-for="process,idx in processes" :key="idx">
              <v-subheader class="grey darken-4 white--text">{{ process.inningInfo }}</v-subheader>
              <div v-for="batterProcess, idx in process.batterProcesses" :key="idx">
                <v-list-item-content class="grey darken-1 white--text px-2">
                  <div class="d-flex">
                    <p class="mb-0">{{ batterProcess.batter }}</p>
                    <p class="mb-0" style="color: whitesmoke;">　{{ batterProcess.situation }}</p>
                  </div>
                </v-list-item-content>
                <div v-if="batterProcess.beforeBattingEvents.length !== 0" class="px-2 pt-2">
                  <div class="grey lighten-2 rounded-lg px-5 py-2">
                    <div v-for="beforeBattingEvent, idx in batterProcess.beforeBattingEvents" :key="idx">
                      <v-list-item-subtitle class="event">{{ beforeBattingEvent }}</v-list-item-subtitle>
                    </div>
                  </div>
                </div>
                <div class="px-2 py-2">
                  <v-list-item-subtitle style="font-weight: 600;">{{ batterProcess.battingResult }}</v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption">{{ batterProcess.battingResultComment }}</v-list-item-subtitle>
                </div>
                <div v-if="batterProcess.afterBattingEvents.length !== 0" class="px-2 pb-2">
                  <div class="grey lighten-2 rounded-lg px-5 py-2">
                    <div v-for="afterBattingEvent, idx in batterProcess.afterBattingEvents" :key="idx">
                      <v-list-item-subtitle class="event">{{ afterBattingEvent }}</v-list-item-subtitle>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <v-fab-transition>
              <v-btn
                color="#039BE5"
                fab
                dark
                small
                bottom
                right
                fixed
                @click="$vuetify.goTo(0)"
              >
                <v-icon>mdi-apple-keyboard-control</v-icon>
              </v-btn>
            </v-fab-transition>
        </div>
        <div v-else-if="isGameStats">
          <v-list-item-subtitle class="px-2 pt-2">打者</v-list-item-subtitle>
          <v-col style="padding: 0 0px; width: 100%;" class="pb-5">
            <v-simple-table dense style="padding: 0 0px; border-radius: 0px;">
              <thead>
                <tr class="text-center">
                  <th class="text-center">選手</th>
                  <th class="text-center">打席</th>
                  <th class="text-center">打数</th>
                  <th class="text-center">一</th>
                  <th class="text-center">二</th>
                  <th class="text-center">三</th>
                  <th class="text-center">本</th>
                  <th class="text-center">犠</th>
                  <th class="text-center">振</th>
                  <th class="text-center">四死</th>
                  <th class="text-center">打点</th>
                  <th class="text-center">得点</th>
                  <th class="text-center">盗</th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="stat, idx in statsForBatter" :key="idx" class="text-center">
                    <td>{{ stat.name }}</td>
                    <td>{{ stat.appear }}</td>
                    <td>{{ stat.batting }}</td>
                    <td>{{ stat.hit }}</td>
                    <td>{{ stat.two }}</td>
                    <td>{{ stat.three }}</td>
                    <td>{{ stat.hr }}</td>
                    <td>{{ stat.sac }}</td>
                    <td>{{ stat.k }}</td>
                    <td>{{ stat.bb }}</td>
                    <td>{{ stat.rbi }}</td>
                    <td>{{ stat.score }}</td>
                    <td>{{ stat.steal }}</td>
                  </tr>
              </tbody>
            </v-simple-table>
          </v-col>
          <v-list-item-subtitle class="px-2 pt-2">投手</v-list-item-subtitle>
          <v-col style="padding: 0 0px; width: 100%;" class="pb-5">
            <v-simple-table dense fixed-header style="padding: 0 0px; border-radius: 0px;">
              <thead>
                <tr class="text-center">
                  <th class="text-center">選手</th>
                  <th class="text-center">回</th>
                  <th class="text-center">失</th>
                  <th class="text-center">責</th>
                  <th class="text-center">安</th>
                  <th class="text-center">本</th>
                  <th class="text-center">四死</th>
                  <th class="text-center">振</th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="stat, idx in statsForPitcher" :key="idx" class="text-center">
                    <td>{{ stat.name }}</td>
                    <td>{{ stat.inning }}</td>
                    <td>{{ stat.r }}</td>
                    <td>{{ stat.er }}</td>
                    <td>{{ stat.hit }}</td>
                    <td>{{ stat.hr }}</td>
                    <td>{{ stat.bb }}</td>
                    <td>{{ stat.k }}</td>
                  </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </div>   
      </div> 












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
      <v-dialog
        v-model="isOpenErrorModal"
        max-width="640"
        fullscreen
        ref="error_modal"
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
            <p class="mt-2">エラーのあった守備位置を選択してください</p>
            <hit-direction-selector
              class="mt-5"
              :direction="atBat.direction"
              @change-direction="atBat.direction=$event"
            />
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
            <p class="text-center" style="color: #FF4081">{{ directionErrorMessage }}</p>
            <p class="text-center" style="color: #FF4081">{{ runnerErrorMessage }}</p>
            <v-row justify="center">
              <v-btn
                class="mr-4 mb-4"
                color="primary"
                @click="saveError()"
              >
                確定
              </v-btn>
              <v-btn
                class="mb-4"
                @click="closeErrorModal()"
              >
                戻る
              </v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="isOpenEernedForErrorModal"
        max-width="640"
        fullscreen
      >
        <v-card>
          <v-container>
            <div>
              <p class="mt-2">得点の自責点を設定してください</p>
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
                </div>
              </div>
            </div>
            <v-row justify="center">
              <v-btn
                class="mt-8 mb-4"
                color="primary"
                @click="saveError()"
              >
                確定
              </v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="isOpenBatteryErrorModal"
        max-width="640"
        fullscreen
        ref="battery_error_modal"
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
            <p class="text-center" style="color: #FF4081">{{ runnerErrorMessage }}</p>
            <v-row justify="center">
              <v-btn
                class="mr-4 mb-4"
                color="primary"
                @click="saveBatteryError()"
              >
                確定
              </v-btn>
              <v-btn
                class="mb-4"
                @click="closeBatteryErrorModal()"
              >
                戻る
              </v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="isOpenEernedForBatteryErrorModal"
        max-width="640"
        fullscreen
      >
        <v-card>
          <v-container>
            <div>
              <p class="mt-2">得点の自責点を設定してください</p>
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
                </div>
              </div>
            </div>
            <v-row justify="center">
              <v-btn
                class="mt-8 mb-4"
                color="primary"
                @click="saveBatteryError()"
              >
                確定
              </v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="isOpenSpecialModal"
        max-width="640"
        fullscreen
        ref="special_modal"
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
            <p class="text-center" style="color: #FF4081">{{ runnerErrorMessage }}</p>
            <v-row justify="center">
              <v-btn
                class="mr-4 mb-4"
                color="primary"
                @click="saveSpecial()"
              >
                確定
              </v-btn>
              <v-btn
                class="mb-4"
                @click="closeSpecialModal()"
              >
                戻る
              </v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="isOpenEernedForSpecialModal"
        max-width="640"
        fullscreen
      >
        <v-card>
          <v-container>
            <div>
              <p class="mt-2">得点の自責点を設定してください</p>
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
                </div>
              </div>
            </div>
            <v-row justify="center">
              <v-btn
                class="mt-8 mb-4"
                color="primary"
                @click="saveSpecial()"
              >
                確定
              </v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isOpenEndModal" max-width="640">
        <v-card class="px-6 py-8">
          <v-card-text>VS 「{{ game.opponentTeam  }}」を終了します。一度終了した試合は編集できません。<br>本当に終了しますか？</v-card-text>
          <v-row justify="center">
            <v-btn color="pink lighten-2" @click="openResponsiblePitcherModal()" class="mr-4 mt-4 white--text">終了</v-btn>
            <v-btn @click="isOpenEndModal = false" class="mt-4">やめる</v-btn>
          </v-row>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isOpenDeleteAtBatModal" max-width="640">
        <v-card class="px-6 py-8">
          <v-card-text>ひとつ前の打者に戻ります。<br>入力していた盗塁、得点、失策等の情報はリセットされます<br>本当に戻りますか？</v-card-text>
          <v-row justify="center">
            <v-btn color="pink lighten-2" @click="deleteAtBat()" class="mr-4 mt-4 white--text">前の打者へ</v-btn>
            <v-btn @click="isOpenDeleteAtBatModal = false" class="mt-4">やめる</v-btn>
          </v-row>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="isOpenResponsiblePitcherModal"
        max-width="640"
        fullscreen
      >
        <v-card>
          <v-container>
            <p v-if="game.result !== 2" class="mt-2">責任投手を設定してください</p>
            <v-select
              v-if="game.result === 0"
              :items="pitchers"
              item-text="name"
              item-value="id"
              label="勝ち"
              dense
              outlined
              v-model="game.winningPitcher"
              return-object
              class="px-2"
            ></v-select>
            <v-select
              v-if="game.result === 1"
              :items="pitchers"
              item-text="name"
              item-value="id"
              label="負け"
              dense
              outlined
              v-model="game.losingPitcher"
              return-object
              class="px-2"
            ></v-select>
            <v-select
              v-if="game.result === 0"
              :items="pitchers"
              item-text="name"
              item-value="id"
              label="セーブ"
              dense
              outlined
              v-model="game.savePitcher"
              return-object
              class="px-2"
            ></v-select>
            <p class="mt-2">戦評を入力してください</p>
            <v-textarea
              v-model="game.comment"
              :error-messages="gameCommentErrors"
              :counter="1000"
              outlined
              label="戦評"
              class="mt-3 px-2"
              style="height: 150px;"
              @input="$v.game.comment.$touch()"
              @blur="$v.game.comment.$touch()"
            ></v-textarea>
            <v-row
              justify="center"
            >
              <v-btn color="pink lighten-2" @click="endGame()" class="mt-10 white--text">確定</v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="isOpenFieldPlayerChangeModal"
        max-width="640"
        fullscreen
        ref="field_change_modal"
      >
        <v-card>
          <v-container>
            <p class="mt-2">選手交代を設定してください</p>
            <v-row justify="center" class="py-3">
              <v-col cols="5">
                <p>選手一覧</p>
                <draggable v-model="nowReserves" group="starters" :animation="300" :delay="50"
                  style="padding:5px 0; height: 550px; overflow-y: scroll;"
                >
                  <lineup-list
                    v-for="nowReserve in nowReserves"
                    :key="nowReserve.id"
                    :player="nowReserve"
                    :isReserve="true"
                  />
                </draggable>
              </v-col>
              <v-col cols="7">         
                <p>出場選手</p>
                <v-row justify="center">
                  <v-col cols="9">
                    <draggable v-model="nowPlayers" group="starters" :animation="300" :delay="50" style="padding:5px 0">
                      <lineup-list
                        v-for="(player,idx) in nowPlayers"
                        :key="player.id"
                        :player="player"
                        :number="idx + 1"
                        :isReserve="false"
                      />
                    </draggable>
                  </v-col>
                  <v-col cols="3">
                    <draggable v-model="nowFields" :animation="300" :delay="50" style="padding:5px 0">
                      <field-list
                        v-for="(nowField,idx) in nowFields"
                        :key="idx"
                        :fieldNumber="nowField"
                      />
                    </draggable>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <p v-if="!validateFieldPlayerChanges" class="text-center" style="color: #FF4081">選手交代前と交代後で出場選手数が違います。</p>
            <p v-if="playerChangeErrorMessage" class="text-center" style="color: #FF4081">{{ playerChangeErrorMessage }}</p>
            <v-row justify="center" class="pt-4">
              <v-btn
                class="mr-4 mb-4"
                color="primary"
                @click="saveFieldPlayerChange()"
              >
                確定
              </v-btn>
              <v-btn
                class="mb-4"
                @click="closeFieldPlayerChangeModal()"
              >
                戻る
              </v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { maxLength } from 'vuelidate/lib/validators'
import GameApi from '@/plugins/axios/modules/game'
import PlayerApi from '@/plugins/axios/modules/player'
import PlayerChangeApi from '@/plugins/axios/modules/playerChange'
import TeamApi from '@/plugins/axios/modules/team'
import AtBatApi from '@/plugins/axios/modules/atBat'
import RunApi from '@/plugins/axios/modules/run'
import EventApi from '@/plugins/axios/modules/event'
import RunOutApi from '@/plugins/axios/modules/runOut'
import StealApi from '@/plugins/axios/modules/steal'
import SpecialApi from '@/plugins/axios/modules/special'
import ErrorApi from '@/plugins/axios/modules/error'
import BatteryErrorApi from '@/plugins/axios/modules/batteryError'
import draggable from 'vuedraggable'
import lineupList from '@/components/lineupList.vue'
import fieldList from '@/components/fieldList.vue'
import batterInfo from '@/components/batterInfo.vue'
import pitcherInfo from '@/components/pitcherInfo.vue'
import inningInfo from '@/components/inningInfo.vue'
import runnerList from '@/components/runnerList.vue'
import rbiEarnedSelector from '@/components/rbiEarnedSelector.vue'
import eventInfo from '@/components/eventInfo.vue'

export default {
  components: {
    draggable,
    lineupList,
    fieldList,
    batterInfo,
    pitcherInfo,
    inningInfo,
    runnerList,
    rbiEarnedSelector,
    eventInfo
  },
  layout: 'loggedIn',
  mixins: [validationMixin],
  validations: {
    atBat: {
      comment: { maxLength: maxLength(200) }
    },
    event: {
      comment: { maxLength: maxLength(200) }
    },
    game: {
      comment: { maxLength: maxLength(1000) }
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
        bottomLineup: null,
        winningPitcher: null,
        losingPitcher: null,
        savePitcher: null,
        comment: null
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
        completeFlg: null,
        comment: null,
        result: null,
        lineupNumber: null,
        topFlg: false
      },
      beforeAtBat: null,
      events: [],
      event: {
        comment: null
      },
      eventDetails: [],
      steals: [],
      special: {},
      error: {},
      runOuts: [],
      runs: [],
      playerChanges: [],
      batteryError: null,
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
      wpFlg: false,
      startRunners: [],
      startOutCount: null,
      pitchers: [{
        id: null,
        name: '該当なし'
      }],
      errorMessage: '',
      directionErrorMessage: '',
      runnerErrorMessage: '',
      stealErrorMessage: '',
      playerChangeErrorMessage: '',
      isDeleted: false,
      isStarted: false,
      isOpenResultModal: false,
      isOpenRbiAndEernedModal: false,
      isOpenStealModal: false,
      isOpenEernedModal: false,
      isOpenErrorModal: false,
      isOpenEernedForErrorModal: false,
      isOpenBatteryErrorModal: false,
      isOpenEernedForBatteryErrorModal: false,
      isOpenSpecialModal: false,
      isOpenEernedForSpecialModal: false,
      isOpenEndModal: false,
      isOpenDeleteAtBatModal: false,
      isOpenResponsiblePitcherModal: false,
      isGameEdit: true,
      isGameProcess: false,
      isGameStats: false,
      isGameResult: true,
      isOpenFieldPlayerChangeModal: false,
      isOpenBattingPlayerChangeModal: false,
      score: null,
      processes: [],
      statsForBatter: [],
      statsForPitcher: [],
      nowPlayers: [],
      nowFields: [],
      nowReserves: [],
      playerChanges: [],
      resultWinningPitcher: null,
      resultLosingPitcher: null,
      resultSavePitcher: null,
      resultHomeruns: []
    }
  },
  async created() {
    this.game.id = Number(this.$route.params.gameId)
    await this.fetchGame()
    await PlayerApi.getPlayers(this.game.id)
    .then(async (res) => {
      this.players = res
      this.addMobPlayers()
      await this.fetchAtBats()
    })
    .catch(async () => {
      this.players = []
      this.addMobPlayers()
      await this.fetchAtBats()
    })
    await this.fetchTeam()

    if (this.game.resultFlg) {
      await this.getResult()
    }
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
    atBats: async function() {
      this.game = await this.getGame()
      if (this.game.lineupingStatus === 0) {
        return
      }
      let nowAtBat = null
      let nowBatterId = null
      let nowPitcherId = null
      let beforeAtBat = null
      let beforeResult = null
      if (this.isStarted) {
        nowAtBat = this.atBats.slice(-1)[0]
        beforeAtBat = this.atBats.length > 1 ? this.atBats[this.atBats.length - 2] : null
        this.beforeAtBat = beforeAtBat
        if (beforeAtBat !== null) {
          try {
            const beforeResults = await EventApi.getEventsByAtBatId(beforeAtBat.id)
            beforeResult = beforeResults.slice(-1)[0]
          } catch (error) {
            if (error.status === 404) {
              beforeResult = null
            } else {
              console.log(error)
            }
          }
        }

        // バッター情報
        nowBatterId = nowAtBat.batterId
        this.nowBatter = this.players.filter((player) => player.id === nowBatterId)[0]
        this.nowBatter.lineupNumber = nowAtBat.lineupNumber

        // ピッチャー情報
        nowPitcherId = nowAtBat.pitcherId
        this.nowPitcher = this.players.filter((player) => player.id === nowPitcherId)[0]

        // 試合情報
        this.atBat.id = nowAtBat.id
        
        this.eventDetails = []
        await this.fetchEvents(this.atBat.id)
        for (const event of this.events) {
          this.eventsClere()
          const id = event.id
          if (event.eventType === 0) {
            await this.fetchSteals(id)
          }
          if (event.eventType === 1) {
            await this.fetchBatteryError(id)
          }
          if (event.eventType === 2) {
            await this.fetchError(id)
          }
          if (event.eventType === 3) {
            await this.fetchSpecial(id)
          }
          if (event.eventType === 4) {
            await this.fetchPlayerChanges(id)
          }
          await this.fetchRuns(id)
          await this.fetchRunOuts(id)
          
          this.eventDetails.push({
            event: event,
            steals: this.steals,
            runOuts: this.runOuts,
            runs: this.runs,
            batteryError: this.batteryError,
            error: this.error,
            special: this.special,
            playerChanges: this.playerChanges
          })
        }

        // スコア情報の取得
        this.score = await this.fetchScore()

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

      // 打席開始時の走者情報の取得
      if ((nowAtBat !== null && beforeAtBat !== null) && (nowAtBat.topFlg === beforeAtBat.topFlg)) {
        this.startRunners = [beforeResult.resultFirstRunnerId, beforeResult.resultSecondRunnerId, beforeResult.resultThirdRunnerId]
        this.startOutCount = beforeResult.resultOutCount
      } else {
        this.startRunners = [null, null, null]
        this.startOutCount = 0
      }

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
    },
    gameCommentErrors () {
      const errors = []
      if (!this.$v.game.comment.$dirty) return errors
      !this.$v.game.comment.maxLength && errors.push('戦評は1000文字以内です。')
      return errors
    },
    validateFieldPlayerChanges () {
      this.playerChangeErrorMessage = ''
      if (this.nowPlayers.length === this.beforeChangePlayersNumber) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async saveStarters() {
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
      await this.updateGame()
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
    async fetchGame() {
      await GameApi.getGame(this.game.id)
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
    async updateGame() {
      await GameApi.updateGame(this.game)
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
      if (this.players.some(player => player.id === 1000)) return
      this.players.push(
        { 'id': 1000, 'name': '相手1', 'image': null }, { 'id': 1001, 'name': '相手2', 'image': null }, { 'id': 1002, 'name': '相手3', 'image': null },
        { 'id': 1003, 'name': '相手4', 'image': null }, { 'id': 1004, 'name': '相手5', 'image': null }, { 'id': 1005, 'name': '相手6', 'image': null },
        { 'id': 1006, 'name': '相手7', 'image': null }, { 'id': 1007, 'name': '相手8', 'image': null }, { 'id': 1008, 'name': '相手9', 'image': null },
        { 'id': 1009, 'name': '助っ人1', 'image': null },  { 'id': 1010, 'name': '助っ人2', 'image': null }, { 'id': 1011, 'name': '助っ人3', 'image': null },  
        { 'id': 1012, 'name': '助っ人4', 'image': null },  { 'id': 1013, 'name': '助っ人5', 'image': null }, { 'id': 1014, 'name': '助っ人6', 'image': null }, 
        { 'id': 1015, 'name': '助っ人7', 'image': null },  { 'id': 1016, 'name': '助っ人8', 'image': null }, { 'id': 1017, 'name': '助っ人9', 'image': null },
      )
    },
    async fetchAtBats() {
      await AtBatApi.getAtBatsByGameId(this.game.id)
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
          if (this.secondRunner === null && this.thirdRunner !== null) {
            this.thirdRunners.push(this.thirdRunner)
          }
          if (this.firstRunner === null && this.secondRunner !== null) {
            this.secondRunners.push(this.secondRunner)
          }
          if (this.firstRunner === null && this.secondRunner !== null && this.thirdRunner !== null) {
            this.thirdRunners.push(this.thirdRunner)
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
          if (this.secondRunner === null && this.thirdRunner !== null) {
            this.thirdRunners.push(this.thirdRunner)
          }
          if (this.firstRunner === null && this.secondRunner !== null) {
            this.secondRunners.push(this.secondRunner)
          }
          if (this.firstRunner === null && this.secondRunner !== null && this.thirdRunner !== null) {
            this.thirdRunners.push(this.thirdRunner)
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
      this.$v.atBat.$touch()
      if (this.$v.atBat.$invalid) {
        return
      }
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
            rbiFlg: homeRunner.rbiFlg,
            topFlg: this.atBat.topFlg
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
      
      // 次打者の登録処理
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
          completeFlg: null,
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

            // 打者IDの取得
            newAtBat.batterId = 
              this.game.bottomLineup.filter((lineup) => {
                return lineup.orderNumber === newAtBat.lineupNumber
              })[0].orderDetails.slice(-1)[0].playerId

            // 投手IDの取得
            newAtBat.pitcherId =
              this.game.topLineup.filter((lineup) => {
                return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
              })[0].orderDetails.slice(-1)[0].playerId

            // イニングと表裏フラグを設定
            newAtBat.topFlg = false
            newAtBat.inning = 1
          } else {
            const beforeAtBat = this.atBats.filter((atBat) => {
              return atBat.topFlg !== this.atBat.topFlg
            }).slice(-1)[0]
            const batterLineup = beforeAtBat.topFlg ? this.game.topLineup : this.game.bottomLineup // 打者ID取得に使うラインナップを決定
            const pitcherLineup = beforeAtBat.topFlg ? this.game.bottomLineup : this.game.topLineup // 投手ID取得に使うラインナップを決定
            
            if (beforeAtBat.completeFlg) { // 前回攻撃時の最終打者の攻撃が終了していれば打順を＋1
              newAtBat.lineupNumber = 
                beforeAtBat.lineupNumber < batterLineup.length ? beforeAtBat.lineupNumber + 1 : 1
            } else {
              newAtBat.lineupNumber = beforeAtBat.lineupNumber
            }

            // バッターIDを取得する
            newAtBat.batterId = 
              batterLineup.filter((lineup) => {
                return lineup.orderNumber === newAtBat.lineupNumber
              })[0].orderDetails.slice(-1)[0].playerId

            // 投手IDを取得する
            newAtBat.pitcherId =
              pitcherLineup.filter((lineup) => {
                return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
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
      this.$v.event.$touch()
      if (this.$v.event.$invalid) {
        return
      }
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
            this.firstRunner.successFlg = 'true'
            resultSecondRunner = this.firstRunner
            break
          case 'false':
            this.firstRunner.successFlg = 'false'
            break
          case 'null':
            this.firstRunner.successFlg = 'null'
            resultFirstRunner = this.firstRunner
            break
        }
      }
      if (this.secondRunner !== null) {
        switch (this.secondRunner.successFlg) {
          case 'true': 
            this.secondRunner.successFlg = 'true'
            resultThirdRunner = this.secondRunner
            break
          case 'false':
            this.secondRunner.successFlg = 'false'
            break
          case 'null':
            this.secondRunner.successFlg = 'null'
            resultSecondRunner = this.secondRunner
            break
        }
      }
      if (this.thirdRunner !== null) {
        switch (this.thirdRunner.successFlg) {
          case 'true': 
            this.thirdRunner.successFlg = 'true'
            resultHomeRunner = this.thirdRunner
            break
          case 'false':
            this.thirdRunner.successFlg = 'false'
            break
          case 'null':
            this.thirdRunner.successFlg = 'null'
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
        return (runner !== null && runner.successFlg !== 'null')
      })

      // 盗塁後のアウトカウントを取得
      const outRunners = runners.filter((runner) => {
        return (runner !== null && runner.successFlg === 'false')
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
          comment: this.event.comment,
          eventType: 0
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
              successFlg: stealRunner.successFlg === 'true' ? true : false
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
              rbiFlg: false,
              topFlg: this.atBat.topFlg
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
            this.atBat.completeFlg = false
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
                completeFlg: null,
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

                // 投手IDを取得する
                newAtBat.pitcherId =
                  this.game.topLineup.filter((lineup) => {
                    return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
                  })[0].orderDetails.slice(-1)[0].playerId

                // イニングと表裏フラグを設定
                newAtBat.topFlg = false
                newAtBat.inning = 1

              } else {
                const beforeAtBat = this.atBats.filter((atBat) => {
                  return atBat.topFlg !== this.atBat.topFlg
                }).slice(-1)[0]
                const batterLineup = beforeAtBat.topFlg ? this.game.topLineup : this.game.bottomLineup // 打者ID取得に使うラインナップを決定
                const pitcherLineup = beforeAtBat.topFlg ? this.game.bottomLineup : this.game.topLineup // 投手ID取得に使うラインナップを決定
                
                if (beforeAtBat.completeFlg) { // 前回攻撃時の最終打者の攻撃が終了していれば打順を＋1
                  newAtBat.lineupNumber = 
                    beforeAtBat.lineupNumber < batterLineup.length ? beforeAtBat.lineupNumber + 1 : 1
                } else {
                  newAtBat.lineupNumber = beforeAtBat.lineupNumber
                }

                // バッターIDを取得する
                newAtBat.batterId = 
                  batterLineup.filter((lineup) => {
                    return lineup.orderNumber === newAtBat.lineupNumber
                  })[0].orderDetails.slice(-1)[0].playerId

                // 投手IDを取得する
                newAtBat.pitcherId =
                  pitcherLineup.filter((lineup) => {
                    return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
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
    },
    openErrorModal() {
      this.directionErrorMessage = ''
      this.runnerErrorMessage = ''
      this.isOpenErrorModal = true

      // ランナーをそれぞれ進塁
      if(this.firstRunner !== null) {
        this.secondRunners.push(this.firstRunner)
      }
      if(this.secondRunner !== null) {
        this.thirdRunners.push(this.secondRunner)
      }
      if(this.thirdRunner !== null) {
        this.homeRunners.push(this.thirdRunner)
      }
    },
    closeErrorModal() {
      this.isOpenErrorModal = false
      this.$refs.error_modal.scrollTop = 0;
      this.resetRunners()
      this.atBat.direction = null
      this.event.comment = null
    },
    saveError() {
      this.$v.event.$touch()
      if (this.$v.event.$invalid) {
        return
      }
      this.directionErrorMessage = ''
      this.runnerErrorMessage = ''
      if (this.atBat.direction === null) {
        this.directionErrorMessage = 'エラーのあった守備位置を選択してください。'
        return
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

      // 得点がある場合は自責点の確認を行う
      if (this.homeRunners.length > 0 && !this.isOpenEernedForErrorModal) {
        this.homeRunners.filter((homeRunner) => {
          homeRunner.earnedFlg = true
          homeRunner.rbiFlg = false
        })
        this.isOpenEernedForErrorModal = true
        return
      } else {
        this.isOpenEernedForErrorModal = false
      }

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
        timing: 0,
        comment: this.event.comment,
        eventType: 2
      }

      const errorFieldNumber = this.atBat.direction
      const homeRunners = this.homeRunners
      const outRunners = this.outRunners
      EventApi.registerEvent(newEvent)
      .then((res) => {
        // イベントの登録処理：得点
        homeRunners.filter((homeRunner) => {
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
            rbiFlg: homeRunner.rbiFlg,
            topFlg: this.atBat.topFlg
          }
          RunApi.registerRun(newRun)
          .catch((error) => {
            console.log(error)
          })
        })

        // イベントの登録処理：走塁死
        outRunners.filter((outRunner) => {
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
        
        // イベントの登録：エラー
        let newError = {
          id: null,
          teamId: this.atBat.teamId,
          eventId: res.id,
          playerId: null
        }

        // エラーした選手の取得
        const errorLineup = this.atBat.topFlg ? this.game.bottomLineup : this.game.topLineup
        newError.playerId =
          errorLineup.filter((lineup) => {
            return lineup.orderDetails.slice(-1)[0].fieldNumber === errorFieldNumber
          })[0].orderDetails.slice(-1)[0].playerId

        ErrorApi.registerError(newError)
        .catch((error) => {
          console.log(error)
        })
      })
      .catch((error) => {
        console.log(error)
      })

      // 打席テーブルのアウトカウント・ランナーを更新
      const outCount = this.atBat.outCount + this.outRunners.length
      if (outCount < 3) {
        this.atBat.firstRunnerId = this.firstRunners.length !== 0 ? this.firstRunners[0].id : null,
        this.atBat.secondRunnerId = this.secondRunners.length !== 0 ? this.secondRunners[0].id : null,
        this.atBat.thirdRunnerId = this.thirdRunners.length !== 0 ? this.thirdRunners[0].id : null,
        this.atBat.outCount = outCount
        AtBatApi.updateAtBat(this.atBat)
        .then(() => {
          this.closeErrorModal()
          this.resetRunner()
          this.fetchAtBats()
        })
        .catch((error) => {
          console.log(error)
        })

      } else {
        // アウトが3つの時は攻守交替・打席結果は未完了で更新
        this.atBat.completeFlg = false
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
            completeFlg: null,
            comment: null,
            result: null,
            lineupNumber: null,
            topFlg: false,
          }
          // 次の攻撃の打順をチェック
          if (this.atBat.inning === 1 && this.atBat.topFlg) { // 1回裏の場合は1番から
            newAtBat.lineupNumber = 1

            // 打者IDの取得
            newAtBat.batterId = 
              this.game.bottomLineup.filter((lineup) => {
                return lineup.orderNumber === newAtBat.lineupNumber
              })[0].orderDetails.slice(-1)[0].playerId

            // 投手IDの取得
            newAtBat.pitcherId =
              this.game.topLineup.filter((lineup) => {
                return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
              })[0].orderDetails.slice(-1)[0].playerId

            // イニングと表裏フラグを設定
            newAtBat.topFlg = false
            newAtBat.inning = 1

          } else {
            const beforeAtBat = this.atBats.filter((atBat) => {
              return atBat.topFlg !== this.atBat.topFlg
            }).slice(-1)[0]
            const batterLineup = beforeAtBat.topFlg ? this.game.topLineup : this.game.bottomLineup // 打者ID取得に使うラインナップを決定
            const pitcherLineup = beforeAtBat.topFlg ? this.game.bottomLineup : this.game.topLineup // 投手ID取得に使うラインナップを決定
            
            if (beforeAtBat.completeFlg) { // 前回攻撃時の最終打者の攻撃が終了していれば打順を＋1
              newAtBat.lineupNumber = 
                beforeAtBat.lineupNumber < batterLineup.length ? beforeAtBat.lineupNumber + 1 : 1
            } else {
              newAtBat.lineupNumber = beforeAtBat.lineupNumber
            }

            // バッターIDを取得する
            newAtBat.batterId = 
              batterLineup.filter((lineup) => {
                return lineup.orderNumber === newAtBat.lineupNumber
              })[0].orderDetails.slice(-1)[0].playerId

            // 投手IDを取得する
            newAtBat.pitcherId =
              pitcherLineup.filter((lineup) => {
                return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
              })[0].orderDetails.slice(-1)[0].playerId

            // イニングと表裏フラグを設定
            newAtBat.topFlg = beforeAtBat.topFlg 
            newAtBat.inning = this.atBat.topFlg ? this.atBat.inning : (this.atBat.inning + 1)
          }
          AtBatApi.registerAtBat(newAtBat)
          .then(() => {
            this.closeErrorModal()
            this.resetRunner()
            this.fetchAtBats()
          })
          .catch((error) => {
            console.log(error)
          })
        })
      }
    },
    openBatteryErrorModal(val) {
      this.isOpenBatteryErrorModal = true
      this.runnerErrorMessage = ''
      this.wpFlg = val

      // ランナーをそれぞれ進塁
      if(this.firstRunner !== null) {
        this.secondRunners.push(this.firstRunner)
      }
      if(this.secondRunner !== null) {
        this.thirdRunners.push(this.secondRunner)
      }
      if(this.thirdRunner !== null) {
        this.homeRunners.push(this.thirdRunner)
      }
    },
    closeBatteryErrorModal() {
      this.isOpenBatteryErrorModal = false
      this.$refs.battery_error_modal.scrollTop = 0;
      this.resetRunners()
      this.event.comment = null
    },
    saveBatteryError() {
      this.$v.event.$touch()
      if (this.$v.event.$invalid) {
        return
      }
      this.runnerErrorMessage = ''
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
      // 得点がある場合は自責点の確認を行う
      if (this.homeRunners.length > 0 && !this.isOpenEernedForBatteryErrorModal) {
        this.homeRunners.filter((homeRunner) => {
          homeRunner.earnedFlg = true
          homeRunner.rbiFlg = false
        })
        this.isOpenEernedForBatteryErrorModal = true
        return
      } else {
        this.isOpenEernedForBatteryErrorModal = false
      }

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
        timing: 0,
        comment: this.event.comment,
        eventType: 1
      }
      const homeRunners = this.homeRunners
      const outRunners = this.outRunners
      EventApi.registerEvent(newEvent)
      .then((res) => {

        // イベントの登録処理：得点
        homeRunners.filter((homeRunner) => {
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
            rbiFlg: homeRunner.rbiFlg,
            topFlg: this.atBat.topFlg
          }
          RunApi.registerRun(newRun)
          .catch((error) => {
            console.log(error)
          })
        })

        // イベントの登録処理：走塁死
        outRunners.filter((outRunner) => {
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

        // イベントの登録：バッテリーエラー
        let newBatteryError = {
          id: null,
          teamId: this.atBat.teamId,
          eventId: res.id,
          pitcherId: this.nowPitcher.id,
          catcherId: null,
          wpFlg: this.wpFlg
        }

        // キャッチャーIDの取得
        const fieldLineup = this.atBat.topFlg ? this.game.bottomLineup : this.game.topLineup
        fieldLineup.filter((lineup) => {
          if (lineup.orderDetails.slice(-1)[0].fieldNumber === 2) {
            newBatteryError.catcherId = lineup.orderDetails.slice(-1)[0].playerId
          }
        })

        BatteryErrorApi.registerBatteryError(newBatteryError)
        .catch((error) => {
          console.log(error)
        })
      })
      .catch((error) => {
        console.log(error)
      })

      // 打席テーブルのアウトカウント・ランナーを更新
      const outCount = this.atBat.outCount + this.outRunners.length
      if (outCount < 3) {
        this.atBat.firstRunnerId = this.firstRunners.length !== 0 ? this.firstRunners[0].id : null,
        this.atBat.secondRunnerId = this.secondRunners.length !== 0 ? this.secondRunners[0].id : null,
        this.atBat.thirdRunnerId = this.thirdRunners.length !== 0 ? this.thirdRunners[0].id : null,
        this.atBat.outCount = outCount
        AtBatApi.updateAtBat(this.atBat)
        .then(() => {
          this.closeBatteryErrorModal()
          this.resetRunner()
          this.fetchAtBats()
        })
        .catch((error) => {
          console.log(error)
        })

      } else {
        // アウトが3つの時は攻守交替・打席結果は未完了で更新
        this.atBat.completeFlg = false
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
            completeFlg: null,
            comment: null,
            result: null,
            lineupNumber: null,
            topFlg: false,
          }
          // 次の攻撃の打順をチェック
          if (this.atBat.inning === 1 && this.atBat.topFlg) { // 1回裏の場合は1番から
            newAtBat.lineupNumber = 1

            // 打者IDの取得
            newAtBat.batterId = 
              this.game.bottomLineup.filter((lineup) => {
                return lineup.orderNumber === newAtBat.lineupNumber
              })[0].orderDetails.slice(-1)[0].playerId

            // 投手IDの取得
            newAtBat.pitcherId =
              this.game.topLineup.filter((lineup) => {
                return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
              })[0].orderDetails.slice(-1)[0].playerId

            // イニングと表裏フラグを設定
            newAtBat.topFlg = false
            newAtBat.inning = 1

          } else {
            const beforeAtBat = this.atBats.filter((atBat) => {
              return atBat.topFlg !== this.atBat.topFlg
            }).slice(-1)[0]
            const batterLineup = beforeAtBat.topFlg ? this.game.topLineup : this.game.bottomLineup // 打者ID取得に使うラインナップを決定
            const pitcherLineup = beforeAtBat.topFlg ? this.game.bottomLineup : this.game.topLineup // 投手ID取得に使うラインナップを決定
            
            if (beforeAtBat.completeFlg) { // 前回攻撃時の最終打者の攻撃が終了していれば打順を＋1
              newAtBat.lineupNumber = 
                beforeAtBat.lineupNumber < batterLineup.length ? beforeAtBat.lineupNumber + 1 : 1
            } else {
              newAtBat.lineupNumber = beforeAtBat.lineupNumber
            }

            // バッターIDを取得する
            newAtBat.batterId = 
              batterLineup.filter((lineup) => {
                return lineup.orderNumber === newAtBat.lineupNumber
              })[0].orderDetails.slice(-1)[0].playerId

            // 投手IDを取得する
            newAtBat.pitcherId =
              pitcherLineup.filter((lineup) => {
                return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
              })[0].orderDetails.slice(-1)[0].playerId

            // イニングと表裏フラグを設定
            newAtBat.topFlg = beforeAtBat.topFlg 
            newAtBat.inning = this.atBat.topFlg ? this.atBat.inning : (this.atBat.inning + 1)
          }
          AtBatApi.registerAtBat(newAtBat)
          .then(() => {
            this.closeBatteryErrorModal()
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
    },
    openSpecialModal() {
      this.isOpenSpecialModal = true
      this.runnerErrorMessage = ''

      // ランナーをそれぞれ進塁
      if(this.firstRunner !== null) {
        this.secondRunners.push(this.firstRunner)
      }
      if(this.secondRunner !== null) {
        this.thirdRunners.push(this.secondRunner)
      }
      if(this.thirdRunner !== null) {
        this.homeRunners.push(this.thirdRunner)
      }
    },
    closeSpecialModal() {
      this.isOpenSpecialModal = false
      this.$refs.special_modal.scrollTop = 0;
      this.resetRunners()
      this.event.comment = null
    },
    saveSpecial() {
      this.$v.event.$touch()
      if (this.$v.event.$invalid) {
        return
      }
      this.runnerErrorMessage = ''
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
      // 得点がある場合は自責点の確認を行う
      if (this.homeRunners.length > 0 && !this.isOpenEernedForSpecialModal) {
        this.homeRunners.filter((homeRunner) => {
          homeRunner.earnedFlg = true
          homeRunner.rbiFlg = false
        })
        this.isOpenEernedForSpecialModal = true
        return
      } else {
        this.isOpenEernedForSpecialModal = false
      }

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
        timing: 0,
        comment: this.event.comment,
        eventType: 3
      }
      const homeRunners = this.homeRunners
      const outRunners = this.outRunners
      EventApi.registerEvent(newEvent)
      .then((res) => {

        // イベントの登録処理：得点
        homeRunners.filter((homeRunner) => {
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
            rbiFlg: homeRunner.rbiFlg,
            topFlg: this.atBat.topFlg
          }
          RunApi.registerRun(newRun)
          .catch((error) => {
            console.log(error)
          })
        })

        // イベントの登録処理：走塁死
        outRunners.filter((outRunner) => {
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

        // イベントの登録処理：特殊
        let newSpecial = {
          id: null,
          teamId: this.game.teamId,
          eventId: res.id
        }
        SpecialApi.registerSpecial(newSpecial)
        .catch((error) => {
          console.log(error)
        })
      })
      .catch((error) => {
        console.log(error)
      })

      // 打席テーブルのアウトカウント・ランナーを更新
      const outCount = this.atBat.outCount + this.outRunners.length
      if (outCount < 3) {
        this.atBat.firstRunnerId = this.firstRunners.length !== 0 ? this.firstRunners[0].id : null,
        this.atBat.secondRunnerId = this.secondRunners.length !== 0 ? this.secondRunners[0].id : null,
        this.atBat.thirdRunnerId = this.thirdRunners.length !== 0 ? this.thirdRunners[0].id : null,
        this.atBat.outCount = outCount
        AtBatApi.updateAtBat(this.atBat)
        .then(() => {
          this.closeSpecialModal()
          this.resetRunner()
          this.fetchAtBats()
        })
        .catch((error) => {
          console.log(error)
        })

      } else {
        // アウトが3つの時は攻守交替・打席結果は未完了で更新
        this.atBat.completeFlg = false
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
            completeFlg: null,
            comment: null,
            result: null,
            lineupNumber: null,
            topFlg: false,
          }
          // 次の攻撃の打順をチェック
          if (this.atBat.inning === 1 && this.atBat.topFlg) { // 1回裏の場合は1番から
            newAtBat.lineupNumber = 1

            // 打者IDの取得
            newAtBat.batterId = 
              this.game.bottomLineup.filter((lineup) => {
                return lineup.orderNumber === newAtBat.lineupNumber
              })[0].orderDetails.slice(-1)[0].playerId

            // 投手IDの取得
            newAtBat.pitcherId =
              this.game.topLineup.filter((lineup) => {
                return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
              })[0].orderDetails.slice(-1)[0].playerId

            // イニングと表裏フラグを設定
            newAtBat.topFlg = false
            newAtBat.inning = 1

          } else {
            const beforeAtBat = this.atBats.filter((atBat) => {
              return atBat.topFlg !== this.atBat.topFlg
            }).slice(-1)[0]
            const batterLineup = beforeAtBat.topFlg ? this.game.topLineup : this.game.bottomLineup // 打者ID取得に使うラインナップを決定
            const pitcherLineup = beforeAtBat.topFlg ? this.game.bottomLineup : this.game.topLineup // 投手ID取得に使うラインナップを決定
            
            if (beforeAtBat.completeFlg) { // 前回攻撃時の最終打者の攻撃が終了していれば打順を＋1
              newAtBat.lineupNumber = 
                beforeAtBat.lineupNumber < batterLineup.length ? beforeAtBat.lineupNumber + 1 : 1
            } else {
              newAtBat.lineupNumber = beforeAtBat.lineupNumber
            }

            // バッターIDを取得する
            newAtBat.batterId = 
              batterLineup.filter((lineup) => {
                return lineup.orderNumber === newAtBat.lineupNumber
              })[0].orderDetails.slice(-1)[0].playerId

            // 投手IDを取得する
            newAtBat.pitcherId =
              pitcherLineup.filter((lineup) => {
                return lineup.orderDetails.slice(-1)[0].fieldNumber === 1
              })[0].orderDetails.slice(-1)[0].playerId

            // イニングと表裏フラグを設定
            newAtBat.topFlg = beforeAtBat.topFlg 
            newAtBat.inning = this.atBat.topFlg ? this.atBat.inning : (this.atBat.inning + 1)
          }
          AtBatApi.registerAtBat(newAtBat)
          .then(() => {
            this.closeSpecialModal()
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
    },
    async fetchSteals(eventId) {
      try {
        this.steals = await StealApi.getStealsByEventId(eventId)
      } catch (error) {
        if (error.status === 404) {
          this.steals = []
        } else {
          console.log(error)
        }
      }
    },
    async fetchSpecial(eventId) {
      try {
        this.special = await SpecialApi.getSpecialByEventId(eventId)
      } catch (error) {
        if (error.status === 404) {
          this.special = {}
        } else {
          console.log(error)
        }
      }
    },
    async fetchBatteryError(eventId) {
      try {
        const res= await BatteryErrorApi.getBatteryErrorByEventId(eventId)
        this.batteryError = res
      } catch (error) {
        if (error.status === 404) {
          this.batteryError = {}
        } else {
          console.log(error)
        }
      }
    },
    async fetchError(eventId) {
      try {
        this.error = await ErrorApi.getErrorByEventId(eventId)
      } catch (error) {
        if (error.status === 404) {
          this.error = {}
        } else {
          console.log(error)
        }
      }
    },
    async fetchRuns(eventId) {
      try {
       this.runs = await RunApi.getRunsByEventId(eventId)
      } catch (error) {
        if (error.status === 404) {
          this.runs = []
        } else {
          console.log(error)
        }
      }
    },
    async fetchRunOuts(eventId) {
      try{
        this.runOuts = await RunOutApi.getRunOutsByEventId(eventId)
      } catch (error) {
        if (error.status === 404) {
          this.runOuts = []
        } else {
          console.log(error)
        }
      }
    },
    async fetchPlayerChanges(eventId) {
      try {
       this.playerChanges = await PlayerChangeApi.getPlayerChangesByEventId(eventId)
      } catch (error) {
        if (error.status === 404) {
          this.playerChanges = []
        } else {
          console.log(error)
        }
      }
    },
    async fetchEvents(atBatId) {
      try {
        this.events = await EventApi.getEventsByAtBatId(atBatId)
      } catch (error) {
        if (error.status === 404) {
          this.events = []
        } else {
          console.log(error)
        }
      }
    },
    eventsClere() {
      this.runs = []
      this.runOuts = []
      this.special = {}
      this.betteryError = {}
      this.error = {}
      this.steals = []
    },
    async openResponsiblePitcherModal() {
      
      try {
        const score = await RunApi.getRunsByGameId(this.game.id)
        this.game.topScore = score.topScore
        this.game.bottomScore = score.bottomScore
        if (this.game.topFlg) {
          if (score.topScore > score.bottomScore) {
            this.game.result = 0
          } else if (score.topScore < score.bottomScore) {
            this.game.result = 1
          } else {
            this.game.result = 2
          }
        } else {
          if (score.topScore > score.bottomScore) {
            this.game.result = 1
          } else if (score.topScore < score.bottomScore) {
            this.game.result = 0
          } else {
            this.game.result = 2
          }
        }
        this.game.resultFlg = true
        this.game.inning = this.atBat.inning

        // 登板投手の取得　勝ち用と負け用
        let pitchers = []
        const lineups = this.game.topFlg ? this.game.topLineup : this.game.bottomLineup
        lineups.filter((lineup) => {
          lineup.orderDetails.filter((orderDetail) => {
            if (orderDetail.fieldNumber === 1) {
              pitchers.push(orderDetail.playerId)
            }
          })
        })
        pitchers = [...new Set(pitchers)]; // 重複を削除

        pitchers.filter((pitcherId) => {
          this.players.filter((player) => {
            if (player.id === pitcherId)
            this.pitchers.push({
              id: pitcherId,
              name: player.name
            })
            return
          })
        })

        this.isOpenResponsiblePitcherModal = true
        this.isOpenEndModal = false
      } catch (error) {
        console.log(error)
        this.isOpenResponsiblePitcherModal = false
        location.reload();
      }
    },
    async endGame() {
      this.$v.game.$touch()
      if (this.$v.game.$invalid) {
        return
      }
      try {
        await GameApi.updateGame(this.game)
      } catch (error) {
        console.log(error)
        this.isOpenResponsiblePitcherModal = false
        location.reload();
      }
      this.isOpenResponsiblePitcherModal = false
      location.reload();
    },
    async deleteAtBat() {
      try {
        await AtBatApi.deleteAtBat(this.beforeAtBat, this.atBat.id)
      } catch(error) {
        console.log(error)
      }
      this.isOpenDeleteAtBatModal = false
      location.reload();
    },
    async fetchScore() {
      try {
        return await GameApi.getScore(this.game.id) 
      } catch(error) {
        console.log(error)
      }
    },
    editGame() {
      this.isGameEdit = true
      this.isGameProcess = false
      this.isGameStats = false
    },
    async showProcess() {
      this.isGameEdit = false
      this.isGameResult = false
      this.isGameProcess = true
      this.isGameStats = false
      await this.fetchProcesses()
    },
    async showStats() {
      this.isGameEdit = false
      this.isGameResult = false
      this.isGameProcess = false
      this.isGameStats = true
      await this.fetchStats()
    },
    showResult() {
      this.isGameResult = true
      this.isGameProcess = false
      this.isGameStats = false
    },
    async fetchProcesses() {
      try {
        this.processes = await GameApi.getProcess(this.game.id) 
      } catch(error) {
        console.log(error)
      }
    },
    async fetchStats() {
      try {
        this.statsForBatter = await GameApi.getStatsForBatter(this.game.id)
        this.statsForPitcher = await GameApi.getStatsForPitcher(this.game.id)
      } catch(error) {
        console.log(error)
      }
    },
    async openFieldPlayerChangeModal() {
      this.nowPlayers = []
      this.nowFields = []
      this.nowReserves = []
      const game = await this.getGame()
      const lineups = game.topFlg ? game.topLineup : game.bottomLineup
      let nowPlayerIds = []
      lineups.filter((lineup) => {
        nowPlayerIds.push(lineup.orderDetails.slice(-1)[0].playerId)        
        this.nowFields.push(lineup.orderDetails.slice(-1)[0].fieldNumber)        
      })

      nowPlayerIds.filter((nowPlayerId) => {
        this.players.filter((player) => {
          if (player.id === nowPlayerId) {
            this.nowPlayers.push(player)
          }
        })
      })

      this.players.filter((player) => {
        if (!nowPlayerIds.includes(player.id)) {
          this.nowReserves.push(player)
        }
      })

      console.log(this.nowReserves)

      this.beforeChangePlayersNumber = this.nowPlayers.length //　出場選手数の把握
      this.isOpenFieldPlayerChangeModal = true
    },
    closeFieldPlayerChangeModal() {
      this.isOpenFieldPlayerChangeModal = false
      this.playerChangeErrorMessage = ''
      this.$refs.field_change_modal.scrollTop = 0;
    },
    async getGame() {
      try {
        return await GameApi.getGame(this.game.id)
      } catch (error) {
        console.log(error)
      }
    },
    async saveFieldPlayerChange() {
      if (!this.validateFieldPlayerChanges) {
        return
      }
      this.playerChangeErrorMessage = ''
      try {
        const game = await this.getGame()
        const lineup = game.topFlg ? game.topLineup : game.bottomLineup
        let newLineup = [...lineup]
        for (let i = 0; i < lineup.length; i++) {
          newLineup[i].orderDetails.push({
            'playerId' : this.nowPlayers[i].id,
            'fieldNumber' : this.nowFields[i]
          })
        }
        if (this.game.topFlg) {
          this.game.topLineup = newLineup
        } else {
          this.game.bottomLineup = newLineup
        }

        // 選手交代・守備交代がない場合はエラー
        let isChanged = false;
        newLineup.filter((lineup) => {
          if (lineup.orderDetails.slice(-1)[0].playerId !== lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
            || lineup.orderDetails.slice(-1)[0].fieldNumber !== lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber) {
            isChanged = true
          }
        })
        if (!isChanged) {
          this.playerChangeErrorMessage='選手交代がありません。'
          return
        }

        if (this.game.topFlg === this.atBat.topFlg) { // 攻撃中   
          newLineup.filter((lineup) => {
            if ((this.atBat.lineupNumber === lineup.orderNumber)
              && (lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber === lineup.orderDetails.slice(-1)[0].fieldNumber)) { // 代打の場合
              return
            } else if ((this.atBat.firstRunnerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId)
              || (this.atBat.secondRunnerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId)
              || (this.atBat.thirdRunnerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId)) { // 代走の場合
              return
            } else {
              if (lineup.orderDetails.slice(-1)[0].playerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                && lineup.orderDetails.slice(-1)[0].fieldNumber === lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber) {
                return
              } else {
              this.playerChangeErrorMessage = '不正な選手交代です。'
              throw 'Invalid Player Change!';
              }
            }
          })
        }
        let newEvent = {
          id: null,
          gameId: this.game.id,
          teamId: this.game.teamId,
          inning: this.atBat.inning,
          atBatId: this.atBat.id,
          resultFirstRunnerId: this.atBat.firstRunnerId,
          resultSecondRunnerId: this.atBat.secondRunnerId,
          resultThirdRunnerId: this.atBat.thirdRunnerId,
          resultOutCount: this.atBat.outCount,
          eventType: 4,
          comment: null,
          timing: 0 // 打撃前イベント
        }

        newLineup.filter((lineup) => {
          if (this.game.topFlg === this.atBat.topFlg) { // 攻撃中
            if (this.atBat.firstRunnerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId) { // 一塁の代走
              newEvent.resultFirstRunnerId = lineup.orderDetails.slice(-1)[0].playerId
            } else if (this.atBat.secondRunnerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId) { // 二塁の代走
              newEvent.resultSecondRunnerId = lineup.orderDetails.slice(-1)[0].playerId
            } else if (this.atBat.thirdRunnerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId) { // 三塁の代走
              newEvent.resultThirdRunnerId = lineup.orderDetails.slice(-1)[0].playerId
            }
          }
        })

        EventApi.registerEvent(newEvent)
        .then((res) => {
          newLineup.filter(async (lineup) => {
            let playerChange = {}
            playerChange.gameId = this.game.id
            playerChange.teamId = this.game.teamId
            playerChange.atBatId = this.atBat.id

            if (this.game.topFlg === this.atBat.topFlg) { // 攻撃中
              if ((this.atBat.lineupNumber === lineup.orderNumber)
                && (lineup.orderDetails.slice(-1)[0].playerId !== lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId)) { // 代打の場合
                playerChange.changeStatus = 2
                playerChange.outPlayerId = lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                playerChange.inPlayerId = lineup.orderDetails.slice(-1)[0].playerId
                playerChange.beforeField = lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber
                playerChange.afterField = lineup.orderDetails.slice(-1)[0].fieldNumber
                this.atBat.batterId = lineup.orderDetails.slice(-1)[0].playerId
              } else if (this.atBat.firstRunnerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                && this.atBat.firstRunnerId !== lineup.orderDetails.slice(-1)[0].playerId) { // 一塁の代走
                playerChange.changeStatus = 3
                playerChange.outPlayerId = lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                playerChange.inPlayerId = lineup.orderDetails.slice(-1)[0].playerId
                playerChange.beforeField = lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber
                playerChange.afterField = lineup.orderDetails.slice(-1)[0].fieldNumber
              } else if (this.atBat.secondRunnerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                && this.atBat.secondRunnerId !== lineup.orderDetails.slice(-1)[0].playerId) { // 二塁の代走
                playerChange.changeStatus = 3
                playerChange.outPlayerId = lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                playerChange.inPlayerId = lineup.orderDetails.slice(-1)[0].playerId
                playerChange.beforeField = lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber
                playerChange.afterField = lineup.orderDetails.slice(-1)[0].fieldNumber
              } else if (this.atBat.thirdRunnerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                && this.atBat.thirdRunnerId !== lineup.orderDetails.slice(-1)[0].playerId) { // 三塁の代走
                playerChange.changeStatus = 3
                playerChange.outPlayerId = lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                playerChange.inPlayerId = lineup.orderDetails.slice(-1)[0].playerId
                playerChange.beforeField = lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber
                playerChange.afterField = lineup.orderDetails.slice(-1)[0].fieldNumber
              } else {
                return
              }
            } else {
              if (lineup.orderDetails.slice(-1)[0].playerId === lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId) { // 選手交代なし
                if (lineup.orderDetails.slice(-1)[0].fieldNumber === lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber) { // 守備変更なし
                  return
                } else if (lineup.orderDetails.slice(-1)[0].fieldNumber === 1) { // 守備変更あり投手
                  playerChange.changeStatus = 0
                  playerChange.outPlayerId = lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                  playerChange.inPlayerId = lineup.orderDetails.slice(-1)[0].playerId
                  playerChange.beforeField = lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber
                  playerChange.afterField = lineup.orderDetails.slice(-1)[0].fieldNumber
                  this.atBat.pitcherId = lineup.orderDetails.slice(-1)[0].playerId
                } else { //　守備変更あり投手以外
                  playerChange.changeStatus = 1
                  playerChange.outPlayerId = lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                  playerChange.inPlayerId = lineup.orderDetails.slice(-1)[0].playerId
                  playerChange.beforeField = lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber
                  playerChange.afterField = lineup.orderDetails.slice(-1)[0].fieldNumber
                }
              } else if (lineup.orderDetails.slice(-1)[0].fieldNumber === 1) { // 守備交代 選手交代あり　かつ　ピッチャー交代
                playerChange.changeStatus = 0
                playerChange.outPlayerId = lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                playerChange.inPlayerId = lineup.orderDetails.slice(-1)[0].playerId
                playerChange.beforeField = lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber
                playerChange.afterField = lineup.orderDetails.slice(-1)[0].fieldNumber
                this.atBat.pitcherId = lineup.orderDetails.slice(-1)[0].playerId
              } else { // 選手交代あり　かつ　ピッチャー以外の交代
                playerChange.changeStatus = 1
                playerChange.outPlayerId = lineup.orderDetails[(lineup.orderDetails.length - 2)].playerId
                playerChange.inPlayerId = lineup.orderDetails.slice(-1)[0].playerId
                playerChange.beforeField = lineup.orderDetails[(lineup.orderDetails.length - 2)].fieldNumber
                playerChange.afterField = lineup.orderDetails.slice(-1)[0].fieldNumber
              }
            }
            playerChange.eventId = res.id
            PlayerChangeApi.registerPlayerChange(playerChange)
          })
          GameApi.updateGame(this.game)
          this.atBat.playerChangeFlg = true
          this.atBat.firstRunnerId = newEvent.resultFirstRunnerId
          this.atBat.secondRunnerId = newEvent.resultSecondRunnerId
          this.atBat.thirdRunnerId = newEvent.resultThirdRunnerId
          AtBatApi.updateAtBat(this.atBat)
          .then(() => {
            this.fetchAtBats()
            this.isOpenFieldPlayerChangeModal = false
          })
        })
        .catch((error) => {
          console.log(error)
        })
      } catch (error) {
        console.log(error)
      }
    },
    getResult() {
      this.players.filter((player) => {
        if (player.id === this.game.winningPitcher) {
          this.resultWinningPitcher = player.name
        }
        if (player.id === this.game.losingPiticehr) {
          this.resultLosingPitcher = player.name
        }
        if (player.id === this.game.savePitcher) {
          this.resultSavePitcher = player.name
        }
      })

      let resultHomerunIds = []
      this.atBats.filter((atBat) => {
        if (atBat.topFlg === this.game.topFlg) {
          if (atBat.result === 3) {
            resultHomerunIds.push(atBat.batterId)
          }
        }
      })

      this.players.filter((player) => {
        if (resultHomerunIds.includes(player.id)) {
          this.resultHomeruns.push(player.name)
        }
      })
    },
    formatResult(result) {
      if (result === 0) {
        return 'Win'
      } else if (result === 1) {
        return 'Lose'
      } else {
        return 'Draw'
      }
    },
    styleResult(result) {
      if (result === 0) {
        return 'color: #D81B60'
      } else if (result === 1) {
        return 'color: #0D47A1'
      } else {
        return 'color: #C0CA33'
      }
    }
  }
}
</script>

<style scoped>
.active {
  background-color: #F9A825;
  border-radius: 5px;
}
.event {
  flex: 1 1 100%;
  white-space: pre-wrap;
}
</style>
