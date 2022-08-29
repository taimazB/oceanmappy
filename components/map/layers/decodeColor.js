export function decodeColor(colormap, r, g, b, a, unit = true) {
  if (a === 0) return ''

  const colorRange = colormap.filter(
    obj =>
      r >= Math.min(obj.minColor[0], obj.maxColor[0]) &&
      r <= Math.max(obj.minColor[0], obj.maxColor[0]) &&
      g >= Math.min(obj.minColor[1], obj.maxColor[1]) &&
      g <= Math.max(obj.minColor[1], obj.maxColor[1]) &&
      b >= Math.min(obj.minColor[2], obj.maxColor[2]) &&
      b <= Math.max(obj.minColor[2], obj.maxColor[2])
  )[0]
  if (!colorRange) {
    return ''
  } else {
    // --- Check all 3 in case some are NaN
    let ratio =
      (r - colorRange.minColor[0]) /
      (colorRange.maxColor[0] - colorRange.minColor[0])
    if (isNaN(ratio))
      ratio =
        (g - colorRange.minColor[1]) /
        (colorRange.maxColor[1] - colorRange.minColor[1])
    if (isNaN(ratio))
      ratio =
        (b - colorRange.minColor[2]) /
        (colorRange.maxColor[2] - colorRange.minColor[2])
    const value =
      colorRange.minValue + ratio * (colorRange.maxValue - colorRange.minValue)

    // if (unit) return `${value.toFixed(1)} ${this.$store.state.layers.selected.unit}`
    // else return value
    return value
  }
}

export function decodeColorCurrent(r, g, b) {
  const u = (this.$store.state.layers.selected.max * (r - 127)) / 127
  const v = (this.$store.state.layers.selected.max * (g - 127)) / 127
  const speed = Math.sqrt(u ** 2 + v ** 2)
  let direction = (Math.atan2(v, u) * 180) / Math.PI - 90
  if (direction < 0) direction += 360
  direction = 360 - direction // --- Counterclockwise to Clockwise

  return { speed, direction }
}
