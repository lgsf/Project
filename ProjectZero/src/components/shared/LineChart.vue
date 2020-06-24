<template>
  <div class="control-section">
    <div align="center">
      <ejs-chart
        style="display:block"
        :theme="theme"
        align="center"
        :title="title"
        :primaryXAxis="configX"
        :primaryYAxis="configY"
        :tooltip="tooltip"
        :chartArea="chartArea"
      >
        <e-series-collection>
          <e-series
            v-for="(serie, i) in seriesData"
            :key="i"
            :dataSource="serie.data"
            type="Line"
            xName="x"
            yName="y"
            :name="serie.title"
            width="2"
            dashArray="5,1"
            :marker="marker"
          ></e-series>
        </e-series-collection>
      </ejs-chart>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Browser } from "@syncfusion/ej2-base";
import {
  ChartPlugin,
  LineSeries,
  Legend,
  Tooltip,
  Category
} from "@syncfusion/ej2-vue-charts";

Vue.use(ChartPlugin);

export default {
  props: ["line-title", "line-data", "line-x-config", "line-y-config"],
  computed: {
    title: props => props.lineTitle || "prop: line-title, type: string",
    seriesData: props =>
      props.lineData || [
        {
          title: "Série",
          data: [
            { x: 1, y: 1 },
            { x: 2, y: 3 },
            { x: 3, y: 5 },
            { x: 4, y: 7 },
            { x: 5, y: 9 }
          ]
        }
      ],
    configX() {
      return Object.assign({}, this.primaryXAxis, this.lineXConfig);
    },
    configY() {
      return Object.assign({}, this.primaryYAxis, this.lineYConfig);
    }
  },
  data() {
    return {
      theme: "Material",
      width: Browser.isDevice ? "100%" : "60%",
      primaryXAxis: {
        majorGridLines: { width: 0 },
        minorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        interval: 1,
        lineStyle: { width: 0 },
        valueType: "Category"
        //title: "Período"
      },
      primaryYAxis: {
        //title: "",
        lineStyle: { width: 0 },
        // minimum: 0,
        // maximum: 400,
        // interval: 100,
        majorTickLines: { width: 0 },
        majorGridLines: { width: 1 },
        minorGridLines: { width: 1 },
        minorTickLines: { width: 0 },
        labelFormat: "{value}"
      },
      chartArea: {
        border: {
          width: 0
        }
      },
      marker: {
        visible: true
      },
      tooltip: {
        enable: true
      }
    };
  },
  provide: {
    chart: [LineSeries, Legend, Tooltip, Category]
  }
};
</script>