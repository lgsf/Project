<template>
  <v-row>
    <v-col cols="4">
      <donut-chart />
    </v-col>
    <v-col cols="4">
      <donut-chart />
    </v-col>
    <v-col cols="4">
      <donut-chart />
    </v-col>
  </v-row>
</template>
<script>
import DonutChart from "@/components/shared/DonutChart";
export default {
  components: { DonutChart },
  data() {
    return {};
  }
};
</script>