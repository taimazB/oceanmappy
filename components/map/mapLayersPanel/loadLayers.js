import axios from 'axios'
import moment from 'moment'

export function getFields() {
  axios({
    method: 'get',
    url: `${process.env.baseUrl}/fields`,
  }).then((respond) => {
    this.$store.commit('layers/setFields', respond.data)
  })
}

export function getModels() {
  axios({
    method: 'get',
    url: `${process.env.baseUrl}/models`,
  }).then((respond) => {
    this.$store.commit('layers/setModels', respond.data)
  })
}

export async function getSelectedAvailDatetimes(
  fieldName,
  modelName,
  isMultiRegion,
  regionName
) {
  // this.$store.state.layers.categories.forEach((category) => {
  //   category.fields.forEach((field) => {
  //     field.models.forEach((model) => {
  //       if (model.active && model.hasDateTime) {
  // model.regions.forEach((region, iRegion) => {
  const data = {
    // category: category.name, // --- Not needed by the data server, but needed later on this file, so keep it here!
    // field: field.name,
    // model: model.name,
    // multiRegion: model.regions.length > 1,
    // regionName: region.name,
    // iRegion,
    fieldName,
    modelName,
    isMultiRegion,
    regionName,
  }

  return await axios({
    method: 'post',
    url: `${process.env.tuvaq2Url}/getAvailDateTimes_20221026`,
    data,
  })
    .then((results) => {
      const availDateTimes = results.data.dateTimes.filter(d=>d).map((d) => {
        // const arr = d.split('_')
        // return { date: arr[0], time: arr[1] }
        return moment.utc(d, 'YYYYMMDD_HH')
      })
      // const hrDiff = Math.round(
      //   moment
      //     .utc()
      //     .diff(
      //       moment.utc(results.data.lastProcessed.replace(/(\r\n|\n|\r)/gm, ''))
      //     ) /
      //     3600 /
      //     1000
      // )
      const lastProcessed = moment.utc(results.data.lastProcessed.replace(/(\r\n|\n|\r)/gm, ''))
      

      // this.$store.commit('layers/setAvailDateTimes', {
      return {
        // data,
        availDateTimes: this.demo
          ? availDateTimes.slice(0, 20)
          : availDateTimes,
        lastProcessed,
      }
      // })
    })
    .catch((err) => {
      console.log(err)
    })
}
