let map = null,point = null,marker = null,myIcon = null;

function initMap(x,y) {
	map = new BMap.Map("container");          // 创建地图实例 
	point = new BMap.Point(x, y);  // 创建点坐标 
	map.centerAndZoom(point, 15);  // 设置中心点以及缩放级别
	myIcon = new BMap.Icon(baseUrl + "image/public/marker.png",new BMap.Size(24,24)
		,{
			anchor: new BMap.Size(14,20) // 相对于图标左上角的偏移值
			,imageOffset: new BMap.Size(0,0)
		},
	);
	marker = new BMap.Marker(point,{icon:myIcon}); // 创建标注点
	map.addOverlay(marker);
}

function addressResolution(address,data,city) {
	if (data) {
		if (data.assetsPointX && data.assetsPointY) {
			initMap(data.assetsPointX, data.assetsPointY);
		} else {
			let analysis = new BMap.Geocoder();
			analysis.getPoint(address,function(point){
				if (point) {
					initMap(point.lng, point.lat);
				} else {
					initMap(104.389301,30.850458);
				}
			},city)
		}
	} else {
		initMap(104.389301,30.850458);
	}
}

addressResolution();
