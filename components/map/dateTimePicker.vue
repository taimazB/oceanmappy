<template>
  <v-sheet light height="50px">
    <v-row style="text-align: center; position: relative">
      <!-- HISTORICAL -->
      <section style="width: 50px; place-self: center">
        <v-icon @click="toggleHistory">mdi-history</v-icon>
      </section>

      <!-- SLIDER -->
      <section
        v-if="sliderMode"
        class="py-0"
        :style="{ width: `calc(100% - ${controlWidth + 150}px)` }"
      >
        <v-slider
          v-model="iDateTimeSlider"
          :max="sliderDateTicks.length - 1"
          ticks="always"
          :tick-size="2"
          :tick-labels="sliderDateTicks"
          :thumb-label="true"
          dense
          @end="updateDateTime"
        >
          <template #thumb-label="{ value }">
            {{ sliderTimes[value] }}
          </template>
        </v-slider>
      </section>

      <!-- <section v-if="!sliderMode" :style="{ width: `calc(100% - ${150}px)` }">
        <v-row>
          <v-col cols="6" class="py-0">
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
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
                :allowed-dates="filterAvailDates"
                @input="menu2 = true"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" class="py-0">
            <v-select
              v-model="selectedTime"
              :items="availTimes"
              menu-props="auto"
              hide-details
              single-line
            ></v-select>
          </v-col>
        </v-row>
      </section> -->

      <!-- CONTROL -->
      <section
        v-if="!breakpoint.smAndDown && sliderMode"
        :style="{ width: `${controlWidth}px`, 'place-self': 'center' }"
      >
        <v-icon v-show="iDateTimeSlider > 0" @click="previous"
          >mdi-chevron-left</v-icon
        >
        <span style="font-size: small; font-weight:bold">
          {{ sliderDateTimes[iDateTimeSlider].format('MMM DD, HH:00') }}
        </span>
        <v-icon
          v-show="iDateTimeSlider < sliderDateTimes.length - 1"
          @click="next"
          >mdi-chevron-right</v-icon
        >
      </section>

      <v-divider vertical />

      <!-- LEVEL -->
      <section v-if="hasLevels" style="width: 100px; place-self: center">
        <v-btn elevation="0" @click="toggleLevelSlider">{{ getLevel() }}</v-btn>
      </section>

      <v-slider
        v-if="showLevelSlider"
        v-model="iLevel"
        vertical
        :max="availLevels.length - 1"
        hide-details
        background-color="secondary"
        dark
        height="100%"
        style="position: absolute; right: 35px; width: 30px; bottom: 50px"
        @end="updateLevel"
      >
      </v-slider>
    </v-row>
  </v-sheet>
</template>

<script>
import underscore from 'underscore'
import moment from 'moment'

