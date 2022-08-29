<template>
  <section style="position: relative">
    <v-toolbar :height="height" width="100%" class="ma-0 pa-0">
      <!-- OCEANMAPPY INFO BUTTON -->
      <v-icon small class="ml-1" @click="toggleShowInfoDialog()">
        mdi-information-variant
      </v-icon>

      <v-spacer></v-spacer>

      <!-- DISTANCE -->
      <v-icon
        small
        class="mr-1"
        :color="drawMode === 'distance' ? 'green' : ''"
        @click="toggleDraw('distance')"
      >
        mdi-ruler
      </v-icon>

      <!-- PROFILE -->
      <v-icon
        small
        class="mr-1"
        :color="drawMode === 'profile' ? 'green' : ''"
        @click="toggleDraw('profile')"
      >
        mdi-chart-bell-curve-cumulative
      </v-icon>

      <!-- LAYERS BUTTON -->
      <v-icon
        small
        :color="showLayers ? 'green' : ''"
        class="mr-1"
        @click="toggleShowLayers()"
        >mdi-layers</v-icon
      >
    </v-toolbar>
  </section>
</template>

<script>
export default {
  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      height: 30,
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    rightBarContent() {
      return this.$store.state.map.rightBarContent
    },

    showLayers() {
      return this.rightBarContent === 'layers'
    },

    drawMode() {
      return this.$store.state.map.drawMode
    },
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    toggleShowLayers() {
      // this.$store.commit('map/setShowLayers', !this.showLayers)
      this.$store.commit(
        'map/setRightBarContent',
        this.rightBarContent === 'layers' ? null : 'layers'
      )
    },

    toggleShowInfoDialog() {
      this.$store.commit(
        'map/setShowInfoDialog',
        !this.$store.state.map.showInfoDialog
      )
    },

    toggleDraw(mode) {
      if (this.drawMode === mode) mode = null
      this.$store.commit('map/setDrawGJ', null) // --- Empty drawGJ before switching
      this.$store.commit('map/setDrawMode', mode)
    },

  },
}
</script>

<style scoped>
.v-toolbar__content {
  padding: 0;
}

.center {
  align-items: center;
}

.row {
  margin: 0;
  padding: 0px 10px !important;
}

.col {
  margin: 0 !important;
  padding: 0 !important;
}

.main-content {
  position: relative;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px;
  margin: 20px 10px;
}

.main-content label {
  position: absolute;
  top: -10px;
  background: white;
  padding: 0 15px;
  font-weight: bold;
}

span {
  font-size: small;
}

.v-dialog {
  background: white;
}
</style>
