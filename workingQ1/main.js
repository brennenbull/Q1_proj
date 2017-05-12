

$.getJSON("https://data.nasa.gov/resource/y77d-th95.json")
.done(function(data){

  var tableArray = [['Mass', 'Meteorites']];
  var pieArray = [['Class', 'Meteorites', {role:'tooltip'}]];
  var $yearSlide = $('input[name="year"]');
  var $ruler1 = $('<div class="rangeslider__ruler" />');
  var filterYear=$yearSlide.val();
  var $timeLable = $('.timeLable');

  function makeClassChart(data, array){
    var meteorClass = {};
    for(var j = 0; j < data.length; j++){
      if(data[j].recclass !== undefined && data[j].year !== undefined){
        if(Number(data[j].year.substring(0,4)) < Number(filterYear)){
          var mClass = data[j].recclass.substring(0,1);
          if(!meteorClass.hasOwnProperty(mClass)){
            meteorClass[mClass] = 1;
          } else {
            meteorClass[mClass] += 1;
          }
        }
      }
    }
    var meteorInfo = {
    'L': 'L chondrite: One of the most common meteor groups',
    'H': 'H chondrite: One of the most common meteor groups',
    'U': 'Ureilite: Rare type of stony meteor',
    'C': 'Carbonaceous Chondrites',
    'S': 'Shergottites: Named after Sherghati, India',
    'A': 'Achondrite: Stony meteorites',
    'O': 'Ordinary chondrite: comprise 87% of all finds',
    'M': 'Martian: rock formed on mars',
    'E': 'Enstatite chondrite',
    'I': 'Iron: Historically used as and important sorce of forging iron',
    'D': 'Diogenit: Named after a greek philosopher who first suggest meteors where from outer space',
    'P': 'Pallasite: Formed by impact-generated mixtures',
    'K': 'Kakangari: Subclass of Carbonaceous Chondrites',
    'W': 'Winonaite Group',
    'R': 'Rumuriti: Subclass of Carbonaceous Chondrites'
    };
    for(var key in meteorClass){
      var tooltip;
      for(var classtype in meteorInfo){
        if(key == classtype){
          tooltip = meteorInfo[classtype];
        }
      }
      array.push([key + ' Class', meteorClass[key], tooltip + ' ' + meteorClass[key]]);
    }
  }

  makeClassChart(data, pieArray);

  function makeDataArray(data, array, filterYear) {
    var meteor = {
      '0-10g': 0,
      '10-100g': 0,
      '100g-1kg': 0,
      '1kg-5kg': 0,
      '5kg-10kg': 0,
      '10kg-50kg': 0,
      '50kg-100kg': 0,
      '100kg-500kg': 0,
      '500kg-1000kg':0,
      '>1000kg': 0
    };

    for(var i = 0; i < data.length; i++){
      if(data[i].geolocation !== undefined && data[i].mass !== undefined && data[i].name !== undefined && data[i].year !== undefined){
        if(Number(data[i].year.substring(0,4)) < Number(filterYear)){
          if(data[i].mass < 10){
            meteor['0-10g'] += 1;
          } else if(data[i].mass > 10 && data[i].mass < 100){
            meteor['10-100g'] += 1;
          } else if(data[i].mass > 100 && data[i].mass < 1000){
            meteor['100g-1kg'] += 1;
          } else if(data[i].mass > 1000 && data[i].mass < 5000){
            meteor['1kg-5kg'] += 1;
          } else if(data[i].mass > 5000 && data[i].mass < 10000){
            meteor['5kg-10kg'] += 1;
          } else if(data[i].mass > 10000 && data[i].mass < 50000){
            meteor['10kg-50kg'] += 1;
          } else if(data[i].mass > 50000 && data[i].mass < 100000){
            meteor['50kg-100kg'] += 1;
          } else if(data[i].mass > 100000 && data[i].mass < 500000){
            meteor['100kg-500kg'] += 1;
          } else if(data[i].mass > 500000 && data[i].mass < 1000000){
            meteor['500kg-1000kg'] += 1;
          } else {
            meteor['>1000kg'] += 1;
          }
        }
      }
    }

    for(var key in meteor){
      array.push([key, meteor[key]]);
    }
  }

  makeDataArray(data, tableArray, filterYear);

  google.charts.load('current', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawAreaChart);
  google.charts.setOnLoadCallback(drawPieChart);


  function drawAreaChart() {
    let data = google.visualization.arrayToDataTable(tableArray);

    let options = {
      title: 'Meteorites by Mass',
      curveType: 'function',
      legend: { position: 'bottom'},
      hAxis: {textStyle: {fontSize: 10} },
      vAxis: {viewWindow:{max: 300, min: 0}},
      backgroundColor: '#E4E4E4'
    };

    let chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

  function drawPieChart(){
    let data = google.visualization.arrayToDataTable(pieArray);

    let options = {
      title: 'Meteorites by Class',
      sliceVisibilityThreshold: 0.04,
      backgroundColor: '#E4E4E4'
    };

    let chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
  }


  $yearSlide.rangeslider({
    onSlide: function(position, value) {
      filterYear = Number(value);
      tableArray = [['Mass', 'Meteorites']];
      pieArray = [['Class', 'Meteorites', {role:'tooltip'}]];
      makeDataArray(data, tableArray, filterYear);
      makeClassChart(data, pieArray);
      drawAreaChart();
      drawPieChart();
      $timeLable.text(filterYear);
      map.data.revertStyle();
      map.data.forEach(function(feature){
        if(typeof(feature.f.year) !== 'object' && feature.f.year !== undefined){
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
      $timeLable.text(filterYear);
    }
  });


  $('.bottom').on('click', function(event){
    var $centerChart = $('.centerChart');
    var $centerChartContents = $('.centerChart').clone().children();
    var $target = $(event.target).closest('.charts');
    console.log($target);
    var $targetStorage = $target.clone();
    var $chartBox = $target.parent();
    $chartBox.empty();
    $chartBox.append($centerChartContents);
    $centerChart.empty();
    $centerChart.append($targetStorage);
    drawPieChart();
    drawAreaChart();
    initMap();
  });

});

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(0.0,0.0),
    mapTypeId: 'terrain',
    scrollwheel: false
  });

  map.data.loadGeoJson("https://data.nasa.gov/resource/y77d-th95.geojson");

  map.data.setStyle(function(feature) {
    var mass = feature.getProperty('mass');
    return {
      icon: getCircle(mass),
      visible: false
    };
  });


  function getCircle(mass){
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'red',
      fillOpacity: 0.5,
      scale:  Math.cbrt(mass * 0.00005) * 4,
      strokeColor: 'black',
      strokeWeight: 0.5
    };
  }

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
