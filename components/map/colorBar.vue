<template>
  <section>
    <v-sheet id="colorBar" rounded width="30" :style="styleObj">
      <label
        v-for="(stop, i) in labels"
        :key="i"
        :style="{
          top: 100 * stop.location + '%',
          left: '35px',
        }"
        v-html="stop.label"
      ></label>
      <v-icon
        x-small
        style="top: 100%; width: 100%; position: absolute"
        @click="modifyColorbar(field)"
        >mdi-pencil</v-icon
      >
    </v-sheet>

    <!-- COLORBAR MODIFIER -->
    <v-dialog v-model="colorbarDialog" width="auto">
      <v-card>
        <v-card-title style="place-content: center">SST</v-card-title>
        <v-row>
          <v-col cols="auto">
            <v-row
              v-for="(color, i) in colormap"
              :key="i"
              class="ma-0 py-0"
              :style="{ background: i === iColormap ? 'lightgray' : 'none' }"
            >
              <v-col cols="1" class="pa-0" style="align-self: center">
                <v-icon x-small color="red" @click="removeColor(i)"
                  >mdi-delete</v-icon
                >
              </v-col>
              <v-col cols="9" class="py-1">
                <vue-numeric-input
                  v-model="color.value"
                  :min="minOrg"
                  :max="maxOrg"
                  :step="step"
                  style="transform: scale(0.75)"
                ></vue-numeric-input>
              </v-col>
              <v-col cols="1" style="place-self: center" class="py-1 px-0">
                <div
                  :style="{
                    background: color.color,
                    'border-radius': '10px',
                    width: '10px',
                    height: '10px',
                  }"
                  @click="setColor(i)"
                />
              </v-col>
            </v-row>

            <!-- COLOR PALETTES -->
            <v-row class="ma-0 py-1">
              <v-select
                v-model="selectedPallete"
                label="Palettes"
                :items="palettes"
              >
                <template #item="{ item }">
                  <v-row class="ma-1">
                    <v-col cols="3" class="pa-1" style="font-size: x-small">
                      {{ item.name }}
                    </v-col>
                    <v-col cols="9" class="pa-1">
                      <v-sheet
                        rounded
                        :style="generatePalette(item.colors)"
                      ></v-sheet>
                    </v-col>
                  </v-row>
                </template>
                <template #selection="{ item }">
                  {{ item.name }}
                </template>
              </v-select>
            </v-row>
          </v-col>

          <!-- COLOR PICKER -->
          <v-col cols="auto" style="align-self: center">
            <v-color-picker
              v-model="selectedColor"
              class="ma-2"
              hide-inputs
            ></v-color-picker>
          </v-col>
        </v-row>

        <!-- ERRORS -->
        <v-row v-if="!allowPass" style="place-content: center; color: red"
          >Values must be in order. Please fix first.</v-row
        >

        <!-- BUTTONS -->
        <v-row>
          <v-col cols="12" style="text-align: center">
            <v-btn color="success" small @click="add">Add</v-btn>
            <v-btn color="primary" small :disabled="!allowPass" @click="apply"
              >Apply</v-btn
            >
            <v-btn color="warning" small @click="setRange"
              >Range to Region</v-btn
            >
            <v-btn color="secondary" small @click="reset">Reset</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import moment from 'moment'

