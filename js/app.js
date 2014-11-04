var settings = [];

function loadsettings() {
  localforage.iterate(function (value, key) {
    settings[key] = value;
  }, function () {
    xhr.send();
  });
}

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
      var sub_list = switch_settings = '';
      var title_drawer = '<h2>' + group + '</h2>';
      var title_settings = '<header>' + group + '</header>';
      for (var site in sites[group]) {
        var check = none = '';
        if (settings[site] === undefined || settings[site] === 'on') {
          check = ' checked';
        } else {
          none = 'style="display:none;"';
        }
        sub_list += '<li><a class="rss-open" href="#" data-site="' + site + '" data-url="' + sites[group][site] + '"' + none + '>' + site + '</a></li>';
        switch_settings += '<label class="pack-switch"><input class="site" type="checkbox" data-site="' + site + '" ' + check + '><span>' + site + '</span></label>';
      }
      list_settings += title_settings + switch_settings;
      list += title_drawer + '<ul>' + sub_list + '</ul>';
    }
    jQuery('.settings-list').html(list_settings);
    jQuery('.sites-list').html(list);
    jQuery('.rss-open').click(function () {
      jQuery("#rss-feeds").empty();
      jQuery("#rss-feeds").rss(jQuery(this).data('url'), {
        limit: 10,
        effect: 'slideFastSynced',
        entryTemplate: '<li><a href="#" data-news="{url}"><small>{author} - {date}</small><br>{title}</a></li>'
      });
      jQuery("#drawer h1").html('Mozilla Aggregator - ' + jQuery(this).html());
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
    jQuery('.site').click(function () {
      localforage.setItem(jQuery(this).data('site'), this.checked ? this.value : '');
      settings[jQuery(this).data('site')] = this.checked ? this.value : '';
      jQuery('.rss-open[data-site="' + jQuery(this).data('site') + '"]').toggle();
    });
  }
};

xhr.onerror = function () {
  alert("Problems on loading sites list");
};

loadsettings();