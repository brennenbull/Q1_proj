
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(0.0,0.0),
    mapTypeId: 'terrain',
    // gestureHandling: 'cooperative',
    // disableDefaultUI: true
  });

  map.data.loadGeoJson("https://data.nasa.gov/resource/y77d-th95.geojson");

  function filterData(){
    map.data.forEach(function(feature){
      if(typeof(feature.f.year) === 'object' || feature.f.year === undefined || feature.f.year === null){
        console.log(feature);
        map.data.remove(feature);
      }
    });
  }

  filterData();

  map.data.setStyle(function(feature) {
    var mass = feature.getProperty('mass');
    return {
      icon: getCircle(mass),
      visible: false
    };
  });



}


function getRulerRange(min, max, step) {
  var range = '';
  var i = min;

  while (i <= max) {
    range += i + ' ';
    i = i + step;
  }
  return range;
}


var $yearSlide = $('input[name="year"]');
var $ruler1 = $('<div class="rangeslider__ruler" />');
var filterYear;
$yearSlide.rangeslider({
  onSlide: function(position, value) {
    filterYear = Number(value);
    console.log('hello');
    map.data.revertStyle();
    map.data.forEach(function(feature){
      if(typeof(feature.f.year) !== 'object' && feature.f.year !== undefined && feature.f.year !== null){
        if(Number(feature.f.year.substring(0,4)) < filterYear){
          map.data.overrideStyle(feature, {visible: true});
        }
      }
    });
  },


  polyfill: false,
  rangeClass: 'rangeslider',
  disabledClass: 'rangeslider--disabled',
  horizontalClass: 'rangeslider--horizontal',
  verticalClass: 'rangeslider--vertical',
  fillClass: 'rangeslider__fill',
  handleClass: 'rangeslider__handle',
  onInit: function() {
    $ruler1[0].innerHTML = getRulerRange(this.min, this.max, this.step);
    this.$range.prepend($ruler1);
  }
});

function getCircle(mass){
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: 0.5,
    scale:  Math.cbrt(mass * 0.00005) * 4,
    // scale:  Math.sqrt(mass * 0.00005) * 2,
    strokeColor: 'black',
    strokeWeight: 0.5
  };
}
