<template>
  <div class="control-section">
    <div align="center">
      <ejs-accumulationchart
        style="display:block"
        :theme="theme"
        align="center"
        :title="title"
        :primaryXAxis="primaryXAxis"
        :primaryYAxis="primaryYAxis"
        :chartArea="chartArea"
        :legendSettings="legendSettings"
        :tooltip="tooltip"
      >
        <e-accumulation-series-collection>
          <e-accumulation-series
            :dataSource="seriesData"
            radius="70%"
            xName="axisX"
            yName="axisY"
            startAngle="0"
            :dataLabel="dataLabel"
            endAngle="360"
            innerRadius="40%"
            name="Project"
            explode="true"
            explodeOffset="10%"
            :explodeIndex="explodeIndex"
          ></e-accumulation-series>
        </e-accumulation-series-collection>
      </ejs-accumulationchart>
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
import Vue from "vue";
import { Browser } from "@syncfusion/ej2-base";
import {
  AccumulationChartPlugin,
  PieSeries,
  AccumulationLegend,
  AccumulationDataLabel,
  AccumulationTooltip
} from "@syncfusion/ej2-vue-charts";

Vue.use(AccumulationChartPlugin);
export default Vue.extend({
  data: function() {
    return {
      theme: "Material",
      seriesData: [
        { axisX: "Labour", axisY: 18, text: "18%" },
        { axisX: "Legal", axisY: 8, text: "8%" },
        { axisX: "Production", axisY: 15, text: "15%" },
        { axisX: "License", axisY: 11, text: "11%" },
        { axisX: "Facilities", axisY: 18, text: "18%" },
        { axisX: "Taxes", axisY: 14, text: "14%" },
        { axisX: "Insurance", axisY: 16, text: "16%" }
      ],

      //Initializing Primary X Axis
      primaryXAxis: {
        title: "Years",
        interval: Browser.isDevice ? 2 : 1,
        labelIntersectAction: "Rotate45",
        valueType: "Category",
        majorGridLines: { width: 0 },
        minorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        lineStyle: { width: 0 }
      },

      //Initializing Primary Y Axis
      primaryYAxis: {
        title: "Growth",
        minimum: -3,
        maximum: 3,
        interval: 1,
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        majorGridLines: { width: 1 },
        minorGridLines: { width: 1 },
        minorTickLines: { width: 0 },
        labelFormat: "{value}B"
      },
      chartArea: {
        border: {
          width: 0
        }
      },
      dataLabel: {
        visible: true,
        name: "text",
        position: "Inside",
        font: {
          fontWeight: "600",
          color: "#ffffff"
        }
      },
      legendSettings: {
        visible: true,
        position: "Top"
      },
      tooltip: { enable: true },

      explodeIndex: 3,
      title: "Project Cost Breakdown"
    };
  },
  provide: {
    accumulationchart: [
      AccumulationLegend,
      PieSeries,
      AccumulationTooltip,
      AccumulationDataLabel
    ]
  },
  methods: {}
});
</script>