//switches
document.querySelector('#btn-settings').addEventListener('click', function () {
  document.querySelector('#settings').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});
document.querySelector('#btn-settings-back').addEventListener('click', function () {
  document.querySelector('#settings').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

var appCache = window.applicationCache;
if (appCache) {
  appCache.onerror = function () {
    alert('This app require a working internet connection!');
  };
}

var xhr = new XMLHttpRequest({mozSystem: true});
xhr.open("GET", "sites.json", true);
xhr.onreadystatechange = function () {
  if (xhr.status === 200 && xhr.readyState === 4) {
    var sites = JSON.parse(xhr.responseText);
    var list = sub_list = list_settings = switch_settings = '';
    for (var group in sites) {
      var sub_list = '';
      var title = '<h2>' + group + '</h2>';
      for (var site in sites[group]) {
        switch_settings += '<label class="pack-switch"><input type="checkbox"><span>' + site + '</span></label>';
        sub_list += '<li><a class="rss-open" href="#" data-url="' + sites[group][site] + '">' + site + '</a></li>';
      }
      list_settings += title + switch_settings;
      list += title + '<ul>' + sub_list + '</ul>';
    }
    jQuery('.settings-list').html(list_settings);
    jQuery('.sites-list').html(list);
    jQuery('.rss-open').click(function () {
      jQuery("#rss-feeds").empty();
      jQuery("#rss-feeds").rss(jQuery(this).data('url'), {
        limit: 10,
        effect: 'slideFastSynced',
        entryTemplate: '<li><a href="#" data-news="{url}">{author} - {date}<br>{title}</a></li>'
      });
    });
    jQuery('#rss-feeds').on('click', 'a', function () {
      if (locationbar.visible) {
        var win = window.open(jQuery(this).data('news'), '_blank');
        win.focus();
      } else {
        new MozActivity({
          name: "view",
          data: {
            type: "url", // Possibly text/html in future versions
            url: jQuery(this).data('news')
          }
        });
      }
    });
  }
};

xhr.onerror = function () {
  alert("Problems on loading sites list");
};

xhr.send();

