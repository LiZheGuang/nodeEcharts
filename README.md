# nodeEcharts

**一个通过NODE生成echarts生成地图并保存为图片的demo**

DEMO:index.js

lib : nodeEcharts.js 
（生成地图文件）

修改了node-echarts使其支持导出map形式的echarts

#### nodeEcharts

如果需要生成地图，在config中传入chinaJson字段（注意此字段是地图JSON）
如果不传，和node-echarts的使用方法相同。

（为什么生成那么多图片，是为了本身项目最后合并成GIF）

如果不需要生成那么多，把lib下的定时器删掉即可

##### 此文档仅为demo


**命令**

nodex index