export default {
  // ##############################################################
  // ######################## --- DATA --- ########################

  data: () => ({
    sliderMode: true,
    menu: false,
    modal: false,
    menu2: false,
    showLevelSlider: false,
    // nextDayDisabled: false,
    // previousDayDisabled: false,
    // isPlaying: false
    // play: null,
    // nextTimeDisabled: false,
    // previousTimeDisabled: false,
    iDateTimeSlider: 0,
    iLevel: 0,
  }),

  // ##################################################################
  // ######################## --- COMPUTED --- ########################

  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint
    },

    demo() {
      return this.$store.state.map.demo
    },

    controlWidth() {
      return this.breakpoint.smAndDown ? 0 : 150
    },

    // now() {
    //   return this.$store.state.map.now
    // },

    selected() {
      return this.$store.state.layers.selected
    },

    //     models(){
    // return this.$store.state.layers.models
    //     },

    //     fields(){
    // return this.$store.state.layers.fields
    //     },

    // availDateTimes() {
    //   // if (this.demo) {
    //   //   // const n = this.selected.availDateTimes.length
    //   //   // const a = parseInt(n / 2) - 20
    //   //   // const b = parseInt(n / 2) + 20
    //   //   // if (a >= 0 && b < n) {
    //   //     return this.selected.availDateTimes.slice(0, 20)
    //   //   // }
    //   // }
    //   // return this.selected.regions[this.selected.iRegion].availDateTimes

    //   const selectedModel = this.models.filter(m=>m.name===this.selected.modelName)[0]
    //   const selectedFieldInModel = selectedModel.fields.filter(f=>f.name===this.selected.fieldName)[0]
    //   if('availDateTime' in selectedFieldInModel.keys()) return selectedFieldInModel.availDateTimes
    //   else return []
    // },

 

    sliderDateTimes() {
      let dateTimes = []
      // ---  Last 3 days in large screens; Last day in mobile
      if (this.$vuetify.breakpoint.smAndDown)
        dateTimes = this.selected.availDateTimes.filter((d) =>
          d.isAfter(moment.utc().subtract(1, 'days'))
        )
      else
        dateTimes = this.selected.availDateTimes.filter((d) =>
          d.isAfter(moment.utc().subtract(4, 'days'))
        )

      if (dateTimes.length === 0) {
        const n = this.selected.availDateTimes.length
        const a = n - 20 >= 0 ? n - 20 : 0
        dateTimes = this.selected.availDateTimes.slice(a, n)
      }
      return dateTimes
    },

    sliderDateTicks() {
      if (this.sliderDateTimes.length > 0) {
        // const a = underscore.uniq(
        //   this.$store.state.layers.availDateTimes.map(d => d.date)
        // ).filter(d=>moment.utc(d).isAfter(moment.utc().subtract(2, 'days'))).map(d=>moment.utc(d).format('MMM DD'))
        // console.log(a);
        // return a
        const ticks = this.sliderDateTimes.map((d) => d.format('MMM DD'))
        for (let i = this.sliderDateTimes.length - 1; i > 0; i--) {
          if (ticks[i] === ticks[i - 1]) ticks[i] = ''
        }
        return ticks
      } else {
        return []
      }
    },

    sliderTimes() {
      return this.sliderDateTimes.map((d) => d.format('HH'))
    },

    // availDates() {
    //   if (this.selected.availDateTimes.length > 0) {
    //     return underscore.uniq(
    //       this.selected.availDateTimes.map((d) =>
    //         this.modelDate2datepickerDate(d.date)
    //       )
    //     )
    //   } else {
    //     return []
    //   }
    // },

    // availTimes() {
    //   if (this.selected !== null) {
    //     if (this.selected.availDateTimes !== null) {
    //       return this.selected.availDateTimes
    //         .filter((d) => d.date === this.$store.state.layers.interDate)
    //         .map((d) => d.time)
    //     } else {
    //       return []
    //     }
    //   } else {
    //     return []
    //   }
    // },

    // selectedTime: {
    //   get() {
    //     if (this.availTimes !== null) {
    //       return this.$store.state.layers.interTime
    //     } else return ''
    //   },
    //   set(hr) {
    //     this.$store.commit('layers/setTime', hr.toString().padStart(2, '0'))
    //     this.$store.commit('map/setRedrawTrue')
    //     // this.chkBtns()
    //   },
    // },

    // selectedDate: {
    //   get() {
    //     if (this.$store.state.layers.interDate !== null)
    //       return this.modelDate2datepickerDate(
    //         this.$store.state.layers.interDate
    //       )
    //     else return ''
    //   },
    //   set(value) {
    //     this.$store.commit('layers/setDateTime',)
    //     // this.$store.commit(
    //     //   'layers/setDate',
    //     //   this.datepickerDate2modelDate(value)
    //     // )
    //     this.$store.commit('map/setRedrawTrue')
    //     // this.chkBtns()
    //   },
    // },

    hasLevels() {
      return this.selected.hasLevels
    },

    availLevels() {
      return this.selected.region.levels.values
    },

    // iLevel: {
    //   get() {
    //     return this.selected.regions[this.iRegion].levels.iLevel
    //   },
    //   set(value) {
    //     this.selected.regions[this.iRegion].levels.iLevel = value
    //     this.$store.commit('map/setRedrawTrue')
    //   },
    // },

    formattedSelectedDate() {
      return moment(
        this.sliderDateTimes[this.iDateTimeSlider].date
      ).format('MMM Do')
      // return moment().utc(this.selectedDate).format('MMM DD')
    },

    playIcon() {
      if (this.isPlaying) return 'mdi-pause'
      else return 'mdi-play'
    },

    mapIdle() {
      return this.$store.state.map.mapIdle
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {
    selected: {
      handler() {
        if (this.$store.state.layers.interDateTime !== null) {
          const dateTime = this.$store.state.layers.interDateTime
          const indx = this.sliderDateTimes
            // .map((dt) => `${dt.date}_${dt.time}`)
            // .indexOf(`${date}_${time}`)
            .indexOf(dateTime)
          if (indx >= 0) this.iDateTimeSlider = indx
          else this.iDateTimeSlider = 0

          // this.$store.commit('layers/setDate', this.sliderDateTimes[0].date)
          // this.$store.commit('layers/setTime', this.sliderDateTimes[0].time)
          // this.$store.commit('map/setRedrawTrue')
          // this.$store.commit('map/setMapIdle', false)

          this.updateDateTime()
        }
        if (this.selected.hasLevels)
          this.iLevel = this.selected.region.levels.iLevel
      },
      deep: true,
    },
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################

  mounted() {
    // this.$store.commit('layers/setDate', this.now.format('YYYYMMDD'))
    // this.$store.commit('layers/setTime', this.now.format('HH'))
    if (this.selected.hasLevels)
      this.iLevel = this.selected.region.levels.iLevel

    // const date = this.$store.state.layers.interDate
    // const time = this.$store.state.layers.interTime
    const dateTime = this.$store.state.layers.interDateTime
    const indx = this.sliderDateTimes
      // .map((dt) => `${dt.date}_${dt.time}`)
      // .indexOf(`${date}_${time}`)
      .indexOf(dateTime)
    if (indx >= 0) {
      this.iDateTimeSlider = indx
    } else {
      this.iDateTimeSlider = 0
    }



    //  window.addEventListener('keyup',(e)=>{
    //    if(e.key==='ArrowRight') this.next()
    //    else if(e.key==='ArrowLeft') this.previous()
    //  })
  },

  // #################################################################
  // ######################## --- METHODS --- ########################

  methods: {
    filterAvailDates(date) {
      return this.availDates.includes(date)
    },

    updateDateTime() {
      this.$store.commit(
        'layers/setInterDateTime',
        this.sliderDateTimes[this.iDateTimeSlider]
      )
      // this.$store.commit(
      //   'layers/setTime',
      //   this.sliderDateTimes[this.iDateTimeSlider].time
      // )
      this.$store.commit('map/setRedrawTrue')
      this.$store.commit('map/setMapIdle', false)
    },

    updateLevel() {
      this.selected.region.levels.iLevel = this.iLevel
      this.$store.commit('map/setRedrawTrue')

      // this.$store.commit(
      //   'layers/setDate',
      //   this.sliderDateTimes[this.iDateTimeSlider].date
      // )
      // this.$store.commit(
      //   'layers/setTime',
      //   this.sliderDateTimes[this.iDateTimeSlider].time
      // )
      // this.$store.commit('map/setRedrawTrue')
      // this.$store.commit('map/setMapIdle', false)
    },

    modelDate2datepickerDate(d) {
      return `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6)}`
    },

    datepickerDate2modelDate(d) {
      return d.split('-').join('')
    },

    toggleHistory() {
      this.sliderMode = !this.sliderMode
    },

    next() {
      if (this.iDateTimeSlider < this.sliderDateTimes.length - 1) {
        this.iDateTimeSlider += 1
        this.updateDateTime()
      }
    },

    previous() {
      if (this.iDateTimeSlider > 0) {
        this.iDateTimeSlider -= 1
        this.updateDateTime()
      }
    },

    toggleLevelSlider() {
      this.showLevelSlider = !this.showLevelSlider
    },

    getLevel() {
      const level = this.availLevels[this.iLevel]
      if (typeof level === 'number') return `${level} m`
      else return level
    },

    // nextDay() {
    //   const currentDate = this.modelDate2datepickerDate(
    //     this.$store.state.layers.interDate
    //   )
    //   const iCurrentDate = this.availDates.indexOf(currentDate)
    //   this.selectedDate = this.availDates[iCurrentDate + 1]
    // },

    // previousDay() {
    //   const currentDate = this.modelDate2datepickerDate(
    //     this.$store.state.layers.interDate
    //   )
    //   const iCurrentDate = this.availDates.indexOf(currentDate)
    //   this.selectedDate = this.availDates[iCurrentDate - 1]
    // },

    // chkBtns() {
    //   const iCurrentDate = this.availDates.indexOf(this.selectedDate)
    //   if (iCurrentDate >= this.availDates.length - 1) {
    //     this.nextDayDisabled = true
    //     const iCurrentTime = this.availTimes.indexOf(this.selectedTime)
    //     if (iCurrentTime >= this.availTimes.length - 1)
    //       this.nextTimeDisabled = true
    //     else this.nextTimeDisabled = false
    //   } else {
    //     this.nextDayDisabled = false
    //     this.nextTimeDisabled = false
    //   }

    //   if (iCurrentDate <= 0) {
    //     this.previousDayDisabled = true
    //     const iCurrentTime = this.availTimes.indexOf(this.selectedTime)
    //     if (iCurrentTime <= 0) this.previousTimeDisabled = true
    //     else this.previousTimeDisabled = false
    //   } else {
    //     this.previousDayDisabled = false
    //     this.previousTimeDisabled = false
    //   }
    // },

    // togglePlayDays() {
    //   this.isPlaying = !this.isPlaying
    //   if (this.isPlaying) {
    //     this.play = setInterval(() => {
    //       if (!this.nextDayDisabled) this.nextDay()
    //       else {
    //         this.isPlaying = false
    //         clearInterval(this.play)
    //       }
    //     }, 1000)
    //   } else {
    //     clearInterval(this.play)
    //   }
    // },

    // nextTime() {
    //   let iCurrentTime = this.availTimes.indexOf(this.selectedTime) + 1
    //   if (iCurrentTime >= this.availTimes.length) {
    //     this.nextDay()
    //     iCurrentTime = 0
    //   }
    //   this.selectedTime = parseInt(this.availTimes[iCurrentTime])
    // },

    // previousTime() {
    //   let iCurrentTime = this.availTimes.indexOf(this.selectedTime) - 1
    //   if (iCurrentTime < 0) {
    //     this.previousDay()
    //     iCurrentTime = this.availTimes.length - 1
    //   }
    //   this.selectedTime = parseInt(this.availTimes[iCurrentTime])
    // }
  },
}
</script>

<style scoped>
.v-menu__content {
  min-width: auto !important;
}

.v-btn {
  text-transform: unset !important;
}
</style>

<style>
.v-input__slot {
  border-radius: 15px;
}
</style>
