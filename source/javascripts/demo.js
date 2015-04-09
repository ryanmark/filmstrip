$(document).ready(function() {
	console.log('test');

	// gif.render();
	function setup_css_animations() {
	    var prefixes = [ '-webkit-', '-moz-', '-o-', '' ];
	    var keyframes = '';
	    var filmstrip_steps = 25;
	    for (var i = 0; i < prefixes.length; i++) {
	        var filmstrip = '';
	        for (var f = 0; f < filmstrip_steps; f++) {
	            var current_pct = f * (100/filmstrip_steps);
	            filmstrip += current_pct + '% {background-position:0 -' + (f * 100) + '%;' + prefixes[i] + 'animation-timing-function:steps(1);}';
	        }
	        keyframes += '@' + prefixes[i] + 'keyframes filmstrip {' + filmstrip + '}';
	    }
	    
	    var s = document.createElement('style');
	    s.innerHTML = keyframes;
	    $('head').append(s);
	}

	// var image = new Image();
	// image.src = '../images/demo/IMG_5130.JPG';
	// $('.filmstrip').css('background-image', image.src);
});