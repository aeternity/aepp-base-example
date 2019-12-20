<template>
  <div>{{ text }}</div>
</template>

<script>
export default {
  props: {
    promise: { type: Promise, default: null },
  },
  data: () => ({ text: '' }),
  watch: {
    promise: {
      async handler(value) {
        if (!value || !value.then) {
          this.text = 'Not a promise';
          return;
        }
        this.text = 'Waiting for resolving';
        this.text = await value.then(
          result => (typeof result === 'object'
            ? JSON.stringify(result, null, 4) : result.toString()),
          (error) => {
            console.warn(error); // eslint-disable-line no-console
            return `Error: ${error}`;
          },
        );
      },
      immediate: true,
    },
  },
};
</script>
