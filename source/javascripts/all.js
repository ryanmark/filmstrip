//= require_tree .
(function($) {
  // Browser-side applications do not use the API secret.
  var client = new Dropbox.Client({ key: "v0wp7w9d9w6c2e2" }),
      embedTmpl = JST["templates/embed"],
      codeTmpl  = JST["templates/code"],
      imageData = [],
      projectName = 'Test Project';

  var doAuth = function(cb) {
    if (client.isAuthenticated()) return cb();
    client.authenticate(function(err, client) {
      if(err) throw err;
      cb();
    });
  };

  var showMosaic = function(selector, files) {

    var inst= document.getElementById('instructions');
    inst.innerHTML = "";


    $.each(files, function(i, file) {
      var img = new Image();
      img.id = 'upload' + i;
      $(selector).append(img);
      reader = new FileReader();
      reader.onload = function (event) {
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  var saveToDropbox = function(opts) {
    var projectSlug = s.slugify(projectName),
        projectDir = projectSlug,
        uploadCount = 0,
        imageUrls = [],
        progressTotal = 5 + imageData.length*2,
        progressCount = 0,
        errorCallback = function(err) { throw err; };
    if(opts.progress) opts.progress(progressCount, progressTotal);
    if(opts.error) errorCallback = opts.error;
    client.mkdir(projectDir, function(err, stat) {
      if(err) return errorCallback(err);
      progressCount++;
      if(opts.progress) opts.progress(progressCount, progressTotal);
      $.each(imageData, function(i, data) {
        var imagePath = projectDir + '/img' + i + '.jpg';
        client.writeFile(imagePath, data, function(err, stat) {
          if(err) return errorCallback(err);
          progressCount++;
          if(opts.progress) opts.progress(progressCount, progressTotal);
          var urlOpts = { downloadHack: true, longUrl: true };
          client.makeUrl(imagePath, urlOpts, function(err, url) {
            if(err) return errorCallback(err);
            progressCount++;
            if(opts.progress) opts.progress(progressCount, progressTotal);
            imageUrls[i] = url.url;
            if (imageUrls.length != imageData.length) return;
            var indexPath = projectDir + '/index.html',
                embedCodePath = projectDir + '/embed.txt',
                data = { imageUrls: imageUrls };
            client.writeFile(indexPath, embedTmpl(data), function(err, stat){
              if(err) return errorCallback(err);
              progressCount++;
              if(opts.progress) opts.progress(progressCount, progressTotal);
              client.makeUrl(indexPath, urlOpts, function(err, url) {
                if(err) return errorCallback(err);
                progressCount++;
                if(opts.progress) opts.progress(progressCount, progressTotal);
                var embedCode = codeTmpl({ name: projectSlug, url: url.url });
                client.writeFile(embedCodePath, embedCode, function(err, stat){
                  if(err) return errorCallback(err);
                  progressCount++;
                  if(opts.progress) opts.progress(progressCount, progressTotal);
                  client.makeUrl(indexPath, urlOpts, function(err, url) {
                    if(err) return errorCallback(err);
                    progressCount++;
                    if(opts.progress) opts.progress(progressCount, progressTotal);
                    if(opts.finished) opts.finished(embedCode);
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  $(document).ready(function() {

    var holder = document.getElementById('holder');



    /*
        state = document.getElementById('status');
    if (typeof window.FileReader === 'undefined') {
      state.className = 'fail';
    } else {
      state.className = 'success';
      state.innerHTML = 'File API & FileReader available';
    }
    */


    holder.ondragover = function () { this.className = 'hover'; return false; };
    holder.ondragend = function () { this.className = ''; return false; };
    holder.ondrop = function (e) {
      e.preventDefault();
      this.className = '';
      imageData = e.dataTransfer.files;
      showMosaic('#holder', e.dataTransfer.files);
    };

    $('#publish').click(function(eve) {
      eve.preventDefault();
      doAuth(function(err, client) {
        if (err) throw err;
        saveToDropbox({
          progress: function(s, t) { console.log((s/t)*100 + '%');
                   $(".meter")[0].style.width=  (s/t)*100 + '%';
                    },
          finished: function(embedCode) { console.log(embedCode); },
          error: function(err) { alert(err.response.error); }
        });
      });
    });
  });
})(jQuery);
