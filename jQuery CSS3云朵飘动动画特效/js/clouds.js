(function($) {
  function animate(options) {
    var element = $(options.element);
    var id = element.attr("id");

    if (options.type == "sprite" && options.fps) {
      var width = options.width;
      var height = options.height;

      if ($.clouds.instances[id]["currentFrame"] == 0) {
        if (options.onFirstFrame){
          options.onFirstFrame(element);
        }
      } else if ($.clouds.instances[id]["currentFrame"] == frames.length - 1) {
        if (options.onLastFrame) {
          options.onLastFrame(element);
        }
      } else if (options.onFrame && options.onFrame[$.clouds.instances[id]["currentFrame"]]) {
        options.onFrame[$.clouds.instances[id]["currentFrame"]](element);
      } else if (options.rewind == true) {
        if ($.clouds.instances[id]["currentFrame"] <= 0) {
          $.clouds.instances[id]["currentFrame"] = frames.length - 1;
				} else {
          $.clouds.instances[id]["currentFrame"] = $.clouds.instances[id]["currentFrame"] - 1;
        }
      } else {
        if ($.clouds.instances[id]["currentFrame"] >= frames.length - 1) {
          $.clouds.instances[id]["currentFrame"] = 0;
        } else {
          $.clouds.instances[id]["currentFrame"] = $.clouds.instances[id]["currentFrame"] + 1;
        }
      }
      
      var yPos = $.clouds.bgY(element);

      element.css({
        "background-position": frames[$.clouds.instances[id]["currentFrame"]] + "px " + yPos
      });

      if (options.bounce && options.bounce[0] > 0 && options.bounce[1] > 0) {
        var ud = options.bounce[0];
        var lr = options.bounce[1];
				var ms = options.bounce[2];

        element.animate({
          top: "+=" + ud + "px",
          left: "-=" + lr + "px"
        }, ms).animate({
          top: "-=" + ud + "px",
          left: "+=" + lr + "px"
        }, ms);
      }
    } else if (options.type == "pan") {
      if (!$.clouds.instances[id]["_stopped"]) {
        if (options.dir == "left") {
          $.clouds.instances[id]["l"] = ($.clouds.instances[id]["l"] - (options.speed || 1)) || 0;
          $.clouds.instances[id]["t"] = $.clouds.bgY(element).replace("px", "");
        } else {
          $.clouds.instances[id]["l"] = ($.clouds.instances[id]["l"] + (options.speed || 1)) || 0;
          $.clouds.instances[id]["t"] = $.clouds.bgY(element).replace("px", "");
        }

        var bgLeft = $.clouds.instances[id]["l"].toString();

        if (bgLeft.indexOf("%") == -1) {
          bgLeft += "px ";
        } else {
          bgLeft += " ";
        }

        var bgTop = $.clouds.instances[id]["t"].toString();

        if (bgTop.indexOf("%") == -1) {
          bgTop += "px ";
        } else {
          bgTop += " ";
        }

        $(element).css({
          "background-position": bgLeft + bgTop
        });
      }
    }
    
    window.setTimeout(function () {
      animate(options);
    }, parseInt(1000 / options.fps));
  }

  jQuery.clouds = {
    bgY: function(element) {
      /*if (navigator.userAgent.match(/msie/)) {
        var bgY = $(element).css("background-position-y") || 0;
      } else {*/
        var bgY = ($(element).css("background-position") || " ").split(" ")[1];
      //}
      
      return bgY;
    },
    bgX: function(element) {
      if (navigator.userAgent.match(/msie/)) {
        var bgX = $(element).css("background-position-x") || 0;
      } else {
         var bgX = ($(element).css("background-position") || " ").split(" ")[0];
      }
  
       return bgX;
     }
   }

  $.fn.spritely = function(options) {
    var options = $.extend({
      type: "sprite",
      width: null,
      height: null,
      fps: 12
    }, options);

    var id = $(this).attr("id");

    if (!$.clouds.instances) {
       $.clouds.instances = {};
    }

    if (!$.clouds.instances[id]) {
      if (options.startAtFrame) {
        $.clouds.instances[id] = {
          currentFrame: options.startAtFrame - 1
        };
      } else {
        $.clouds.instances[id] = {
          currentFrame: -1
        };
      }
    }

    $.clouds.instances[id]["type"] = options.type;
      
    options.element = this;
    options.width = options.width || $(this).width() || 100;
    options.height = options.height || $(this).height() || 100;

    animate(options);
  };
    
  $.fn.clouds = function (options) {
    var options = $.extend({
      type: "pan",
      dir: "left",
      continuous: true,
      speed: 1
    }, options || {});
  
    return $(this).spritely(options);
  };
})(jQuery);