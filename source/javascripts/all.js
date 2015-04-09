//= require_tree .

(function($) {
  _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };
  // Browser-side applications do not use the API secret.
  var client = new Dropbox.Client({ key: "v0wp7w9d9w6c2e2" }),
      tmpl, imageData = [];

  var renderEmbed = function(data) {
    return tmpl(data);
  };

  $(document).ready(function() {
    tmpl = _.template($('#embed-template').html());

    var holder = document.getElementById('holder'),
        state = document.getElementById('status');
    if (typeof window.FileReader === 'undefined') {
      state.className = 'fail';
    } else {
      state.className = 'success';
      state.innerHTML = 'File API & FileReader available';
    }

    holder.ondragover = function () { this.className = 'hover'; return false; };
    holder.ondragend = function () { this.className = ''; return false; };
    holder.ondrop = function (e) {
      e.preventDefault();
      this.className = '';

      $.each(e.dataTransfer.files, function(i, file) {
        var img = new Image();
        img.id = 'upload' + i;
        $('#mosaic').append(img);
        reader = new FileReader();
        reader.onload = function (event) {
          img.src = imageData[i] = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    };
  });
})(jQuery);
