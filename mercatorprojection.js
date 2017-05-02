var MERCATOR_RANGE = 256;

function bound(value, opt_min, opt_max) {
  if (opt_min != null) value = Math.max(value, opt_min);
  if (opt_max != null) value = Math.min(value, opt_max);
  return value;
}

function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
  return rad / (Math.PI / 180);
}

function MercatorProjection() {
  this.pixelOrigin_ = new google.maps.Point( MERCATOR_RANGE / 2, MERCATOR_RANGE / 2);
  this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360;
  this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI);
};

MercatorProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
  var me = this;

  var point = opt_point || new google.maps.Point(0, 0);

  var origin = me.pixelOrigin_;
  point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;
  // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
  // 89.189.  This is about a third of a tile past the edge of the world tile.
  var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
  point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
  return point;
};

MercatorProjection.prototype.fromPointToLatLng = function(point) {
  var me = this;

  var origin = me.pixelOrigin_;
  var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
  var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
  var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
  return new google.maps.LatLng(lat, lng);
};
//pixelCoordinate = worldCoordinate * Math.pow(2,zoomLevel)

//cooprdinatesToPixel------>>>>>
// function convertGeoToPixel(latitude, longitude ,
//    mapWidth , // in pixels
//    mapHeight , // in pixels
//    mapLonLeft , // in degrees
//    mapLonDelta , // in degrees (mapLonRight - mapLonLeft);
//    mapLatBottom , // in degrees
//    mapLatBottomDegree) // in Radians
// {
//     var x = (longitude - mapLonLeft) * (mapWidth / mapLonDelta);
//
//     latitude = latitude * Math.PI / 180;
//     var worldMapWidth = ((mapWidth / mapLonDelta) * 360) / (2 * Math.PI);
//     var mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
//     var y = mapHeight - ((worldMapWidth / 2 * Math.log((1 + Math.sin(latitude)) / (1 - Math.sin(latitude)))) - mapOffsetY);
//
//     return { "x": x , "y": y}
// }
// console.log(convertGeoToPixel(0.0 , 0.0, 1021, 600, -180, 360, -72.3, bottomRadians(-72.3)));
