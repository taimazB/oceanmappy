<template>
  <!-- <section
    style="
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.75);
      border-radius: 25px;
      display:flex;
      flex-direction:column;
      padding: 5px
    "
  > -->
  <section
    style="
      
      position: absolute;
      top: 2px;
      right: 2px;
      background: rgba(255, 255, 255, 0.75);
      border-radius: 2px;
    "
  >
    <div style="width: 30px">
      <v-row
        v-for="(tool, i) in tools"
        :key="i"
        class="pa-0"
        style="justify-content: center"
      >
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              x-small
              :dark="tool.chkActive()"
              :disabled="tool.chkDisabled()"
              class="my-1"
              v-bind="attrs"
              v-on="on"
              @click="tool.onClick()"
            >
              <v-icon>{{ tool.icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ tool.longName }}</span>
        </v-tooltip>
      </v-row>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      tools: [
        {
          longName: 'Distance',
          icon: 'mdi-ruler',
          chkActive: () => {
            return this.distanceOn
          },
          chkDisabled: () => {
            return false
          },
          onClick: () => {
            this.$store.commit('map/setDistanceOn', !this.distanceOn)
          },
        },
        {
          longName: 'Profile XY',
          icon: 'mdi-chart-bell-curve-cumulative',
          chkActive: () => {
            return this.profileXYon
          },
          chkDisabled: () => {
            return false
          },
          onClick: () => {
            this.$store.commit('map/setProfileXYon', !this.profileXYon)
          },
        },
        // {
        //   longName: 'Profile Time',
        //   icon: 'mdi-chart-bell-curve-cumulative',
        //   chkActive: () => {
        //     return this.profileTimeOn
        //   },
        //   chkDisabled: () => {
        //     return false
        //   },
        //   onClick: () => {
        //     this.$store.commit('map/setProfileTimeOn', !this.profileTimeOn)
        //   }
        // },
      ],
    }
  },

  computed: {
    distanceOn() {
      return this.$store.state.map.distanceOn
    },

    profileXYon() {
      return this.$store.state.map.profileXYon
    },

    profileTimeOn() {
      return this.$store.state.map.profileTimeOn
    },
  },
}
</script>
