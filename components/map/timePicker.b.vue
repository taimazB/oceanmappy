<template>
  <v-card flat color="rgba(255,255,255,0)">
    <v-card-text>
      <v-row justify="end">
        <v-btn-toggle
          v-model="selectedBtn"
          mandatory
          style="background-color: rgba(255, 255, 255, 0.2); display: contents"
        >
          <v-btn
            v-for="(hour, index) in availTimes"
            :key="index"
            small
            style="background-color: rgba(255, 255, 255, 0.2)"
          >
            {{ hour }}
          </v-btn>
        </v-btn-toggle>
      </v-row>
    </v-card-text>
  </v-card>
</template>


<script>
export default {
  data() {
    return {
      toggle_exclusive: undefined,
    }
  },

  computed: {
    availTimes() {
      if (this.$store.state.map.selected.availDateTimes !== null) {
        return this.$store.state.map.selected.availDateTimes
          .filter((d) => d.date === this.$store.state.layers.interDate)
          .map((d) => d.time)
      } else {
        return null
      }
    },

    selectedBtn: {
      get() {
        if (this.availTimes !== null) {
          const i = this.availTimes.indexOf(this.$store.state.layers.interTime)
          if (i !== -1) return i
          else return 0
        } else return -1
      },

      set(i) {
        if (this.availTimes!==null && this.availTimes.length>0 && i >= 0) this.$store.commit('layers/setTime', this.availTimes[i])
      },
    },
  },
}
</script>
