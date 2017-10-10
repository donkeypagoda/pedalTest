$(function() {
  'use strict';

  $(".dial")
    .dial({
      fgColor:"#222222",
      bgColor:"#EEEEEE",
      thickness: 0.3,
      change : function (value) {
          console.log("change : ", value);
          // disto1.curve = makeDistortionCurve(parseFloat(distoSat.value));
      }

      })
    .css({display:'inline',padding:'0px 10px'});


}());
