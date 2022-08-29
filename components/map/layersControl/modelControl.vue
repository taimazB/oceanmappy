<template>
  <section>
    <v-row style="min-height: 150px">
      <v-col cols="5" class="text-h4" style="position: relative">
        <!-- COLORBAR -->
        <colorBar
          :field="field"
          class="d-flex ml-4"
          style="position: absolute; height: 90%"
        >
        </colorBar>
      </v-col>

      <!-- MODELS -->
      <v-col cols="7">
        <section v-for="(model, j) in field.models" :key="j">
          <v-row>
            <!-- MODEL -->
            <v-col cols="12" class="pr-2">
              <v-btn
                x-small
                elevation="0"
                width="100%"
                :dark="
                  field.name === selectedField &&
                  model.modelDir === selectedModel.modelDir
                "
                @click="selectModel(category, field.name, model.modelDir)"
                >{{ model.btnText }}</v-btn
              >
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <section
            v-show="
              field.name === selectedField &&
              model.modelDir === selectedModel.modelDir
            "
            class="mb-3"
          >
            <v-row>
              <v-col cols="6" style="font-size: x-small">Unit:</v-col>
              <v-col cols="6" class="fontSizeXS" v-html="field.unit"></v-col>
            </v-row>
            <v-row>
              <v-col cols="6" style="font-size: x-small">last updated:</v-col>
              <v-col
                cols="6"
                :style="{
                  'font-size': 'x-small',
                  color: `${lastProcessedColor(model.lastProcessed)}`,
                }"
                >{{ model.lastProcessed }} hr ago</v-col
              >
            </v-row>

            <v-row>
              <v-col cols="12" style="font-size: x-small">
                <span>{{ model.longName }}</span>
                <a :href="model.link" target="_blank">more</a>
              </v-col>
            </v-row>
          </section>
        </section>
      </v-col>
    </v-row>

    <!-- CURRENTS CONFIG -->
    <section v-if="field.name === selectedField">
      <section
        v-if="field.name === 'Currents' || field.name === 'Wind'"
        class="ma-0 pa-0 px-2 pt-4"
      >
        <v-row>
          <v-spacer></v-spacer>
          <v-btn
            fab
            width="20px"
            height="20px"
            elevation="0"
            :color="currentsDirectionOn ? 'primary' : ''"
            @click="currentsDirectionOn = !currentsDirectionOn"
          >
            <v-icon x-small>mdi-arrow-top-right</v-icon>
          </v-btn>
          <v-btn
            v-if="currentsDirectionOn"
            fab
            width="20px"
            height="20px"
            elevation="0"
            :color="currentsAnimationOn ? 'primary' : ''"
            @click="currentsAnimationOn = !currentsAnimationOn"
          >
            <v-icon x-small>mdi-transition</v-icon>
          </v-btn>
          <!-- <v-btn
                  v-if="currentsDirectionOn"
                  fab
                  width="20px"
                  height="20px"
                  elevation="0"
                  :color="currentsLocked ? 'primary' : ''"
                  @click="currentsLocked = !currentsLocked"
                >
                  <v-icon x-small>{{
                    currentsLocked ? 'mdi-lock' : 'mdi-lock-open-variant'
                  }}</v-icon>
                </v-btn> -->
        </v-row>
        <!-- <v-row>
                <v-col
                  cols="4"
                  class="ma-0 pa-0 pl-1 fontSizeXS"
                  style="place-self: center"
                >
                  Direction
                </v-col>
                <v-col cols="8" class="ma-0 pa-0">
                  <v-switch
                    v-model="currentsDirectionOn"
                    inset
                    dense
                    hide-details
                    class="ma-0 pa-0"
                    style="float: right"
                  >
                  </v-switch>
                </v-col>
              </v-row>

              <v-row v-if="currentsDirectionOn">
                <v-col
                  cols="4"
                  class="ma-0 pa-0 pl-1 fontSizeXS"
                  style="place-self: center"
                >
                  Animation
                </v-col>
                <v-col cols="8" class="ma-0 pa-0">
                  <v-switch
                    v-model="currentsAnimationOn"
                    inset
                    dense
                    hide-details
                    class="ma-0 pa-0"
                    style="float: right"
                  >
                  </v-switch>
                </v-col>
              </v-row> -->

        <v-row v-if="currentsDirectionOn && !currentsAnimationOn">
          <v-col
            cols="6"
            class="ma-0 pa-0 pl-1 fontSizeXS"
            style="place-self: center"
          >
            Arrow's Range</v-col
          >
          <v-col cols="6" class="px-4">
            <v-range-slider
              v-model="currentsRange"
              :max="currentsMax"
              :min="currentsMin"
              hide-details
              class="align-center"
              step=".05"
              :thumb-label="true"
            >
            </v-range-slider>
          </v-col>
        </v-row>
      </section>

      <!-- LAYER OPACITY -->
      <v-row class="ma-0 pa-0 px-2">
        <v-col
          cols="4"
          class="ma-0 pa-0 pl-1 fontSizeXS"
          style="place-self: center"
          >Opacity</v-col
        >
        <v-col cols="8">
          <v-slider
            v-model="activeLayerOpacity"
            max="1"
            min="0"
            hide-details
            class="align-center"
            step="0.01"
          >
          </v-slider>
        </v-col>
      </v-row>
    </section>
  </section>
</template>

<script>
import colorBar from '~/components/map/colorBar'

export default {
  components: { colorBar },
  props: ['category', 'field'],

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      currentsMin: 0,
      currentsMax: 3,
      currentsRange: [0, 1],
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    selectedField() {
      if (this.$store.state.layers.selected === null) return null
      else return this.$store.state.layers.selected.field
    },

    selectedModel() {
      if (this.$store.state.layers.selected === null) return null
      else return this.$store.state.layers.selected
    },

    currentsDirectionOn: {
      get() {
        return this.$store.state.map.currentsDirectionOn
      },
      set(status) {
        this.$store.commit('map/setCurrentsDirectionOn', status)
      },
    },

    currentsAnimationOn: {
      get() {
        return this.$store.state.map.currentsAnimationOn
      },
      set(status) {
        this.$store.commit('map/setCurrentsAnimationOn', status)
      },
    },

    activeLayerOpacity: {
      get() {
        return this.$store.state.map.activeLayerOpacity
      },
      set(value) {
        this.$store.commit('map/setActiveLayerOpacity', value)
      },
    },
  },

  watch: {
    currentsRange: {
      handler() {
        this.$store.commit('map/setCurrentsMin', this.currentsRange[0])
        this.$store.commit('map/setCurrentsMax', this.currentsRange[1])
      },
      deep: true,
    },
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    selectModel(category, field, model) {
      // --- If the currently selected button is clicked again, deselect it
      if (field === this.selectedField && model === this.selectedModel.modelDir)
        this.$store.commit('layers/setSelected', null)
      else this.$store.commit('layers/setSelected', { category, field, model })
    },
  },
}
</script>

<style scoped>
.v-expansion-panel-content__wrap {
  padding: 0 !important;
}
/* 
.v-expansion-panel-header {
  font-size: var(--fontSize) !important;
} */

.mobileFontSize {
  font-size: 0.5rem;
}

.row {
  padding: 0;
  margin: 0;
}

.col {
  padding: 0;
  margin: 0;
}

.fontSizeXS {
  font-size: x-small !important;
}
</style>
