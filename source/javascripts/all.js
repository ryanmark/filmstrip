//= require_tree .
(function($) {
  // make sure auth
  if (window.location.hostname != 'localhost' &&
      window.location.hostname != '127.0.0.1' &&
      window.location.hostname != '0.0.0.0' &&
      window.location.protocol == "http:") {
    window.location = "https:" + window.location.href.substr(5);
  }

  // Browser-side applications do not use the API secret.
  var client = new Dropbox.Client({ key: "v0wp7w9d9w6c2e2" }),
      embedTmpl   = JST["templates/embed"],
      codeTmpl    = JST["templates/code"],
      welcomeTmpl = JST["templates/welcome"],
      imageData   = [],
      projectName = 'Test Project';

  var loadAuth = function() {
    if (localStorage) {
      var auth = JSON.parse(localStorage.getItem('dropboxAuth'));
      if (auth) client.setCredentials(auth);
    }
  };

  var saveAuth = function() {
    if (localStorage) {
      var auth = client.credentials();
      localStorage.setItem('dropboxAuth', JSON.stringify(auth));
    }
  };

  var doAuth = function(cb) {
    if (client.isAuthenticated()) return cb();
    client.authenticate(function(err, client) {
      if(err) throw err;
      saveAuth();
      cb();
    });
  };

  var showMosaic = function(selector, files) {
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

  var setWelcome = function() {
    client.getAccountInfo(function(err, acct, stat) {
      if(err) throw err;
      $('#auth-dropbox')
        .css('visibility', 'visible')
        .html(welcomeTmpl(acct));
    });
  };

  var saveToDropbox = function(opts) {
    var projectSlug = s.slugify(projectName),
        projectDir = projectSlug,
        uploadCount = 0,
        imageUrls = [],
        progressTotal = 5 + imageData.length*2,
        progressCount = 0,
        imageCount = 0,
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
            if (++imageCount < imageData.length) return;
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

  loadAuth();

  $(document).ready(function() {

    var holder = document.getElementById('holder');
    holder.ondragover = function () { this.className = 'hover'; return false; };
    holder.ondragend = function () { this.className = ''; return false; };
    holder.ondrop = function (e) {
      e.preventDefault();
      this.className = '';
      imageData = e.dataTransfer.files;
      showMosaic('#mosaic', e.dataTransfer.files);
    };

    if(client.isAuthenticated()) {
      setWelcome();
    } else {
      $('#auth-dropbox').css('visibility', 'visible');
      $('#auth')
        .click(function(eve) {
          eve.preventDefault();
          doAuth(function(err, client) {
            if (err) throw err;
            setWelcome();
          });
        });
      $('#publish').attr('disabled', true);
    }

    $('#publish').click(function(eve) {
      eve.preventDefault();
      $(this)
        .attr('disabled', true)
        .text('Doing stuff...');
      doAuth(function(err, client) {
        if (err) throw err;
        saveToDropbox({
          progress: function(s, t) {
            $(".meter").width((s/t)*100 + '%');
          },
          finished: function(embedCode) {
            var embedRes = document.createElement('textarea');
            embedRes.textContent = embedCode;
            var a = $(".result")[0];
            a.innerHTML = "";
            $(a).append(embedRes);
          },
          error: function(err) { alert(err.response.error); }
        });
      });
    });

    $('#name').keypress(function(eve) {
      projectName = $(this).val();
    });
  });
})(jQuery);
