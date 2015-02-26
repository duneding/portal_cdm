var GaCitrix = {
    Id: "",
    Log: function (text) {
        console.log(text);
    },
    Initialize: function (id, userId, cookieDomain) {
        GaCitrix.Log("Initialize GA: " + id);
        GaCitrix.Log("Initialize User: " + userId);
        GaCitrix.Log("Initialize CookieDomain: " + cookieDomain);

        Id = id;

        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', id, { 'userId': userId, 'cookieDomain': cookieDomain });        
        ga('require', 'linkid');

        GaCitrix.SetUserId(userId);
    },

    SetUserId: function (userId) {
        GaCitrix.SetDimension(1, userId);
    },

    
    SetDimension: function (id, value) {
        GaCitrix.Log("Set Dimension: " + id + " Value: " + value);
        ga('set', 'dimension' + id, value);
    },
    /*
    SetMetric: function (id, value) {
        GaCitrix.Log("Set metric: " + value);
        ga('set', 'metric' + id, value);
    },
    */

/*    SetResultCount: function (count) {
        GaCitrix.SetMetric(1, count);
    },

    SetView: function (view) {
        GaCitrix.SetDimension(2, view);
    },    
   */ 
    ProcessScope: function (scope) {
        if (!scope || scope == "") {
            scope = "Portal";
        } else {
            scope = scope.charAt(0).toUpperCase() + scope.slice(1);
        }
        return scope;
    },

    GeneratePagePath: function (view, scope) {
        return "/" + scope + "/" + view;
    },

    GeneratePageTitle: function (view, scope) {
        return scope + " " + view;
    },

    RegisterView: function (view, scope) {
        scope = GaCitrix.ProcessScope(scope);
        var page = GaCitrix.GeneratePagePath(view, scope);
        var title = GaCitrix.GeneratePageTitle(view, scope);

        GaCitrix.Log("Register View - " + "Page: " + page + " Title: " + title);

        ga('send', 'pageview', {
            'page': page,
            'title': title,
            'dimension2': view // View name
        });
    },

    RegisterSearch: function (view, scope, searchContent) {
        scope = GaCitrix.ProcessScope(scope);
        var page = GaCitrix.GeneratePagePath(view, scope);
        var title = GaCitrix.GeneratePageTitle(view, scope);

        GaCitrix.Log("Register Search - " + "Page: " + page + " Title: " + title);

        GaCitrix.Log("Category Filters: " + searchContent.CategoryFilters);
        GaCitrix.Log("Terms: " + searchContent.Terms);
        GaCitrix.Log("Doc Type Filters: " + searchContent.DocTypeFilters);
        GaCitrix.Log("Metric Result count: " + searchContent.ResultCount);

        ga('send', 'pageview', {
            'page': page,
            'title': title,
            'dimension2': view, // View name
            'dimension3': scope, // Scope 
            'dimension4': searchContent.Terms.trim(), // Search Terms
            'dimension5': searchContent.CategoryFilters ? searchContent.CategoryFilters : 'none', // Category Filters
            'dimension6': searchContent.DocTypeFilters ? searchContent.DocTypeFilters: 'none', // Doc Type filters
            'metric1': searchContent.ResultCount // Search result count
        });
    },

    RegisterExternalLink: function(url, callback) {
        GaCitrix.Log("Register external link: " + "URL: " + url + " Callback: " + callback);
        ga('send', 'event', 'outbound', 'click', url, {'hitCallback': callback   });        
    },

    RegisterException: function() {
        ga('send', 'exception', {
                'exDescription': 'DatabaseError',
                'exFatal': false,
                'appName': 'myApp',
                'appVersion': '1.0'});
    }
}
 
