(function() { this.JST || (this.JST = {}); this.JST["templates/embed"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<script src="//cdnjs.cloudflare.com/ajax/libs/pym/0.4.1/pym.min.js"></script>\n<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>\n<style>\n\t.filmstrip-outer-wrapper {\n\t    width: 100%;\n\t    margin-bottom: 1em;\n\t}\n\n\t.filmstrip-wrapper {\n        width: 720px;\n        height: 528px;\n    }\n\t \n    .filmstrip {\n        width: 100%;\n        height: 100%;\n        -webkit-animation-name: gif;\n\t\t-webkit-animation-duration: 2s;\n\t\t-webkit-animation-iteration-count: infinite;\n\t\t-webkit-animation-timing-function: linear;\n\t\t-webkit-animation-timing-function:steps(1, end);\n        background-size: 800px;\n    }\n\n    @-webkit-keyframes gif {\n    \t'); 
  	    var num_frames = imageUrls.length,
  	    frames_array = num_frames - 1,
  	    increment = Math.floor(100 / frames_array);
  
  		for (var i = 0; i < num_frames; i++) {
  			var frame_percentage = i * increment;
  			if ((i == frames_array) && (frame_percentage !== 100)) { ; __p.push('\n\t\t\t\t100% { background-image: url(\'',  imageUrls[i] ,'\');}\n\t\t\t');  } else { ; __p.push('\n\t\t\t\t',  frame_percentage ,'% { background-image: url(\'',  imageUrls[i] ,'\');}\n\t\t\t');  }
  		} ; __p.push('\n    }\n</style>\n\n<div class="filmstrip-outer-wrapper">\n\t<div class="filmstrip-wrapper">\n\t\t<div class="filmstrip animated"></div>\n\t</div>\n</div>\n');}return __p.join('');};
}).call(this);
