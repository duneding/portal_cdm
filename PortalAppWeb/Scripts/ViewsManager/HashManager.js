

var HashManager = {
    userOnline: '',
    DefaultPage: 'Home',
    _Registers: [],
    RegisterPartialView: function (UC) {
        var addUC = {
            obj: {
                Load: function () { alert("The object doesn't contain the method Load."); }
            },
            Key: ''
        }
        $.extend(addUC, UC);
        this._Registers.push(addUC);
        
    },
    ShowHashPage: function (Params) {
        var config = {
            Hash: ''
        }
        $.extend(config, Params);

        $(".PagesDisplayNone").css('display', 'none');
        var PartsUrl = config.Hash.split('?');
        var PartialView = {
            Name: this.DefaultPage,//es el nombre del objeto que posee los metodos Load, Reload, Unload
            Parameters: ''
        }
        if (PartsUrl.length > 0 && PartsUrl[0].length > 0) {
            PartialView.Name = PartsUrl[0];

            // Use search control for bookmarks with a different mode
            if(PartialView.Name == "Search")
                ucSearch.BookmarksMode = false;
            else if (PartialView.Name == "Bookmarks") {
                PartialView.Name = "Search";
                ucSearch.BookmarksMode = true;
            }
        }
        if (PartsUrl.length > 1) {
            PartialView.Parameters = PartsUrl[1];
        }

        var pathname = $(document).context.location.pathname;        
        //if (PartialView.Name == "Search") {

        //    switch (pathname.toLowerCase()) {
        //        case "/citropedia":
        //            document.getElementById('citro_logo').style.display = '';
        //            document.getElementById('main_logo').style.display = 'none';
        //            document.getElementById('beta_banner').style.display = 'none';
        //            document.getElementById('bicoe_logo').style.display = 'none';
        //            break;
        //        case "/bicoe":
        //            document.getElementById('citro_logo').style.display = 'none';
        //            document.getElementById('main_logo').style.display = 'none';
        //            document.getElementById('beta_banner').style.display = 'none';
        //            document.getElementById('bicoe_logo').style.display = '';
        //            $('#refactorPlease').remove();
        //            break;
        //        default:
        //            document.getElementById('citro_logo').style.display = 'none';
        //            document.getElementById('main_logo').style.display = '';
        //            document.getElementById('beta_banner').style.display = '';
        //            document.getElementById('bicoe_logo').style.display = 'none';
        //    }

        //}



        // Make ribbon blue in internal pages
        if (PartsUrl[0] == "Search" || PartsUrl[0] == "OData" || this.DefaultPage == "OData") {
            $("body").addClass("footer_search");
            $("footer").addClass("search footer_search").appendTo("#footer_search");
        } else {
            $("body").removeClass("footer_search");
            $("footer").removeClass("search footer_search").insertAfter($("#footer_search"));
        }
        if (PartsUrl[0] == "Home") {
            $(".home-btn").hide();
            $(".bicoe_menu.top_menu").hide();
            $(".SearchText").val("");
        } else {
            $(".home-btn").show();
            $(".bicoe_menu.top_menu").show();
        }

        if (PartsUrl[0] == "Pilars") {
            $("footer .privacy_policy").hide();
        } else {
            $("footer .privacy_policy").show();
        }

        var found = false;
        


        for (var i = 0; i < this._Registers.length; i++) {
            var oneUC = {
                obj: {
                    Load: function () { alert("The object " + this.Name + " doesn't contain the method Load."); }
                },
                Key: ''
            }
            $.extend(oneUC, this._Registers[i]);
            if (oneUC.Key == PartialView.Name) {
                oneUC.obj.Load(PartialView.Parameters);
                if(PartialView.Name != "Search" && PartialView.Name != "Bookmarks") {
                    GaCitrix.RegisterView(PartialView.Name, ucSearch.scope);
                }
                found = true;
                break;
            }

        }
        if (!found) {
           alert('The object "' + PartialView.Name + '" is not registered.');
        }

    }

}