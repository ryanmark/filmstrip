//= require_tree .

(function($) {
  // Browser-side applications do not use the API secret.
  var client = new Dropbox.Client({ key: "v0wp7w9d9w6c2e2" }),
      tmpl = _.template($('#embedTemplate').html());

  var renderEmbed = function(data) {
    return tmpl(data);
  };
})(jQuery);
