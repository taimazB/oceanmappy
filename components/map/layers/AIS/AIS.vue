<template>
  <v-container>
    <v-row class="mx-3">
      <v-btn
        v-for="(year, i) in years"
        :key="i"
        :dark="selectedYear === year"
        width="100%"
        @click="selectYear(year)"
      >
        {{ year }}
      </v-btn>
    </v-row>
    <v-row class="mx-3">
      <v-btn
        v-for="(month, i) in months"
        :key="i"
        :dark="selectedMonthIndex === i"
        x-small
        width="40px"
        @click="selectMonth(i)"
      >
        {{ month }}
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      years: [2021, 2020],
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    selectedYear: {
      get() {
        return this.$store.state.map.AISselectedYear
      },
      set(value) {
        this.$store.commit('map/setAISselectedYear', value)
      },
    },

    selectedMonthIndex: {
      get() {
        return this.$store.state.map.AISselectedMonthIndex
      },
      set(value) {
        this.$store.commit('map/setAISselectedMonthIndex', value)
      },
    },
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    this.selectedYear = 2021
    this.selectedMonthIndex = parseInt(moment.utc().format('M'))
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    selectYear(year) {
      if (this.selectedYear === year) this.selectedYear = null
      else this.selectedYear = year
    },

    selectMonth(i) {
      if (this.selectedMonthIndex === i) this.selectedMonthIndex = null
      else this.selectedMonthIndex = i
    },
  },
}
</script>

<style scoped>
.col {
  padding: 0;
  margin: 0;
}

.fontSizeXS {
  font-size: x-small !important;
}
</style>
