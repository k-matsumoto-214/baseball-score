<template>
  <v-expansion-panels>
    <v-expansion-panel
      v-for="(eventDetail, idx) in reverseEventDetails"
      :key="idx"
    >
      <v-expansion-panel-header>
        <div class="d-flex">
          <p class="pr-2 text-caption" style="margin: auto 0;">{{ reverseEventDetails.length - idx + 1 }}</p>
          <p class="pr-2 text-caption" style="margin: auto 0;">{{ eventName(eventDetail) }}</p>
          <v-row justify="end">
            <div class="d-flex pr-5 text-caption" style="margin: auto 0; color: #F50057;">
              {{ outCount(eventDetail) }} 死
            </div>
            <div class="d-flex pr-5 text-caption" style="margin: auto 0; min-width: 70px; color: #42A5F5;">
              <p style="margin: auto 0;">{{ eventRunner(eventDetail) }}</p>
            </div>
          </v-row>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item-subtitle v-text="eventDetail.event.comment" class="text-caption pb-2"></v-list-item-subtitle>
        <div class="grey lighten-3 rounded-lg">
          <div v-if="eventDetail.steals.length !== 0">
            <div v-for="steal in eventDetail.steals" :key="steal.id">
              <div class="d-flex px-5">
                <v-list-item-content>
                  <v-list-item-title v-text="runnerName(steal.runnerId)" class="text-caption"></v-list-item-title>
                </v-list-item-content>
                <div class="d-flex">
                  <p v-if="steal.successFlg" style="margin: auto 0; color: #42A5F5;" class="text-caption">
                    盗塁成功
                  </p>
                  <p v-if="!steal.successFlg" style="margin: auto 0; color: #F50057;" class="text-caption">
                    盗塁失敗
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="eventDetail.runs.length !== 0">
            <div v-for="run in eventDetail.runs" :key="run.id">
              <div class="d-flex px-5">
                <v-list-item-content>
                  <v-list-item-title v-text="runName(run)" class="text-caption"></v-list-item-title>
                </v-list-item-content>
                <div class="d-flex">
                  <p style="margin: auto 0; color: #42A5F5;" class="text-caption">
                    ホームイン
                  </p>
                  <p style="margin: auto 0; color: #42A5F5;" class="text-caption pl-3">
                    + 1点
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="eventDetail.runOuts.length !== 0">
            <div v-for="runOut in eventDetail.runOuts" :key="runOut.id">
              <div class="d-flex px-5">
                <v-list-item-content>
                  <v-list-item-title v-text="runName(runOut)" class="text-caption"></v-list-item-title>
                </v-list-item-content>
                <p style="margin: auto 0; color: #F50057;" class="text-caption">
                  走塁死
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="eventDetail.event.resultFirstRunnerId !== null" class="d-flex px-3">
          <v-list-item-avatar>
            <v-img :src="runnerImage(eventDetail.event.resultFirstRunnerId)"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="runnerName(eventDetail.event.resultFirstRunnerId)" style="margin-left: 5px"></v-list-item-title>
          </v-list-item-content>
          <p style="margin: auto 0;">
          　一塁
          </p>
        </div>
        <div v-if="eventDetail.event.resultSecondRunnerId !== null" class="d-flex px-3">
          <v-list-item-avatar>
            <v-img :src="runnerImage(eventDetail.event.resultSecondRunnerId)"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="runnerName(eventDetail.event.resultSecondRunnerId)" style="margin-left: 5px"></v-list-item-title>
          </v-list-item-content>
          <p style="margin: auto 0;">
          　二塁
          </p>
        </div>
        <div v-if="eventDetail.event.resultThirdRunnerId !== null" class="d-flex px-3">
          <v-list-item-avatar>
            <v-img :src="runnerImage(eventDetail.event.resultThirdRunnerId)"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="runnerName(eventDetail.event.resultThirdRunnerId)" style="margin-left: 5px"></v-list-item-title>
          </v-list-item-content>
          <p style="margin: auto 0;">
          　三塁
          </p>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div class="d-flex">
        <p class="pr-2 text-caption" style="margin: auto 0;">1</p>
        <p class="pr-2 text-caption" style="margin: auto 0;">打席開始</p>
          <v-row justify="end">
            <div class="d-flex pr-5 text-caption" style="margin: auto 0; color: #F50057;">
              {{ startOutCount }} 死
            </div>
            <div class="d-flex pr-5 text-caption" style="margin: auto 0; min-width: 70px; color: #42A5F5;">
              <p style="margin: auto 0;">{{ startRunner(startRunners) }}</p>
            </div>
          </v-row>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div v-if="startRunners.length === 0">
          <v-list-item-subtitle class="text-body text-center">先頭打者</v-list-item-subtitle>
        </div>
        <div v-if="startRunners.length !== 0">
          <div v-if="startRunners[0] !== null" class="d-flex px-3">
            <v-list-item-avatar>
              <v-img :src="runnerImage(startRunners[0])"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="runnerName(startRunners[0])" style="margin-left: 5px"></v-list-item-title>
            </v-list-item-content>
            <p style="margin: auto 0;">
            　一塁
            </p>
          </div>
          <div v-if="startRunners[1] !== null" class="d-flex px-3">
            <v-list-item-avatar>
              <v-img :src="runnerImage(startRunners[1])"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="runnerName(startRunners[1])" style="margin-left: 5px"></v-list-item-title>
            </v-list-item-content>
            <p style="margin: auto 0;">
            　二塁
            </p>
          </div>
          <div v-if="startRunners[2] !== null" class="d-flex px-3">
            <v-list-item-avatar>
              <v-img :src="runnerImage(startRunners[2])"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="runnerName(startRunners[2])" style="margin-left: 5px"></v-list-item-title>
            </v-list-item-content>
            <p style="margin: auto 0;">
            　三塁
            </p>
          </div>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    eventDetails: Array,
    players: Array,
    startRunners: Array,
    startOutCount: Number
  },
  computed: {
    reverseEventDetails() {
      return this.eventDetails.slice().reverse();
    }
  },
  methods: {
    eventName(eventDetail) {
      let eventName
      switch (eventDetail.event.eventType) {
        case 0: {
          eventName = '盗塁'
          break
        }
        case 1: {
          if (eventDetail.batteryError.wpFlg) {
            eventName = '暴投'
          } else {
            eventName = '捕逸'
          }
          break
        }
        case 2: {
          eventName = 'エラー'
          break
        }
        case 3: {
          eventName = '特殊'
          break
        }
      }
      return eventName
    },
    eventRunner(eventDetail) {
      let runner = ''
      if (eventDetail.event.resultFirstRunnerId !== null) {
        runner = '1'
      }
      if (eventDetail.event.resultSecondRunnerId !== null) {
        runner = runner === '' ? '2' : runner + ', 2'
      }
      if (eventDetail.event.resultThirdRunnerId !== null) {
        runner = runner === '' ? '3' : runner + ', 3'
      }
      if (runner !== '') {
        runner += ' 塁'
      } else {
        runner = '走者なし'
      }
      return runner
    },
    outCount(eventDetail) {
     return eventDetail.event.resultOutCount
    },
    startRunner(startRunners) {
      let runner = ''
      if (startRunners.length === 0) {
        return '走者なし'
      }
      if (startRunners[0] !== null) {
        runner = '1'
      }
      if (startRunners[1] !== null) {
        runner = runner === '' ? '2' : runner + ', 2'
      }
      if (startRunners[2] !== null) {
        runner = runner === '' ? '3' : runner + ', 3'
      }
      if (runner !== '') {
        runner += ' 塁'
      } else {
        runner = '走者なし'
      }
      return runner
    },
    runName(run) {
      const playerId = run.runnerId
      return this.players.filter((player) => {
         return player.id === playerId
      })[0].name
    },
    runnerImage(runnerId) {
      const image = this.players.filter((player) => {
        return player.id === runnerId
      })[0].image
      return image ? image : '../noimage.png'
    },
    runnerName(runnerId) {
      return this.players.filter((player) => {
        return player.id === runnerId
      })[0].name
    }
  }
}
</script>