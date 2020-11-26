<template>
    <div>
        <div id="main1" style="width: 450px;height:300px;"></div>
    </div>
</template>
<script>
    export default {
        name: "echarts_pie",
        props: {
            Title: {
                type: String
            },
            Data: {
                type: Array
            }
        },
        data() {
            return {
                PieData: {
                    title: {
                        text: this.Title
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',    // 设置图表类型为饼图
                            radius: '70%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                            data: this.Data
                        }
                    ]
                }
            }
        },
        methods: {
            GetPie() {
                var myChart = this.$echarts.init(document.getElementById('main1'));

                myChart.setOption(this.PieData)
            }
        },
        mounted() {
            this.GetPie();
        }
    };
</script>