export default {
  props: ['field'],

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      colormap: null,
      styleObj: '',
      colorbarDialog: false,
      iColormap: 0,
      selectedColor: '',
      allowPass: true,
      selectedPallete: null,
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    NOAAregion() {
      return this.$store.state.map.NOAAbathymetryRegion
    },

    minOrg() {
      return this.field.colorbar.minOrg
    },

    maxOrg() {
      return this.field.colorbar.maxOrg
    },

    step() {
      return this.field.colorbar.step
    },

    colormapGlobal() {
      return this.field.colorbar.colormap
    },

    labels() {
      const minValue = this.colormapGlobal[0].value
      const maxValue = this.colormapGlobal[this.colormapGlobal.length - 1].value
      const range = maxValue - minValue

      const labels = []
      this.colormapGlobal.forEach((color) => {
        labels.push({
          location: (maxValue - color.value) / range,
          label: color.value.toFixed(this.field.colorbar.toFixed),
        })
      })
      return labels
    },

    palettes() {
      return this.$store.state.layers.palettes
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################

  watch: {
    colormapGlobal: {
      handler() {
        this.styleObj = this.generateStyleObj()
      },
      deep: true,
    },

    colormap: {
      handler() {
        // --- Check numbers
        this.allowPass = true
        for (let i = 0; i < this.colormap.length - 1; i++) {
          if (this.colormap[i].value >= this.colormap[i + 1].value) {
            this.allowPass = false
          }
        }
      },
      deep: true,
    },

    selectedColor() {
      this.colormap[this.iColormap].color = this.selectedColor
    },

    selectedPallete() {
      if (!this.selectedPallete) return
      const min = this.colormap[0].value
      const max = this.colormap[this.colormap.length - 1].value

      this.colormap = []
      this.selectedPallete.colors.forEach((color, i) => {
        const value =
          this.step *
          Math.round(
            (min +
              (i / (this.selectedPallete.colors.length - 1)) * (max - min)) /
              this.step
          )
        this.colormap.push({
          value,
          color,
        })
      })

      this.apply()
    },
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    this.colormap = JSON.parse(JSON.stringify(this.colormapGlobal))
    this.selectedColor = this.colormap[0].color
    this.styleObj = this.generateStyleObj()
  },

  // #################################################################
  // ######################## --- METHODS --- ########################

  methods: {
    generateStyleObj() {
      const valueMin = this.colormapGlobal[0].value
      const valueRange =
        this.colormapGlobal[this.colormapGlobal.length - 1].value - valueMin

      const colorGradient = this.colormapGlobal
        .map(
          (c) =>
            `rgb(${this.hex2rgb(c.color)}) ${
              (100 * (c.value - valueMin)) / valueRange
            }%, rgb(${this.hex2rgb(c.color)}) ${
              (100 * (c.value - valueMin)) / valueRange
            }%`
        )
        .join()
      return {
        background: `linear-gradient(to top, ${colorGradient})`,
      }
    },

    generatePalette(colors) {
      const n = colors.length
      const colorGradient = colors
        .map(
          (color, i) =>
            `rgb(${this.hex2rgb(color)}) ${(100 * i) / n}%, rgb(${this.hex2rgb(
              color
            )}) ${(100 * i) / n}%`
        )
        .join()
      return {
        width: '100%',
        height: '20px',
        background: `linear-gradient(to right, ${colorGradient})`,
      }
    },

    modifyColorbar() {
      this.colorbarDialog = true
    },

    setColor(i) {
      this.iColormap = i
      this.selectedColor = this.colormap[i].color
    },

    add() {
      const lastColor = JSON.parse(
        JSON.stringify(this.colormap[this.colormap.length - 1])
      )
      this.colormap.push(lastColor)
    },

    apply() {
      // --- Remove all rendered tile images
      const sessionID = this.$store.state.map.sessionID
      this.$axios({
        method: 'get',
        url: `${process.env.tuvaq2Url}/cleanTiles?id=${sessionID}`,
      })

      // --- New session ID
      this.$store.commit(
        'map/setSessionID',
        `${moment.utc().format('YYYYMMDDTHHmmss-SSS')}_${parseInt(
          10000 * Math.random()
        )}_${this.username}`
      )

      console.log(this.field)
      // const colorbar = this.field.colorbar
      this.$store.commit('layers/setColormap', {
        field: this.field,
        colormap: this.colormap,
      })
      // colorbar.colormap = JSON.parse(JSON.stringify(this.colormap))
    },

    removeColor(i) {
      this.colormap.splice(i, 1)
    },

    reset() {
      // --- Remove all rendered tile images
      const sessionID = this.$store.state.map.sessionID
      this.$axios({
        method: 'get',
        url: `${process.env.tuvaq2Url}/cleanTiles?id=${sessionID}`,
      })

      // --- New session ID
      this.$store.commit(
        'map/setSessionID',
        `${moment.utc().format('YYYYMMDDTHHmmss-SSS')}_${parseInt(
          10000 * Math.random()
        )}_${this.username}`
      )

      const colorbar = this.field.colorbar
      this.colormap = JSON.parse(JSON.stringify(colorbar.colormapOrg))
      colorbar.colormap = JSON.parse(JSON.stringify(colorbar.colormapOrg))

      this.selectedPallete = null
    },

    setRange() {
      const bounds = this.$store.state.map.bnds
      const SW = bounds._sw
      const NE = bounds._ne

      if (this.field.field === 'Bathymetry') {
        const selected = this.$store.state.layers.selectedBathymetry

        this.$axios({
          method: 'post',
          url: `${process.env.tuvaq2Url}/getMinMax`,
          data: {
            field: this.field.field,
            model: selected.modelDir,
            dir: 'filled_gray',
            SW,
            NE,
          },
        }).then((data) => {
          const minMax = data.data
            .replace(/(\r\n|\n|\r)/gm, '')
            .split(',')
            .map((d) => parseInt(d))
          const min = minMax[0]
          const max = minMax[1]
          const n = this.colormap.length
          for (let i = 0; i < n; i++) {
            const value = min + (i * (max - min)) / (n - 1)
            this.colormap[i].value =
              Math.round(10 * (this.minOrg + this.step * value)) / 10
          }
          this.apply()
        })
      } else if (this.field.field === 'Altimetry') {
        const selectedAltimetryVariable =
          this.$store.state.layers.selectedAltimetryVariable
        const features = this.$store.state.layers.altimetryShownGJs.features

        const visibleFeatures = features.filter(
          (f) =>
            f.geometry.coordinates[0] >= SW.lng &&
            f.geometry.coordinates[0] <= NE.lng &&
            f.geometry.coordinates[1] >= SW.lat &&
            f.geometry.coordinates[1] <= NE.lat
        )

        const valueOfVisibleFeatures = visibleFeatures.map(
          (f) => f.properties[selectedAltimetryVariable]
        )

        const min = Math.min(...valueOfVisibleFeatures.filter((value) => value))
        const max = Math.max(...valueOfVisibleFeatures.filter((value) => value))

        const n = this.colormap.length
        for (let i = 0; i < n; i++) {
          const value = min + (i * (max - min)) / (n - 1)
          this.colormap[i].value = value
          // Math.round(10 * (this.minOrg + this.step * value)) / 10
        }
        this.apply()
      } else {
        const selected = this.$store.state.layers.selected
        let dir = `${selected.modelDir}_${selected.field}_${this.$store.state.layers.interDate}_${this.$store.state.layers.interTime}`
        if (this.$store.state.layers.selected.depthProperties.hasDepth)
          dir = `${dir}_${
            this.$store.state.layers.selected.depthProperties.depthValues[
              this.$store.state.layers.selected.depthProperties.iDepth
            ]
          }`

        this.$axios({
          method: 'post',
          url: `${process.env.tuvaq2Url}/getMinMax`,
          data: {
            field: this.field.name,
            model: selected.modelDir,
            dir,
            SW,
            NE,
          },
        }).then((data) => {
          const minMax = data.data
            .replace(/(\r\n|\n|\r)/gm, '')
            .split(',')
            .map((d) => parseInt(d))
          const min = minMax[0]
          const max = minMax[1]
          const n = this.colormap.length
          for (let i = 0; i < n; i++) {
            const value = min + (i * (max - min)) / (n - 1)
            this.colormap[i].value =
              Math.round(10 * (this.minOrg + this.step * value)) / 10
          }
          this.apply()
        })
      }
    },
  },
}
</script>

<style scoped>
@import 'assets/css/map.css';
</style>
