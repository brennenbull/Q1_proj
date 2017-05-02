$(document).ready(function(){
  var meteorObjectArray = [];

  function makeMeteorObject(meteordata) {
    for(var i = 0; i < meteordata.length; i++){
      var meteor = {}

      if(meteordata[i].geolocation !== undefined){
        meteor.coordinates = [meteordata[i].geolocation.coordinates[1], meteordata[i].geolocation.coordinates[0]]
        meteor.pixelPosition = convertGeoToPixel(meteordata[i].geolocation.coordinates[1], meteordata[i].geolocation.coordinates[0]);
      }
      if(meteordata[i].mass !== undefined){
        meteor.mass = meteordata[i].mass;
      }
      if(meteordata[i].name !== undefined){
        meteor.name = meteordata[i].name;
      }
      if(meteordata[i].year !== undefined){
        meteor.year = meteordata[i].year;
      }
      meteorObjectArray.push(meteor);
    }
  }

  makeMeteorObject(meteordata);


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


  function mapPoint(array) {
    for(var i = 0; i < array.length; i++){
      if(array[i].pixelPosition !== undefined){
        var point = document.createElement('div');
        point.className = 'point';
        point.id = 'point-' + i;
        point.style.position = 'absolute';
        point.style.left = Math.floor(array[i].pixelPosition.x)+'px';
        point.style.top = Math.floor(array[i].pixelPosition.y)+'px';
        if(Number(array[i].mass) < 1000){
          point.className += ' point-small';
          worldMap.appendChild(point);
        } else if (Number(array[i].mass) < 10000){
          point.className += ' point-med';
          worldMap.appendChild(point);
        } else if (Number(array[i].mass) > 10000){
          point.className += ' point-lg';
          worldMap.appendChild(point);
        }
      }
    }
  }


  mapPoint(meteorObjectArray);

  function addFilterPoints(filterVal){
    for(var i = 0; i < meteorObjectArray.length; i++){
      if(meteorObjectArray[i].pixelPosition !== undefined && meteorObjectArray[i].year !== undefined){
        if(filterVal >= Number(meteorObjectArray[i].year.substring(0,4))){
          var point = document.createElement('div');
          point.className = 'point';
          point.id = 'point-' + i;
          point.style.position = 'absolute';
          point.style.left = Math.floor(meteorObjectArray[i].pixelPosition.x)+'px';
          point.style.top = Math.floor(meteorObjectArray[i].pixelPosition.y)+'px';
          if(Number(meteorObjectArray[i].mass) < 1000){
            point.className += ' point-small';
            worldMap.appendChild(point);
          } else if (Number(meteorObjectArray[i].mass) < 10000){
            point.className += ' point-med';
            worldMap.appendChild(point);
          } else if (Number(meteorObjectArray[i].mass) > 10000){
            point.className += ' point-lg';
            worldMap.appendChild(point);
          }
        }
      }
    }
  }

  // function smallest(array){
  //   var smallestObj = '';
  //   var small = Number(meteorObjectArray[0].year.substring(0,4));
  //   for(var i = 1; i < meteorObjectArray.length; i++){
  //     if(meteorObjectArray[i].year !== undefined){
  //       if(small > Number(meteorObjectArray[i].year.substring(0,4))){
  //         small = Number(meteorObjectArray[i].year.substring(0,4));
  //         smallestObj = meteorObjectArray[i];
  //       }
  //     }
  //   }
  //   return smallestObj;
  // }
  // console.log(smallest(meteorObjectArray));

  function smallest(array){
    var objectNoYear = 0;
    for(var i = 1; i < meteorObjectArray.length; i++){
      if(meteorObjectArray[i].year === undefined || meteorObjectArray[i].year.substring(0,4) === '0000'){
        objectNoYear += 1;
      }
    }
    return objectNoYear;
  }

  console.log(smallest(meteorObjectArray));
  //
  // function newest(array){
  //   var newestObj = '';
  //   var young = Number(meteorObjectArray[0].year.substring(0,4));
  //   for(var i = 1; i < meteorObjectArray.length; i++){
  //     if(meteorObjectArray[i].year !== undefined){
  //       if(young < Number(meteorObjectArray[i].year.substring(0,4))){
  //         young = Number(meteorObjectArray[i].year.substring(0,4));
  //         newestObj = meteorObjectArray[i];
  //       }
  //     }
  //   }
  //   return newestObj;
  // }
  //
  // console.log(newest(meteorObjectArray));
  //
  // function lightest(array){
  //   var lightObj = '';
  //   var small = Number(meteorObjectArray[0].mass);
  //   for(var i = 1; i < meteorObjectArray.length; i++){
  //     if(meteorObjectArray[i].mass !== undefined){
  //       if(small > Number(meteorObjectArray[i].mass)){
  //         small = Number(meteorObjectArray[i].mass);
  //         lightObj = meteorObjectArray[i];
  //       }
  //     }
  //   }
  //   return lightObj;
  // }
  // console.log(lightest(meteorObjectArray));
  //
  // function heavest(array){
  //   var heavestObj = '';
  //   var young = Number(meteorObjectArray[0].mass);
  //   for(var i = 1; i < meteorObjectArray.length; i++){
  //     if(meteorObjectArray[i].mass !== undefined){
  //       if(young < Number(meteorObjectArray[i].mass)){
  //         young = Number(meteorObjectArray[i].mass);
  //         heavestObj = meteorObjectArray[i];
  //       }
  //     }
  //   }
  //   return heavestObj;
  // }
  // console.log(heavest(meteorObjectArray));


  var $yearSlide = $('input[name="year"]');
  var $ruler1 = $('<div class="rangeslider__ruler" />');
  var $massSlide = $('input[name="mass"]');
  var $ruler2 = $('<div class="rangeslider__ruler" />');

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
      // console.log(value);
      // console.log(position);
    },

    onSlideEnd: function(position, value) {
      $('.point').remove();
      var filterYear = Number(value);
      console.log(filterYear);
      addFilterPoints(filterYear);
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

  $massSlide.rangeslider({
    onSlide: function(position, value){
      // console.log(position);
      // console.log(value);
    },
    onSlideEnd: function(position, value) {
      console.log(position);
      console.log(value);
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
    }

  });

});
