$(document).ready(function() {
	$('#add-img').on('click', function() {
		$('.image-upload').append('<input type="text"><br>');
	});

	$('#generate-filmstrip').on('click', function() {
		// get number of frames
		var num_frames = $('input').length;

		var image_sources = [];
		$('input').each(function() {
			image_sources.push($(this).val());
		});

		var frames_array = num_frames - 1;
		var increment = Math.floor(100 / frames_array);

		// create keyframe animation with same number of frames
		for (var i = 0; i < num_frames; i++) {
			var frame_percentage = i * increment;
			if ((i == frames_array) && (frame_percentage !== 100)) {
				console.log('100% ' + image_sources[i]);
			} else {
				console.log(frame_percentage + '% ' + image_sources[i]);
			}
		}
	});
});