$(document).ready(function(){
  $.getJSON("https://data.nasa.gov/resource/y77d-th95.json")
  .done(function(data){
    var objectArray = [];
    function makeMeteorObject(data, array) {
      for(var i = 0; i < data.length; i++){
        if(data[i].geolocation !== undefined && data[i].mass !== undefined && data[i].name !== undefined && data[i].year !== undefined){
          var meteor = {}
          meteor.coordinates = [data[i].geolocation.coordinates[1], data[i].geolocation.coordinates[0]]
          meteor.pixelPosition = convertGeoToPixel(data[i].geolocation.coordinates[1], data[i].geolocation.coordinates[0]);
          meteor.mass = data[i].mass;
          meteor.name = data[i].name;
          meteor.year = data[i].year;
        }
        array.push(meteor);
      }
    }
    makeMeteorObject(data, objectArray);

  console.log(objectArray);


    // var meteorObjectArray = [];
    //
    // function makeMeteorObject(meteordata) {
    //   for(var i = 0; i < meteordata.length; i++){
    //     if(meteordata[i].geolocation !== undefined && meteordata[i].mass !== undefined && meteordata[i].name !== undefined && meteordata[i].year !== undefined){
    //       var meteor = {}
    //       meteor.coordinates = [meteordata[i].geolocation.coordinates[1], meteordata[i].geolocation.coordinates[0]]
    //       meteor.pixelPosition = convertGeoToPixel(meteordata[i].geolocation.coordinates[1], meteordata[i].geolocation.coordinates[0]);
    //       meteor.mass = meteordata[i].mass;
    //       meteor.name = meteordata[i].name;
    //       meteor.year = meteordata[i].year;
    //     }
    //     meteorObjectArray.push(meteor);
    //   }
    // }
    //
    // makeMeteorObject(meteordata);


    function bottomRadians(bottomlat){
      var mapLatBottomDegree = bottomlat * Math.PI / 180;
      return mapLatBottomDegree;
    }


    function convertGeoToPixel(latitude, longitude) {
      var mapLatBottomDegree = bottomRadians(-72.3);
      var x = (longitude - (-180)) * (1021 / 360);
      latitude = latitude * Math.PI / 180;
      var worldMapWidth = ((1021 / 360) * 360) / (2 * Math.PI);
      var mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
      var y = 600 - ((worldMapWidth / 2 * Math.log((1 + Math.sin(latitude)) / (1 - Math.sin(latitude)))) - mapOffsetY);

      return { "x": x , "y": y};
    }


    var $worldMap = $('.worldMap');
    var worldMap = document.getElementsByClassName('worldMap')[0];

    function addPointToMap(dataArray, filterDate){
      for (var i = 0; i <dataArray.length; i++) {
        if(Number(dataArray[i].year.substring(0,4)) < filterDate){
          var $point = $('<div />');
          var className = 'point';
          var idName = 'point-' + i;
          var styles ={
            position: 'absolute',
            left: Math.floor(dataArray[i].pixelPosition.x)+'px',
            top: Math.floor(dataArray[i].pixelPosition.y)+'px'
          }
          $point.addClass(className);
          $point.attr('id', idName);
          $point.css(styles);
          if(Number(dataArray[i].mass) < 1000){
            $point.addClass('point-xs');
            worldMap.appendChild($point[0]);
          } else if (Number(dataArray[i].mass) < 10000){
            $point.addClass('point-sm');
            worldMap.appendChild($point[0]);
          } else if (Number(dataArray[i].mass) < 100000){
            $point.addClass('point-md');
            worldMap.appendChild($point[0]);
          } else if (Number(dataArray[i].mass) < 1000000) {
            $point.addClass('point-lg');
            worldMap.appendChild($point[0]);
          } else if(Number(dataArray[i].mass) > 1000000) {
            $point.addClass('point-xl');
            worldMap.appendChild($point[0]);
          }
        }
      }
    }

    function filterByMass(array, massMin, massMax ){
      var massFilterArray = [];
      for(var i = 0; i < array.length-1; i++){
        if(array[i].mass < massMax &&  array[i].mass > massMin){
          massFilterArray.push(array[i]);
        }
      }
      return massFilterArray;
    }


    var $yearSlide = $('input[name="year"]');
    var $ruler1 = $('<div class="rangeslider__ruler" />');
    var $massSlide = $('input[name="mass"]');
    var $ruler2 = $('<div class="rangeslider__ruler" />');
    var filterMassMin = 0;
    var filterMassMax = 10000000;

    function getRulerRange(min, max, step) {
      var range = '';
      var i = min;

      while (i <= max) {
        range += i + ' ';
        i = i + step;
      }
      return range;
    }

    $yearSlide.rangeslider({
      onSlide: function(position, value) {
        $('.point').remove();
        var filterYear = Number(value);
        addPointToMap(filterByMass(objectArray, filterMassMin, filterMassMax), filterYear);
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
        addPointToMap(filterByMass(objectArray, filterMassMin, filterMassMax), $yearSlide.val());
      }
    });

    $massSlide.rangeslider({
      onSlideEnd: function(position, value) {
        if(value === 0){
          filterMassMin = 0;
          filterMassMax = 1000;
        } else if(value === 10){
          filterMassMin = 1000;
          filterMassMax = 10000;
        } else if(value === 20){
          filterMassMin = 10000;
          filterMassMax = 100000;
        } else if(value === 30){
          filterMassMin = 100000;
          filterMassMax = 1000000;
        } else if (value === 40){
          filterMassMin = 1000000;
          filterMassMax = 100000000;
        } else if (value === 50){
          filterMassMin = 0;
          filterMassMax = 100000000;
        }
      },
      polyfill: false,
      rangeClass: 'rangeslider',
      disabledClass: 'rangeslider--disabled',
      horizontalClass: 'rangeslider--horizontal',
      verticalClass: 'rangeslider--vertical',
      fillClass: 'rangeslider__fill',
      handleClass: 'rangeslider__handle',
      onInit: function(){
        $ruler2[0].innerHTML = "<1.0Kg  <10kg  <100kg  <1000kg  >1000kg  All";
        this.$range.prepend($ruler2);
        filterMassMin = 0;
        filterMassMax = 100000000;
      }
    });
  });
});
