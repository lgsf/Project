<template>
  <div class="control-section">
    <div align="center">
      <ejs-chart
        style="display:block"
        :theme="theme"
        align="center"
        :title="title"
        :primaryXAxis="primaryXAxis"
        :primaryYAxis="primaryYAxis"
        :chartArea="chartArea"
        :width="barWidth"
        :tooltip="tooltip"
        :load="load"
        :height="barHeight"
      >
        <e-series-collection>
          <e-series
            :dataSource="seriesData"
            type="Column"
            xName="x"
            yName="y"
            :name="seriesDataName"
            width="2"
            :marker="marker"
            :cornerRadius="cornerRadius"
          ></e-series>
          <e-series
            :dataSource="seriesData1"
            type="Column"
            xName="x"
            yName="y"
            :name="seriesData1Name"
            width="2"
            :marker="marker"
            :cornerRadius="cornerRadius"
          ></e-series>
          <e-series
            :dataSource="seriesData2"
            type="Column"
            xName="x"
            yName="y"
            :name="seriesData2Name"
            width="2"
            :marker="marker"
            :cornerRadius="cornerRadius"
          ></e-series>
        </e-series-collection>
      </ejs-chart>
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
import Vue from "vue";
import {
  ChartPlugin,
  ColumnSeries,
  Category,
  DataLabel,
  Tooltip,
  Legend
} from "@syncfusion/ej2-vue-charts";

Vue.use(ChartPlugin);

export default Vue.extend({
  props: [
    "bar-title",
    "bar-data",
    "bar-data1",
    "bar-data2",
    "bar-data-name",
    "bar-data1-name",
    "bar-data2-name",
    "bar-width",
    "bar-height"
  ],
  computed: {
    title: props => props.barTitle || "prop: bar-title, type: string",
    seriesData: props =>
      props.barData || [
        {
          x: 'prop: bar-data, type: object array ({x: "Name", y: Value })',
          y: 10
        }
      ],
    seriesData1: props => props.barData1 || [],
    seriesData2: props => props.barData2 || [],
    seriesDataName: props =>
      props.barDataName || "prop: bar-data-name, type: string",
    seriesData1Name: props => props.barData1Name || "",
    seriesData2Name: props => props.barData2Name || ""
  },
  data: function() {
    return {
      theme: "Material",

      //Initializing Primary X Axis
      primaryXAxis: {
        valueType: "Category",
        interval: 1,
        majorGridLines: { width: 0 }
      },
      chartArea: { border: { width: 0 } },

      //Initializing Primary Y Axis
      primaryYAxis: {
        majorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        lineStyle: { width: 0 },
        labelStyle: { color: "transparent" }
      },
      marker: {
        dataLabel: {
          visible: true,
          position: "Top",
          font: { fontWeight: "600", color: "#ffffff" }
        }
      },
      cornerRadius: {
        bottomLeft: 10,
        bottomRight: 10,
        topLeft: 10,
        topRight: 10
      },
      tooltip: {
        enable: true
      }
    };
  },
  provide: {
    chart: [ColumnSeries, Legend, DataLabel, Category, Tooltip]
  },
  methods: {}
});
</script>