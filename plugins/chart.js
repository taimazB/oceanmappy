import Vue from 'vue'
import { Scatter } from 'vue-chartjs'
import moment from 'moment'

Vue.component('Scatter', {
  extends: Scatter,
  props: ['data', 'options', 'mission', 'save'],
  watch: {
    data() {
      this.renderChart(this.data, this.options)
    },
    save() {
      const a = document.createElement('a')
      a.href = this.$refs.canvas.toDataURL('image/jpeg', 1.0)
      a.download = `${this.mission['glider name']}_${moment.utc().format()}.jpg`
      a.click()
    }
  },
  mounted() {
    this.addPlugin({
      id: 'custom_canvas_background_color',
      beforeDraw: chart => {
        const ctx = chart.canvas.getContext('2d')
        ctx.save()
        ctx.globalCompositeOperation = 'destination-over'
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, chart.width, chart.height)
        ctx.restore()
      }
    })
    this.renderChart(this.data, this.options)
  }
})
