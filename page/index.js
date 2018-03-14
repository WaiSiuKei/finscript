import * as echarts from 'echarts'
import { Interpretor } from "../src/interpretor";
import { bars } from './bars'
import { Editor, edit } from "brace";
import { DataSource } from "src/dataSource";
import { forEach } from 'lodash'
import * as indicators from './indicators'

let editor

const interpretor = new Interpretor()
const finscript = interpretor.eval.bind(interpretor)

const rawData = bars.slice()
const dates = rawData.map((item) => new Date(item.utc_time).toLocaleTimeString());
const data = rawData.map((item) => [+item.open, +item.high, +item.low, +item.close]);
let inputChart = echarts.init(document.getElementById('input-chart'));
let outputChart = echarts.init(document.getElementById('output-chart'));

const evalScript = () => {
  clearLog()
  let txt = editor.getValue()
  let ret = finscript(txt)

  if (ret instanceof Error) {
    showError(ret)
  } else {
    try {
      let outputs = interpretor.calculateIndicator(ret, new DataSource(bars))
      mountOutputChart(outputs)
    } catch(e) {
      console.log(e)
      showError(e)
    }
  }
}

let txtArea = document.getElementById('log-area')
const showError = e => {
  txtArea.value = e.message
}

const clearLog = () => {
  txtArea.value = ''
}

const mountInputChart = () => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
        type: 'cross',
        lineStyle: {
          color: '#376df4',
          width: 2,
          opacity: 1
        }
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#606060' } }
    },
    yAxis: {
      scale: true,
      axisLine: { lineStyle: { color: '#606060' } },
      splitLine: { show: false }
    },
    animation: false,
    series: [
      {
        type: 'candlestick',
        name: 'AAPL',
        data: data,
        itemStyle: {
          normal: {
            color: '#d75442',
            color0: '#6ba583',
            // borderColor: '#5b1a13',
            borderColor: '#d75442',
            // borderColor0: '#225437'
            borderColor0: '#6ba583'
          }
        }
      }
    ]
  };
  inputChart.setOption(option)
}

const mountOutputChart = (outputs) => {
  let options = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#606060' } }
    },
    yAxis: {
      type: 'value',
      max: 'dataMax',
      min: 'dataMin',
      axisLine: { lineStyle: { color: '#606060' } }
    },
    series: [],
    animation: false
  };
  outputChart.clear()
  forEach(outputs, (v, k) => {
    options.series.push({
      name: k,
      type: 'line',
      data: v
    })
  })
  outputChart.setOption({ ...options })
}

const mountEditor = () => {
  editor = edit('input-editor')
}

const registerBtnClick = () => {
  document.getElementById('eval-btn').addEventListener('click', () => {
    evalScript()
  })
}

const showDemo = () => {
  let str = `n = CONST(20)
std_close_n = STD(C, n)
boll = MA(C, n)
ub = boll + n * std_close_n
lb = boll - n * std_close_n
return { boll, ub, lb }
`
  editor.setValue(str, -1)
  evalScript()
}

const mountTemplateOptions = () => {
  const select = document.getElementById('template-select')
  forEach(indicators, (str, name) => {
    let opt = document.createElement('option')
    opt.label = name
    opt.innerText = name
    select.appendChild(opt)
  })
  select.addEventListener('change', (e) => {
    editor.setValue(indicators[(e.target).value], -1)
    evalScript()
  })
}

window.addEventListener('DOMContentLoaded', () => {
  mountInputChart()
  mountEditor()
  registerBtnClick()
  mountTemplateOptions()
  showDemo()
})
