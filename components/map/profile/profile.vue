<template>
  <v-sheet light :height="height">
    <v-row style="text-align: center">
      <svg
        :width="width"
        :height="height"
        preserveAspectRatio="none"
        class="line-chart"
        :style="{
          padding: 0,
          margin: 0,
          'flex-grow': 1,
        }"
      >
        <!-- PLOT & VERTICAL LINES -->
        <g transform="translate(0, 0)">
          <path
            v-for="(line, i) in lines"
            :key="'VL' + i"
            :class="i === 0 ? 'line-chart__line' : 'line-chart__verticalLine'"
            :d="line.data"
            :style="{ stroke: line.color }"
          />

          <!-- <text
              v-for="(label, i) in labels"
              :key="'txt' + i"
              :x="label.x"
              :y="label.y"
              fill="#f30"
              text-anchor="middle"
              font-size="2em"
              font-weight="bold"
              opacity="0.5"
            >
              {{ label.text }}
            </text> -->
        </g>

        <!-- X-AXIS -->
        <g
          v-axis:x="scale"
          :transform="`translate(0,${height - 2 * padding})`"
        ></g>
        <!-- <text :x="width / 2" :y="height - 2" text-anchor="middle" font-size=".25em">
      Distance (km)
    </text> -->

        <!-- Y-AXIS -->
        <g v-axis:y="scale" :transform="`translate(${3 * padding},0)`"></g>
        <!-- <text
      :x="-height / 2"
      :y="padding / 2"
      text-anchor="middle"
      font-size=".25em"
      transform="rotate(-90)"
    >
      Speed (m/s)
    </text> -->
      </svg>
      <!-- </div> -->
      <!-- </v-sheet> -->
      <!-- </v-bottom-sheet> -->
      <!-- </div> -->
    </v-row>
  </v-sheet>
</template>

<script>
import * as d3 from 'd3'
import { decodeColor } from '../layers/decodeColor'

export default {
  // ####################################################################
  // ######################## --- DIRECTIVES --- ########################
  directives: {
    axis(el, binding) {
      const axis = binding.arg
      const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axis]
      const methodArg = binding.value[axis]

      d3.select(el).call(d3[axisMethod](methodArg))
    },
  },

  // ###############################################################
  // ######################## --- PROPS --- ########################
  // props: ['data','width', 'height'],
  props: ['width','height'],

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return { padding: 10 }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    profileData() {
      return this.$store.state.map.profile.data
    },

    rangeX() {
      return [3 * this.padding, this.width - 3 * this.padding]
    },

    rangeY() {
      return [this.height - 2 * this.padding, 2 * this.padding]
    },

    scale() {
      const x = d3.scaleLinear().range(this.rangeX).nice()
      const y = d3.scaleLinear().range(this.rangeY).nice()
      d3.axisLeft().scale(x)
      d3.axisBottom().scale(y)
      const mergedArray = [].concat(...this.profileData.map(p=>p.data))
      x.domain([
        d3.min(mergedArray, (d) => d[0]),
        d3.max(mergedArray, (d) => d[0]),
      ])
      y.domain([
        d3.min(mergedArray, (d) => d[1]),
        d3.max(mergedArray, (d) => d[1]),
      ])

      return { x, y }
    },

    path() {
      return d3
        .line()
        .x((d) => this.scale.x(d[0]))
        .y((d) => this.scale.y(d[1]))
    },

    lines() {
      const listOfLines = []
      this.profileData.forEach((obj, i) => {
        listOfLines.push({
          data: this.path(obj.data),
          color: obj.color,
        })
      })

      // if (this.profileVerticals) {
      //   this.profileVerticals.forEach((profileVertical) => {
      //     listOfLines.push({ data: this.path(profileVertical), color: '#e33' })
      //   })
      // }

      return listOfLines
    },

    labels() {
      const listOfLabels = []
      // this.profileVerticals.forEach((profileVertical, indx) => {
      //   listOfLabels.push({
      //     x: this.scale.x(profileVertical[0][0]),
      //     y: this.scale.y(
      //       0.5 * (profileVertical[0][1] + profileVertical[1][1])
      //     ),
      //     text: indx + 1,
      //   })
      // })

      return listOfLabels
    },

    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    },
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    decodeColor,
  },
}
</script>

<style scoped lang="sass">
.line-chart
  margin: 10px
  &__line
    fill: none
    stroke: #333333
    stroke-width: 1px
  &__verticalLine
    fill: none
    stroke: #f30
    stroke-width: 1px

// .vBottom-profile
//   margin-bottom: 20px!important
//   position: absolute

.tick
  font-size: 7px
</style>
