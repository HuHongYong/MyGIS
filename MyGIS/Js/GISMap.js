dojo.require("esri.dijit.OverviewMap");
dojo.require("esri.dijit.HomeButton");
dojo.require("esri.dijit.Scalebar");
dojo.require("esri.dijit.LocateButton");
dojo.require("esri.toolbars.draw");
dojo.require("esri.tasks.GeometryService");
dojo.require("esri.tasks.LengthsParameters");
dojo.require("esri.symbols.SimpleLineSymbol");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
//---------------------------------------------------------------全局变量------------------------------------------------------------------
var map, baseServiceUrl, legend, drawToolbar, GeometryServices;
var legendLayers = [];
var arrLayers;
var loadMap = function () {
    map = new esri.Map("map", { nav: false, logo: false });
    baseServiceUrl = "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer";
    GeometryServices = new esri.tasks.GeometryService("http://localhost:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");
    var titleLayer = new esri.layers.ArcGISTiledMapServiceLayer(baseServiceUrl);
    map.addLayer(titleLayer);
    map.on("layer-add-result", initBaseTool);
}
//工具初始化
var initBaseTool = function () {
    //绘图工具
    drawToolbar = new esri.toolbars.Draw(map);
    //坐标工具
    map.on("mouse-move", function (evt) {
       // console.log(evt);
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
var showLegend = function () {
    if (legend != undefined && legend != null) {
        legend.destroy();
        legend = null;
    }
    showWindow('图例', 500, 200);
    legend = new esri.dijit.Legend({
        map: map,
        layerInfos: legendLayers
    }, "divWinMain");
    legend.startup();
}
dojo.addOnLoad(loadMap);
//---------------------------------------------------------绘制功能------------------------------------------------------------------------------
var drawActive=function(){
    //开始划线
    drawToolbar.activate(esri.toolbars.Draw.POLYLINE);
    drawToolbar.on("draw-end", function (geometry) {
        if (geometry.geometry.type == "polyline") {
            //取消绘制
            drawToolbar.deactivate();
            //测距条件
            var lenghtParams = new esri.tasks.LengthsParameters();
            lenghtParams.polylines = [geometry.geometry];
            lenghtParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
            lenghtParams.geodesic = true;
            //几何服务测距
            GeometryServices.lengths(lenghtParams, function (lenResult) {
                map.graphics.add(new esri.Graphic(geometry.geometry, new esri.symbol.SimpleLineSymbol()));
                map.infoWindow.setTitle("距离测量");
                map.infoWindow.setContent("测量长度：<strong>" + parseInt(String(lenResult.lengths[0])) + "千米</strong>");
                var paths=geometry.geometry.paths;
                var point = paths[0][paths[0].length - 1];
                map.infoWindow.show(new esri.geometry.Point(point[0], point[1], new esri.SpatialReference(geometry.geometry.spatialReference.wkid)));
            });
        }
    });
}
//---------------------------------------------------------句柄管理------------------------------------------------------------------------------
var closeAllHandler = function (bClearGraphics) {
    closeDrawToolbar();
};
var closeDrawToolbar = function () {
    if (drawToolbar != null) {
        drawToolbar.deactivate();
    }
}