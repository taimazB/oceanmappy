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
        <!-- <v-slider
          v-model="selectedDateTimeSlider"
          :max="sliderDates.length - 1"
          ticks="always"
          :tick-size="2"
          :tick-labels="sliderDates"
          :thumb-label="true"
          dense
          :disabled="!mapIdle"
        > -->
        <v-slider
          v-model="selectedDateTimeSlider"
          :max="sliderDates.length - 1"
          ticks="always"
          :tick-size="2"
          :tick-labels="sliderDates"
          :thumb-label="true"
          dense
        >
          <template #thumb-label="{ value }">
            {{ sliderTimes[value] }}
          </template>
        </v-slider>
      </section>

      <section v-if="!sliderMode" :style="{ width: `calc(100% - ${150}px)` }">
        <v-row>
          <!-- DATE PICKER -->
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
          <!-- TIME PICKER -->
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
      </section>

      <!-- CONTROL -->
      <section
        v-if="!breakpoint.smAndDown && sliderMode"
        :style="{ width: `${controlWidth}px`, 'place-self': 'center' }"
      >
        <v-icon v-show="selectedDateTimeSlider > 0" @click="previous"
          >mdi-chevron-left</v-icon
        >
        <span style="font-weight: bold">
          {{ sliderDateTimes[selectedDateTimeSlider].time }}
        </span>
        <span class="text-caption">
          {{ formattedSelectedDate }}
        </span>
        <v-icon
          v-show="selectedDateTimeSlider < sliderDateTimes.length - 1"
          @click="next"
          >mdi-chevron-right</v-icon
        >
      </section>

      <v-divider vertical />

      <!-- DEPTH -->
      <section style="width: 100px; place-self: center">
        <v-btn elevation="0" @click="toggleDepthSlider">{{getDepth()}}</v-btn>
      </section>

      <v-slider
        v-if="showDepthSlider"
        v-model="iDepth"
        vertical
        :max="availDepths.length - 1"
        hide-details
        background-color="secondary"
        dark
        height="100%"
        style="position: absolute; right: 35px; width: 30px; bottom: 50px"
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
    showDepthSlider: false,
    // nextDayDisabled: false,
    // previousDayDisabled: false,
    // isPlaying: false
    // play: null,
    // nextTimeDisabled: false,
    // previousTimeDisabled: false,
    // selectedDateTimeSlider:0,
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

    now() {
      return this.$store.state.map.now
    },

    selected() {
      return this.$store.state.layers.selected
    },

    availDateTimes() {
      // if (this.demo) {
      //   // const n = this.selected.availDateTimes.length
      //   // const a = parseInt(n / 2) - 20
      //   // const b = parseInt(n / 2) + 20
      //   // if (a >= 0 && b < n) {
      //     return this.selected.availDateTimes.slice(0, 20)
      //   // }
      // }
      return this.selected.availDateTimes
    },

    availDates() {
      if (this.availDateTimes.length > 0) {
        return underscore.uniq(
          this.availDateTimes.map((d) => this.modelDate2datepickerDate(d.date))
        )
      } else {
        return []
      }
    },

    sliderDateTimes() {
      let dateTimes = []
      // ---  Last 3 days in large screens; Last day in mobile
      if (this.$vuetify.breakpoint.smAndDown)
        dateTimes = this.availDateTimes.filter((d) =>
          moment.utc(d.date).isAfter(moment.utc().subtract(1, 'days'))
        )
      else
        dateTimes = this.availDateTimes.filter((d) =>
          moment.utc(d.date).isAfter(moment.utc().subtract(4, 'days'))
        )

      if (dateTimes.length === 0) {
        const n = this.availDateTimes.length
        const a = n - 20 >= 0 ? n - 20 : 0
        dateTimes = this.availDateTimes.slice(a, n)
      }
      return dateTimes
    },

    sliderDates() {
      if (this.availDateTimes.length > 0) {
        // const a = underscore.uniq(
        //   this.$store.state.layers.availDateTimes.map(d => d.date)
        // ).filter(d=>moment.utc(d).isAfter(moment.utc().subtract(2, 'days'))).map(d=>moment.utc(d).format('MMM DD'))
        // console.log(a);
        // return a
        const ticks = this.sliderDateTimes.map((d) =>
          moment.utc(d.date).format('MMM DD')
        )
        for (let i = this.sliderDateTimes.length - 1; i > 0; i--) {
          if (ticks[i] === ticks[i - 1]) ticks[i] = ''
        }
        return ticks
      } else {
        return []
      }
    },

    sliderTimes() {
      return this.sliderDateTimes.map((d) => d.time)
    },

    availTimes() {
      if (this.selected !== null) {
        if (this.availDateTimes !== null) {
          return this.availDateTimes
            .filter((d) => d.date === this.$store.state.layers.interDate)
            .map((d) => d.time)
        } else {
          return []
        }
      } else {
        return []
      }
    },

    selectedDateTimeSlider: {
      get() {
        if (this.$store.state.layers.interDate !== null) {
          const date = this.$store.state.layers.interDate
          const time = this.$store.state.layers.interTime
          const indx = this.sliderDateTimes
            .map((dt) => `${dt.date}_${dt.time}`)
            .indexOf(`${date}_${time}`)
          if (indx >= 0) {
            return indx
          } else {
            this.$store.commit('layers/setDate', this.sliderDateTimes[0].date)
            this.$store.commit('layers/setTime', this.sliderDateTimes[0].time)
            this.$store.dispatch('map/setRedrawTrue')
            this.$store.commit('map/setMapIdle', false)
          }
        }
        return 0
      },
      set(indx) {
        this.$store.commit('layers/setDate', this.sliderDateTimes[indx].date)
        this.$store.commit('layers/setTime', this.sliderDateTimes[indx].time)
        this.$store.dispatch('map/setRedrawTrue')
        this.$store.commit('map/setMapIdle', false)
      },
    },

    selectedTime: {
      get() {
        if (this.availTimes !== null) {
          return this.$store.state.layers.interTime
        } else return ''
      },
      set(hr) {
        this.$store.commit('layers/setTime', hr.toString().padStart(2, '0'))
        this.$store.dispatch('map/setRedrawTrue')
        // this.chkBtns()
      },
    },

    selectedDate: {
      get() {
        if (this.$store.state.layers.interDate !== null)
          return this.modelDate2datepickerDate(
            this.$store.state.layers.interDate
          )
        else return ''
      },
      set(value) {
        this.$store.commit(
          'layers/setDate',
          this.datepickerDate2modelDate(value)
        )
        this.$store.dispatch('map/setRedrawTrue')
        // this.chkBtns()
      },
    },

    availDepths() {
      return this.selected.depthProperties.depthValues
    },

    iDepth: {
      get() {
        return this.selected.depthProperties.iDepth
      },
      set(value) {
        const cloneSelected = JSON.parse(JSON.stringify(this.selected))
        cloneSelected.depthProperties.iDepth = value
        this.$store.commit('layers/updateSelected',cloneSelected)
        this.$store.dispatch('map/setRedrawTrue')
      },
    },

    formattedSelectedDate() {
      return moment(
        this.sliderDateTimes[this.selectedDateTimeSlider].date
      ).format('MMM DD')
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

  // #################################################################
  // ######################## --- MOUNTED --- ########################

  mounted() {
    this.$store.commit('layers/setDate', this.now.format('YYYYMMDD'))

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
      if (this.selectedDateTimeSlider < this.sliderDateTimes.length - 1)
        this.selectedDateTimeSlider += 1
    },

    previous() {
      if (this.selectedDateTimeSlider > 0) this.selectedDateTimeSlider -= 1
    },

    toggleDepthSlider() {
      this.showDepthSlider = !this.showDepthSlider
    },

    getDepth(){
      const depth= this.availDepths[this.iDepth]
      if(depth===0)
      return 'Surface'
      else return `${depth} m`
    }

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
