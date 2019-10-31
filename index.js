var node_echarts = require('node-echarts');
const fs = require('fs')
let path = require('path');
let chinaJson = require('./map.json')

let data = [{ name: "福建", value: 87.78846153846153 }, { name: "河北", value: 137.5 }, { name: "北京", value: 51.82692307692307 }, { name: "山西", value: 63.46153846153847 }, { name: "河南", value: 211.53846153846155 }, { name: "江苏", value: 96.25 }, { name: "陕西", value: 60.28846153846154 }, { name: "云南", value: 56.05769230769231 }, { name: "湖南", value: 105.76923076923077 }, { name: "新疆", value: 47.59615384615385 }, { name: "广东", value: 275 }, { name: "台湾", value: 0.1798076923076923 }, { name: "江西", value: 98.36538461538461 }, { name: "山东", value: 222.1153846153846 }, { name: "海南", value: 10.048076923076923 }, { name: "安徽", value: 89.90384615384616 }, { name: "黑龙江", value: 40.19230769230769 }, { name: "湖北", value: 78.26923076923076 }, { name: "甘肃", value: 34.90384615384615 }, { name: "四川", value: 126.92307692307693 }, { name: "浙江", value: 87.78846153846153 }, { name: "辽宁", value: 41.25 }, { name: "青海", value: 8.461538461538462 }, { name: "内蒙古", value: 40.19230769230769 }, { name: "天津", value: 28.55769230769231 }, { name: "西藏", value: 1.798076923076923 }, { name: "贵州", value: 71.92307692307693 }, { name: "宁夏", value: 22.211538461538463 }, { name: "上海", value: 24.326923076923077 }, { name: "广西", value: 99.42307692307692 }, { name: "香港特别行政区", value: 0.033846153846153845 }, { name: "吉林", value: 29.615384615384617 }, { name: "澳门特别行政区", value: 0.023269230769230768 }, { name: "重庆", value: 56.05769230769231 }]


let geoCoordMap = {}

let intMap = async () => {
  let data = chinaJson
  let features = data.features
  geoJson = data
  features.map((res) => {
    // console.log(res)
    geoCoordMap[res.properties.name] = res.properties.cp
  })
}

intMap()

var convertData = function (data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value)
      });
    }
  }
  return res;
};

const option = {
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item'
  },
  visualMap: {
    pieces: [
      { min: 0, max: 100, symbolSize: 8, color: "rgba(180,246,255,1)", colorAlpha: "0.4" },
      { min: 100, max: 200, symbolSize: 16, color: "rgba(180,246,255,1)", colorAlpha: "0.6" },
      { min: 200, max: 300, symbolSize: 18, color: "rgba(180,246,255,1)", colorAlpha: "0.8" },
    ],
    // min: 0,
    // max: 300,
    show: false, //是否显示左下角
    splitNumber: 3,
    type: "piecewise",
    // color: ['rgba(80,246,255,0.6)'],

    textStyle: {
      color: '#fff'
    },
  },
  geo: {
    map: 'china',
    zoom: 1.25,
    label: {
      emphasis: {
        show: false
      }
    },
    large: true,
    itemStyle: {
      normal: {
        areaColor: '#47C8FF',
        borderColor: '#3DB1FF',
        borderWidth: "0.8"
      },
      emphasis: {
        areaColor: "red"
      }
    },
    silent: true //关闭地图区域点击事件
  },
  series: [
    {
      name: 'pm2.5',
      type: 'scatter',
      clickable: false,
      coordinateSystem: 'geo',
      data: convertData(data),
      symbolSize: function (val) {
        return val[2] / 12;
      },
      legendHoverLink: false,
      hoverAnimation: false,
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        emphasis: {
          borderColor: '#fff',
          borderWidth: 0
        }
      }
    },
    {
      name: 'Top 5',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: convertData(data.sort(function (a, b) {
        return b.value - a.value;
      }).slice(0, 3)),
      encode: {
        value: 2
      },
      symbolSize: function (val) {
        return val[2] / 25;
      },
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'fill',
        period: 5,//周期
        scale: 3,//波纹比例
      },
      hoverAnimation: false,
      // label: {
      //   normal: {
      //     formatter: '{b}',
      //     position: 'right',
      //     show: true
      //   }
      // },
      itemStyle: {
        emphasis: {
          borderColor: '#fff',
          borderWidth: 0
        }
      }
      // zlevel: 1
    }
  ]
}
module.exports = option

fs.readdirSync('image').map((file) => {
  fs.unlink(`image/${file}`,(err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('delete ok');
    }
  });
});

  node_echarts({
    path: __dirname + `/image/area`,
    option: option,
    width: 1000,
    height: 500
  }, chinaJson)


