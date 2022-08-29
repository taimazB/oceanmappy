<template>
  <v-container
    ref="profileContainer"
    style="width:20%; height:20%; background: ghostwhite; position: absolute; top:0;left:0;border-radius:25px"
  >
    <!-- <plotXY
      :data="profileData"
      :width="profileContainerWidth"
      :height="profileContainerHeight"
    /> -->
  </v-container>
</template>

<script>
// import plotXY from './plotXY'

export default {
  // components: { plotXY },

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      profileContainerWidth: 0,
      profileContainerHeight: 0
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    profileData() {
      return this.$store.state.map.profileData
    }
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    this.profileContainerWidth = this.$refs.profileContainer.clientWidth
    this.profileContainerHeight = this.$refs.profileContainer.clientHeight
  }
}
</script>
