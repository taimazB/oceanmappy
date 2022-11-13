export function updateProfile() {
  let category, field, model, date, time, level, dir, minOrg, step
  const gj = this.$store.state.map.drawGJ

  if (this.$store.state.layers.selected !== null) {
    category = this.$store.state.layers.selected.category
    field = this.$store.state.layers.selected.field
    model = this.$store.state.layers.selected.directory

    date = this.$store.state.layers.interDate
    time = this.$store.state.layers.interTime
    if (this.$store.state.layers.selected.hasLevels)
      level = `_${
        this.$store.state.layers.selected.levels.values[
          this.$store.state.layers.selected.levels.iLevel
        ]
      }`
    else level = ''
    dir = `${model}_${field}_${date}_${time}${level}`

    const selectedField = this.$store.state.layers.categories
      .filter((c) => c.name === category)[0].fields
      .filter((f) => f.name === field)[0]
    minOrg = selectedField.colorbar.minOrg
    step = selectedField.colorbar.step

    if (gj && gj.features.length > 0) {
      const promises = []
      gj.features.forEach((feature) => {
        const coords = feature.geometry.coordinates
        const color = feature.properties.color
        promises.push(
          this.$axios({
            method: 'get',
            url: `${
              process.env.tuvaq2Url
            }/profile?field=${field}&model=${model}&dir=${dir}&coords=${coords.join(
              ','
            )}&min=${minOrg}&step=${step}&color=${color}`,
          })
        )
      })
      Promise.all(promises).then((res) => {
        const data = []
        res.forEach((r, i) => {
          const args = r.config.url.split('&')
          const color = args[args.length - 1].split('=')[1]
          data.push({
            data: r.data.filter((d) => d[1]),
            color,
          })
        })
        this.$store.commit('map/setProfileData', data)
      })
    } else {
      this.$store.commit('map/setProfileData', [])
    }
  } else if (gj && gj.features.length > 0) {
    const data = []
    gj.features.forEach((f) => {
      data.push({
        data: [],
        color: '',
      })
    })
    this.$store.commit('map/setProfileData', data)
  }
}
