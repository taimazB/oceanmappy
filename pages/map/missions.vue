<template>
  <div>
    <missionsControlPanel />
  </div>
</template>

<script>
import missionsControlPanel from '~/components/map/missions/missionsControlPanel.vue'

export default {
  components: { missionsControlPanel },
  middleware: 'notAuthenticated',
}
</script>
