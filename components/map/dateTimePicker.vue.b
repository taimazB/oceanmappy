<template>
  <section>
    <v-row align="center" justify="center">
      <!-- PREVIOUS DAY -->
      <v-col cols="1" class="px-0">
        <v-btn icon x-small :disabled="previousDayDisabled" @click="previousDay"
          ><v-icon>mdi-chevron-left</v-icon></v-btn
        >
      </v-col>

      <!-- DATE PICKER -->
      <v-col cols="8" class="py-0">
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          nudge-left="300px"
          transition="scroll-y-reverse-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="selectedDate"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="selectedDate"
            @input="menu2 = true"
            :allowed-dates="filterAvailDates"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <!-- NEXT DAY -->
      <v-col cols="1" class="px-0">
        <v-btn icon x-small :disabled="nextDayDisabled" @click="nextDay">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>

      <!-- PLAY DAYS -->
      <!-- <v-col cols="4">
        <v-btn fab x-small elevation="0" @click="togglePlayDays"
          ><v-icon>{{ playIcon }}</v-icon></v-btn
        >
      </v-col> -->
    </v-row>

    <!-- ###################################### -->

    <v-row
      align="center"
      justify="center"
      style="margin-bottom: 12px; margin-top: 0"
    >
      <!-- PREVIOUS TIME -->
      <v-col cols="1" class="px-0">
        <v-btn
          icon
          x-small
          :disabled="previousTimeDisabled"
          @click="previousTime"
          ><v-icon>mdi-chevron-left</v-icon></v-btn
        >
      </v-col>
      <!-- TIME PICKER -->
      <v-col cols="5" class="py-0">
        <v-select
          v-model="selectedTime"
          :items="availTimes"
          menu-props="auto"
          hide-details
          single-line
        ></v-select>
      </v-col>
      <!-- NEXT TIME -->
      <v-col cols="1" class="px-0">
        <v-btn icon x-small :disabled="nextTimeDisabled" @click="nextTime"
          ><v-icon>mdi-chevron-right</v-icon></v-btn
        >
      </v-col>
    </v-row>
  </section>
</template>

<script>
import underscore from 'underscore'

export default {
  // ##############################################################
  // ######################## --- DATA --- ########################

  data: () => ({
    menu: false,
    modal: false,
    menu2: false,
    nextDayDisabled: false,
    previousDayDisabled: false,
    isPlaying: false,
    play: null,
    nextTimeDisabled: false,
    previousTimeDisabled: false
  }),

  // ##################################################################
  // ######################## --- COMPUTED --- ########################

  computed: {
    now() {
      return this.$store.state.map.now
    },

    availDates() {
      if (this.$store.state.map.selected.availDateTimes.length > 0) {
        return underscore.uniq(
          this.$store.state.map.selected.availDateTimes.map(d =>
            this.modelDate2datepickerDate(d.date)
          )
        )
      } else {
        return []
      }
    },

    availTimes() {
      if (this.$store.state.map.selected !== null) {
        if (this.$store.state.map.selected.availDateTimes !== null) {
          return this.$store.state.map.selected.availDateTimes
            .filter(d => d.date === this.$store.state.layers.interDate)
            .map(d => d.time)
        } else {
          return []
        }
      } else {
        return []
      }
    },

    selectedTime: {
      get() {
        if (this.availTimes !== null) {
          return this.$store.state.layers.interTime
        } else return ''
      },

      set(hr) {
        this.$store.commit('layers/setTime', hr.toString().padStart(2, '0'))
        this.$store.commit('map/setRedrawTrue')
        this.chkBtns()
      }
    },

    selectedDate: {
      get() {
        if (this.$store.state.layers.interDate !== null)
          return this.modelDate2datepickerDate(this.$store.state.layers.interDate)
        else return ''
      },
      set(value) {
        this.$store.commit('layers/setDate', this.datepickerDate2modelDate(value))
        this.$store.commit('map/setRedrawTrue')
        this.chkBtns()
      }
    },

    playIcon() {
      if (this.isPlaying) return 'mdi-pause'
      else return 'mdi-play'
    }
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################

  mounted() {
    this.$store.commit('layers/setDate', this.now.format('YYYYMMDD'))
  },

  // #################################################################
  // ######################## --- METHODS --- ########################

  methods: {
    filterAvailDates(date) {
      return this.availDates.includes(date)
    },

    modelDate2datepickerDate(d) {
      return `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6)}`
    },

    datepickerDate2modelDate(d) {
      return d.split('-').join('')
    },

    nextDay() {
      const currentDate = this.modelDate2datepickerDate(
        this.$store.state.layers.interDate
      )
      const iCurrentDate = this.availDates.indexOf(currentDate)
      this.selectedDate = this.availDates[iCurrentDate + 1]
    },

    previousDay() {
      const currentDate = this.modelDate2datepickerDate(
        this.$store.state.layers.interDate
      )
      const iCurrentDate = this.availDates.indexOf(currentDate)
      this.selectedDate = this.availDates[iCurrentDate - 1]
    },

    chkBtns() {
      const iCurrentDate = this.availDates.indexOf(this.selectedDate)
      if (iCurrentDate >= this.availDates.length - 1) {
        this.nextDayDisabled = true
        const iCurrentTime = this.availTimes.indexOf(this.selectedTime)
        if (iCurrentTime >= this.availTimes.length - 1)
          this.nextTimeDisabled = true
        else this.nextTimeDisabled = false
      } else {
        this.nextDayDisabled = false
        this.nextTimeDisabled = false
      }

      if (iCurrentDate <= 0) {
        this.previousDayDisabled = true
        const iCurrentTime = this.availTimes.indexOf(this.selectedTime)
        if (iCurrentTime <= 0) this.previousTimeDisabled = true
        else this.previousTimeDisabled = false
      } else {
        this.previousDayDisabled = false
        this.previousTimeDisabled = false
      }
    },

    togglePlayDays() {
      this.isPlaying = !this.isPlaying
      if (this.isPlaying) {
        this.play = setInterval(() => {
          if (!this.nextDayDisabled) this.nextDay()
          else {
            this.isPlaying = false
            clearInterval(this.play)
          }
        }, 1000)
      } else {
        clearInterval(this.play)
      }
    },

    nextTime() {
      let iCurrentTime = this.availTimes.indexOf(this.selectedTime) + 1
      if (iCurrentTime >= this.availTimes.length) {
        this.nextDay()
        iCurrentTime = 0
      }
      this.selectedTime = parseInt(this.availTimes[iCurrentTime])
    },

    previousTime() {
      let iCurrentTime = this.availTimes.indexOf(this.selectedTime) - 1
      if (iCurrentTime < 0) {
        this.previousDay()
        iCurrentTime = this.availTimes.length - 1
      }
      this.selectedTime = parseInt(this.availTimes[iCurrentTime])
    }
  }
}
</script>

<style scoped></style>
