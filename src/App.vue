<template>
  <div id="app">
    <Spinner v-if="!ready" />
    <Comments v-if="ready" />
  </div>
</template>

<script>
import Comments from "@/components/Comments";
import Spinner from "@/components/Spinner";

export default {
  components: {
    Comments,
    Spinner,
  },
  computed: {
    ready() {
      return this.$store.getters.getReady;
    },
  },
  mounted() {
    this.$store.dispatch("fetchComments");
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
body {
  font-family: "Roboto", sans-serif;
  background: #e7e7e7;
  font-size: 14px;
}
#app {
  display: flex;
  justify-content: center;
}
</style>
