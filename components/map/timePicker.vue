<template>
  <v-row align="center"  justify="center">
    <!-- PREVIOUS HOUR -->
    <v-col cols="1" class="px-0">
      <v-btn icon x-small :disabled="previousHourDisabled" @click="previousHour"
        ><v-icon>mdi-chevron-left</v-icon></v-btn
      >
    </v-col>
    <!-- TIME PICKER -->
    <v-col cols="5" class="py-0">
      <v-select
        v-model="selectedHour"
        :items="availTimes"
        menu-props="auto"
        hide-details
        single-line
      ></v-select>
    </v-col>
    <!-- NEXT HOUR -->
    <v-col cols="1" class="px-0">
      <v-btn icon x-small :disabled="nextHourDisabled" @click="nextHour"
        ><v-icon>mdi-chevron-right</v-icon></v-btn
      >
    </v-col>
  </v-row>
</template>


<script>
export default {
  data() {
    return {
      toggle_exclusive: undefined,
      // selectedHour :0,
      // isPlaying: false,
      // playHandler: null,
      // play: null,
      nextHourDisabled: false,
      previousHourDisabled: false,
    }
  },

  computed: {
    availTimes() {
      if (this.$store.state.layers.selected !== null) {
        if (this.$store.state.layers.selected.availDateTimes !== null) {
          return this.$store.state.layers.selected.availDateTimes
            .filter((d) => d.date === this.$store.state.layers.interDate)
            .map((d) => d.time)
        } else {
          return []
        }
      } else {
        return []
      }
    },

    selectedHour: {
      get() {
        if (this.availTimes !== null) {
          // const i = this.availTimes.indexOf(this.$store.state.layers.interTime)
          // if (i !== -1) return i
          // else return 0
          return this.$store.state.layers.interTime
        } else return ''
      },

      set(hr) {
        // if (this.availTimes !== null && this.availTimes.length > 0 && i >= 0)
        // this.$store.commit('layers/setTime', this.availTimes[i])
        this.$store.commit('layers/setTime', hr.toString().padStart(2, '0'))
        this.$store.dispatch('map/setRedrawTrue')
      },
    },

    // playIcon() {
    //   if (this.isPlaying) return 'mdi-pause'
    //   else return 'mdi-play'
    // },
  },

  methods: {
    // showAvailHours(hr) {
    //   if (
    //     this.availTimes !== null &&
    //     this.availTimes.map((availHr) => parseInt(availHr)).includes(hr)
    //   )
    //     return true
    //   else return false
    // },

    nextHour() {
      let iCurrentTime = this.availTimes.indexOf(this.selectedHour) + 1
      if (iCurrentTime >= this.availTimes.length) iCurrentTime = 0
      this.selectedHour = parseInt(this.availTimes[iCurrentTime])
    },

    previousHour() {
      let iCurrentTime = this.availTimes.indexOf(this.selectedHour) - 1
      if (iCurrentTime < 0) iCurrentTime = this.availTimes.length - 1
      this.selectedHour = parseInt(this.availTimes[iCurrentTime])
    },

    // togglePlayHours() {
    //   this.isPlaying = !this.isPlaying
    //   if (this.isPlaying) {
    //     this.play = setInterval(() => {
    //       if (!this.nextHourDisabled) this.nextHour()
    //       else {
    //         this.isPlaying = false
    //         clearInterval(this.play)
    //       }
    //     }, 1000)
    //   } else {
    //     clearInterval(this.play)
    //   }
    // },
  },
}
</script>
