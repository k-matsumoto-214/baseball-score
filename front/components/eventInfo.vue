<template>
  <v-expansion-panels>
    <v-expansion-panel
      v-for="(eventDetail, idx) in eventDetails"
      :key="idx"
    >
    <v-expansion-panel-header>
      <div class="d-flex">
        <p class="pr-2 text-caption" style="margin: auto 0;">{{ idx + 1 }}</p>
        <p class="pr-2 text-caption" style="margin: auto 0;">{{ eventName(eventDetail) }}</p>
          <v-row justify="end">
            <div class="d-flex pr-5 text-caption" style="margin: auto 0;">
              {{ outCount(eventDetail) }} 死
            </div>
            <div class="d-flex pr-5 text-caption" style="margin: auto 0; min-width: 70px;">
              <p style="margin: auto 0;">{{ eventRunner(eventDetail) }}</p>
            </div>
          </v-row>
      </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>

      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    eventDetails: Array,
    players: Array
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
        runner += '塁'
      } else {
        runner = '走者なし'
      }
      return runner
    },
    outCount(eventDetail) {
     return eventDetail.event.resultOutCount
    }
  }
}
</script>