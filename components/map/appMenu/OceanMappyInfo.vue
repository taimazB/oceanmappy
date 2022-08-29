<template>
    <v-dialog v-model="showInfoDialog" width="500px">
      <v-card style="padding:5px">
          <v-card-title>Ocean Mappy</v-card-title>
          <v-card-subtitle>Powered by OceanGNS</v-card-subtitle>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    computed:{
        showInfoDialog:{
            get(){
                return this.$store.state.map.showInfoDialog
            },
            set(value){
                this.$store.commit('map/setShowInfoDialog',value)
            }
        }
    },
}
</script>