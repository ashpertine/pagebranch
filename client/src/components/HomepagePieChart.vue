<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, computed, onMounted } from 'vue';

const props = defineProps(['theme', 'stories']);

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

provide(THEME_KEY, props.theme);

const data = computed(() => {
  const result = props.stories.reduce((acc, story) => {
    if (story.is_private) {
      acc[0].value++
    } else {
      acc[1].value++
    }
    return acc;
  }, [{ value: 0, name: "private" }, { value: 0, name: "public" }]).filter(data => data.value !== 0);

  return result;
})

const option = computed(() => ({
  backgroundColor: 'transparent',
  title: {
    text: 'Public/Private Ratio',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['public', 'private'],
  },
  series: [
    {
      name: 'Public/Private Ratio',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: data.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}));

</script>
<style scoped>
.chart {
  height: 320px;
}
</style>
<template>
  <v-chart class="chart" :option="option" autoresize />
</template>
