<template>
  <v-expansion-panels v-model="expandedField" accordion>
    <v-expansion-panel v-for="(field, i) in fields" :key="i">
      <v-expansion-panel-header
        hide-actions
        :color="colorHeader"
        class="pl-3"
        style="min-height: 36px"
      >
        <span>{{ startCase(field.name) }}</span>
      </v-expansion-panel-header>

      <v-expansion-panel-content class="py-3">
        <!-- IF MORE THAN 1 FIELD -->
        <section v-if="field.subFields">
          <v-expansion-panels v-model="expandedSubField" accordion>
            <v-expansion-panel
              v-for="(subField, j) in field.subFields"
              :key="j"
            >
              <v-expansion-panel-header
                hide-actions
                color="#ddd"
                class="pl-6"
                style="min-height: 36px"
              >
                <span>{{ startCase(subField.name) }}</span>
              </v-expansion-panel-header>

              <v-expansion-panel-content class="py-3">
                <modelControl :field="subField" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </section>

        <!-- IF ONLY 1 FIELD -->
        <modelControl v-else :field="field" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import modelControl from '~/components/map/mapLayersPanel/modelControl.vue'

export default {
  components: { modelControl },
  props: { group: { type: String, required: true } },

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      colorHeader: '#eee',
      expandedField: null,
      expandedSubField: null,
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    // categories() {
    //   return this.$store.state.layers.categories.filter(
    //     (field) => field.type === this.type && field.show
    //   )
    // },

    fields() {
      return this.$store.state.layers.fields.filter(
        (field) => field.group === this.group
      )
    },
  },

  // ##################################################################
  // ######################## --- METHODS --- ########################
  methods: {},
}
</script>
