<template>
  <section>
    <v-row style="min-height: 150px">
      <v-col
        v-if="chkMapProjectionWarning"
        cols="12"
        style="text-align: center; margin: -10px 0 10px 0"
      >
        <span style="font-size: x-small; font-style: italic; color: firebrick"
          >{{ field.name }} layers may not appear coorectly in 3D</span
        >
      </v-col>

      <v-col cols="5" class="text-h4" style="position: relative">
        <!-- COLORBAR -->
        <colorBar
          v-if="field.colorbar.colormap.length > 0"
          :field="field"
          class="d-flex ml-4"
          style="position: absolute; height: 90%"
        >
        </colorBar>
      </v-col>

      <!-- MODELS -->
      <v-col cols="7">
        <section v-for="(model, j) in getModels(field.name)" :key="j">
          <v-row>
            <!-- MODEL -->
            <v-col cols="10" class="ma-0 pa-0">
              <!-- MODEL WITH 1 REGION -->
              <v-btn
                v-if="model.regions.length === 1"
                x-small
                elevation="0"
                width="100%"
                :dark="
                  selected &&
                  field.name === selected.field.name &&
                  model.name === selected.modelName
                "
                :disabled="!isModelActive(model, field.name)"
                @click="selectModel(field, model)"
                >{{
                  `${model.name}${isModelActive(model, field.name) ? '' : ' *'}`
                }}
              </v-btn>
              <!-- MODEL WITH MORE THAN 1 REGION -->
              <v-menu v-else transition="slide-y-transition" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    x-small
                    elevation="0"
                    width="100%"
                    :dark="
                      selected &&
                      field.name === selected.field.name &&
                      model.name === selected.modelName
                    "
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ model.name }}
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item
                    v-for="(region, iRegion) in model.regions.map(
                      (r) => r.name
                    )"
                    :key="iRegion"
                    @click="selectModel(field, model, iRegion)"
                  >
                    <v-list-item-title>{{
                      startCase(region)
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col cols="2" class="ma-0 pa-0">
              <v-icon x-small @click="setShowModelInfo(model)"
                >mdi-information-variant</v-icon
              >
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <section
            v-if="
              selected &&
              field.name === selected.field.name &&
              model.name === selected.modelName
            "
            class="mb-3"
          >
            <!-- <v-row>
              <v-col cols="6" style="font-size: x-small">Unit:</v-col>
              <v-col cols="6" class="fontSizeXS" v-html="field.unit"></v-col>
            </v-row> -->
            <v-row>
              <!-- <v-col cols="6" style="font-size: x-small">last updated:</v-col> -->
              <v-col cols="2">
                <v-icon v-tooltip="'Last updated'" x-small>mdi-update</v-icon>
              </v-col>
              <v-col
                cols="10"
                :style="{
                  'font-size': 'x-small','align-self':'center',
                  color: `${lastProcessedColor(
                    selected.lastProcessed
                  )}`,
                }"
                >{{ selected.lastProcessed.fromNow() }}</v-col
              >
            </v-row>
          </section>
        </section>
      </v-col>
    </v-row>

    <!-- CURRENTS CONFIG -->
    <section v-if="selected && field.name === selected.field.name">
      <section v-if="field.type === 'vector'" class="ma-0 pa-0 px-2 pt-4">
        <v-row class="mb-2">
          <v-spacer></v-spacer>
          <!-- <v-icon x-small> -->
          <v-img
            v-tooltip="'Animation on/off'"
            height="15px"
            max-width="15px"
            contain
            :src="
              require(`~/assets/images/wind.${vectorStatic ? 'gif' : 'png'}`)
            "
            @click="vectorStatic = !vectorStatic"
          >
          </v-img>
          <!-- </v-icon> -->
          <!-- <v-btn
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
          </v-btn> -->
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

        <!-- <v-row v-if="currentsDirectionOn && !currentsAnimationOn">
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
        </v-row> -->
        <v-row>
          <v-col cols="4" style="font-size: x-small; place-self: center">
            Max Speed</v-col
          >
          <v-col
            cols="8"
            style="
              place-self: center;
              text-align: center;
              text-align: -webkit-center;
            "
          >
            <vue-numeric-input
              v-model="maxSpeed"
              :min="0.05"
              :max="100"
              :step="0.05"
              :precision="2"
              size="small"
            ></vue-numeric-input
          ></v-col>
        </v-row>
      </section>

      <section v-else>
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

    <!-- MODEL INFO -->
    <v-dialog v-model="modelInfo.show" width="500px">
      <v-card style="padding: 5px">
        <v-card-title>{{ modelInfo.title }}</v-card-title>
        <v-card-subtitle>{{ modelInfo.longName }}</v-card-subtitle>
        <v-card-text>{{ modelInfo.description }} </v-card-text>
        <v-card-text>
          <a :href="modelInfo.link" target="_blank">more</a>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import { getSelectedAvailDatetimes } from '../mapLayersPanel/loadLayers'
import colorBar from '~/components/map/colorBar'
import moment from 'moment'

export default {
  components: { colorBar },
  props: {
    field: { type: Object, required: true },
  },

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      currentsMin: 0,
      currentsMax: 3,
      currentsRange: [0, 1],
      modelInfo: {},
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    selected() {
      // if (this.$store.state.layers.selected)
      return this.$store.state.layers.selected
      // else return {}
    },

    models() {
      return this.$store.state.layers.models
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

    vectorStatic: {
      get() {
        return this.$store.state.map.vectorStatic
      },
      set(status) {
        this.$store.commit('map/setVectorStatic', status)
      },
    },

    maxSpeed: {
      get() {
        switch (this.selected.field) {
          case 'current':
            return this.$store.state.map.maxSpeedCurrent
          case 'wind':
            return this.$store.state.map.maxSpeedWind
          case 'seaiceVelocity':
            return this.$store.state.map.maxSpeedSeaiceVelocity
          default:
            return 1
        }
      },
      set(value) {
        switch (this.selected.field) {
          case 'current':
            this.$store.commit('map/setMaxSpeedCurrent', value)
            break
          case 'wind':
            this.$store.commit('map/setMaxSpeedWind', value)
            break
          case 'seaiceVelocity':
            this.$store.commit('map/setMaxSpeedSeaiceVelocity', value)
            break
          default:
            break
        }
      },
    },

    mapProjection() {
      return this.$store.state.map.mapProjection
    },

    chkMapProjectionWarning() {
      return (
        this.mapProjection === '3d' &&
        (this.field.name === 'current' ||
          this.field.name === 'wind' ||
          this.field.name === 'seaiceVelocity')
      )
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
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
    getSelectedAvailDatetimes,

    /**
     * @param {String}  fieldName - Name of the selected field
     * @param {String}  modelName
     * @param {Number}  iRegion
     */
    selectModel(field, model, iRegion = 0) {
      // --- If the currently selected button is clicked again, deselect it
      if (
        this.selected &&
        field.name === this.selected.field.name &&
        model.name === this.selected.modelName &&
        model.regions[iRegion] === this.selected.region
      )
        this.$store.commit('layers/setSelected', null)
      else {
        // const models = this.$store.state.layers.models
        // const model = models.filter((m) => m.name === modelName)[0]

        // --- Get availDateTimes for the selected model
        this.getSelectedAvailDatetimes(
          field.name,
          model.name,
          model.regions.length > 1,
          model.regions[iRegion].name
        ).then((res) => {
          const now = moment.utc()
          const diffArr = res.availDateTimes.map((dt) =>
            Math.abs(dt - now)
          )
          const iMinDiff = diffArr.indexOf(Math.min(...diffArr))
          this.$store.commit(
            'layers/setInterDateTime',
            res.availDateTimes[iMinDiff]
          )

          const hasLevels = model.fields.filter(f=>f.name===field.name)[0].hasLevels
          this.$store.commit('layers/setSelected', {
            field,
            modelName: model.name,
            isMultiRegion:model.regions.length>1,
            region: model.regions[iRegion],
            hasLevels,
            availDateTimes: res.availDateTimes,
            lastProcessed: res.lastProcessed,
          })
        })
      }
    },

    setShowModelInfo(model) {
      this.modelInfo = {
        show: true,
        title: model.name,
        longName: model.longName,
        description: model.description,
        link: model.link,
      }
    },

    getModels(fieldName) {
      return this.models.filter((m) =>
        m.fields.map((f) => f.name).includes(fieldName)
      )
    },

    isModelActive(model, fieldName) {
      return model.fields.filter((f) => f.name === fieldName)[0].active
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
