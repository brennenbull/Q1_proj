(function() {
  var cards = document.querySelectorAll(".cardContainer.effect__click");
  for ( var i  = 0, len = cards.length; i < len; i++ ) {
    var card = cards[i];
    clickListener( card );
  }

  function clickListener(card) {
    card.addEventListener( "click", function() {
      var c = this.classList;
      c.contains("flipped") === true ? c.remove("flipped") : c.add("flipped");
    });
  }
})();


$('#drop').click(function(){
  if($('.data').css('display') == 'none'){
    $('.data').css('display', '');
  }
  $('.learn').slideToggle(900, 'swing', function(){
    if($('#drop').text() == 'Learn More'){
      $('#drop').text('See The Data');
      $('.data').css('display', 'none');
      $('.header').addClass('sticky-top');
    } else {
      $('#drop').text('Learn More');
      $('.header').removeClass('sticky-top');
    }
  });
});
