dojo.require("esri.dijit.OverviewMap");
dojo.require("esri.dijit.HomeButton");
dojo.require("esri.dijit.Scalebar");
dojo.require("esri.dijit.LocateButton");
var map, baseServiceUrl;
var loadMap = function () {
    map = new esri.Map("map", { nav: false, logo: false });
    baseServiceUrl = "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer";
    var titleLayer = new esri.layers.ArcGISTiledMapServiceLayer(baseServiceUrl);
    map.addLayer(titleLayer);
    map.on("layer-add-result", initBaseTool)
}
//工具初始化
var initBaseTool = function () {
    //坐标工具
    map.on("mouse-move", function (evt) {
        console.log(evt);
    });
    //返回主视图
    var home = new esri.dijit.HomeButton({
        map: map
    }, "HomeButton");
    home.startup();
    //定位
   var geoLocate = new esri.dijit.LocateButton({
        map: map
    }, "LocateButton");
    geoLocate.startup();
    //鹰眼
    var overviewMapDijit =new esri.dijit.OverviewMap({
        map: map,
        expandFactor: 2,
        width: 200, // 默认值是地图高度的 1/4th  
        height: 150, // 默认值是地图高度的 1/4th   
        attachTo: "bottom-right",
        maximizeButton: true,   // 最大化,最小化按钮，默认false 
        visible: true
    });
    overviewMapDijit.startup();
    //比例尺
    var scalebar = new esri.dijit.Scalebar({ map: map, attachTo: "bottom-left", scalebarUnit: 'metric' });
}
dojo.addOnLoad(loadMap);