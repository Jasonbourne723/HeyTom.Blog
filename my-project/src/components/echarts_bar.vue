<template>
  <div>
    <div id="main"  style="width: 450px;height:300px;"></div>
  </div>
</template>
<script>
  export default {
    name: "echarts_bar",
    props: {
      Title: {
        type: String
      },
      Legend: {
        type: Array
      },
      X: {
        type: Array
      },
      Series: {
        type: Array
      }
    },
    data() {
      return {
        BarData: {
          title: {
            text: this.Title
          },
          tooltip: {},
          legend: {
            data: this.Legend
          },
          xAxis: {
            data: this.X
          },
          yAxis: {},
          series: this.Series
        }
      }
    },
    methods: {
      GetBar: function () {
        var myChart = this.$echarts.init(document.getElementById('main'));
        console.log("11111");
        console.log(this.BarData);
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(this.BarData);
      }
    },
    mounted() {
      this.GetBar();
    }
  };
</script>