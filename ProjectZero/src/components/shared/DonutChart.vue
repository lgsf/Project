<template>
  <div class="control-section">
    <div align="center">
      <ejs-accumulationchart
        :key="componentKey"
        style="display:block"
        :theme="theme"
        align="center"
        :title="title"
        :primaryXAxis="primaryXAxis"
        :primaryYAxis="primaryYAxis"
        :chartArea="chartArea"
        :legendSettings="legendSettings"
        :tooltip="tooltip"
        :width="dntWidth"
        :height="dntHeight"
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
            :name="legend"
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
  props: ["dnt-title", "dnt-data", "dnt-legend", "dnt-width", "dnt-height"],
  computed: {
    title: props => props.dntTitle || "prop: dnt-title, type: string",
    seriesData: props =>
      props.dntData || [
        {
          axisX:
            'prop: dnt-data, type: object array ({axisX: "Name", axisY: Value, text: "" })',
          axisY: 10,
          text: ""
        }
      ],
    legend: props => props.dntLegend || "prop: dnt-legend, type: string"
  },
  data: function() {
    return {
      componentKey: Math.round(Math.random() * 10000),
      theme: "Material",

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

      explodeIndex: 3
    }
  },
  provide: {
    accumulationchart: [
      AccumulationLegend,
      PieSeries,
      AccumulationTooltip,
      AccumulationDataLabel
    ]
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    }
  }
})
</script>