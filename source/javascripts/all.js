//= require_tree .
(function($) {
  // Browser-side applications do not use the API secret.
  var client = new Dropbox.Client({ key: "v0wp7w9d9w6c2e2" }),
      embedTmpl = JST["templates/embed"],
      codeTmpl  = JST["templates/code"],
      imageData = [];

  var renderEmbed = function(data) {
    return tmpl(data);
  };

  var doAuth = function(cb) {
    if (client.isAuthenticated()) return cb();
    client.authenticate(function(err, client) {
      if(err) throw err;
      cb();
    });
  };

  var handleUpload = function(files) {
    $.each(files, function(i, file) {
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

  var saveToDropbox = function() {
    var projectDir = 'test-filmstrip',
        uploadCount = 0,
        imageUrls = [];
    client.mkdir(projectDir, function(err, stat) {
      if(err) throw err;
      $.each(imageData, function(i, data) {
        var imagePath = projectDir + '/img' + i + '.jpg';
        client.writeFile(imagePath, data, function(err, stat) {
          if(err) throw err;
          var urlOpts = { downloadHack: true, longUrl: true };
          client.makeUrl(imagePath, urlOpts, function(err, url) {
            if(err) throw err;
            imageUrls[i] = url.url;
            if (imageUrls.length != imageData.length) return;
            var indexPath = projectDir + '/index.html',
                data = { imageUrls: imageUrls };
            client.writeFile(indexPath, renderEmbed(data), function(err, stat){
              if(err) throw err;
              client.makeUrl(indexPath, urlOpts, function(err, url) {
                if(err) throw err;
                console.log(url);
              });
            });
          });
        });
      });
    });
  };

  $(document).ready(function() {

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
      handleUpload(e.dataTransfer.files);
    };

    $('#publish').click(function(eve) {
      eve.preventDefault();
      doAuth(saveToDropbox);
    });
  });
})(jQuery);
