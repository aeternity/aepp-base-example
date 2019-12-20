<template>
  <div id="app">
    <div class="nav">
      <RouterLink :to="{ name: 'basic' }">
        Basic functionality
      </RouterLink>
      <RouterLink :to="{ name: 'contracts' }">
        Smart contracts
      </RouterLink>
      <RouterLink :to="{ name: 'base-aepp' }">
        Base aepp specific functionality
      </RouterLink>
    </div>

    <div
      v-if="sdkStatus"
      class="group"
    >
      <div>
        <div>SDK status</div>
        <div>{{ sdkStatus }}</div>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script>
export default {
  data: () => ({ sdkStatus: 'Waiting for resolving' }),
  async mounted() {
    this.sdkStatus = await this.$store.state.sdkPromise
      .then(() => '', error => `Error: ${error}`);
  },
};
</script>

<style lang="scss" src="./styles.scss" />
