export function addIceberg() {
    this.$store.commit('map/setShowDatePicker', false)
    for (let m = 1; m <= 12; m++) {
        this.map.setLayoutProperty(`iceberg-m${String(m).padStart(2, '0')}`, 'visibility', 'visible')
    }
}


export function removeIceberg() {
    this.$store.commit('map/setShowDatePicker', true)
    for (let m = 1; m <= 12; m++) {
        this.map.setLayoutProperty(`iceberg-m${String(m).padStart(2, '0')}`, 'visibility', 'none')
    }
}