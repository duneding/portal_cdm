var PageDefault = 'Home';
$(function () {
    PagesDisplayNone_ON();
    $(window).load(function () {
        //$('#ajaxLoadingLoad').css('display', 'none');
        ShowFirstPV();
    });
    $(window).resize(function () {
        var ancho = parseInt($(window).width());
        if (ancho < 768) {
            $("li[data-toggle=popover]").popover('hide');
            $("li[data-toggle=popover]").popover('disable');
            $(".popover").remove();
            $("#main_menu").removeClass("show_menu");
        } else {
            $("li[data-toggle=popover]").popover('show');
            $("li[data-toggle=popover]").popover('enable');
            $(".popover").remove();
            $("#main_menu").addClass("show_menu");
        }
    });

    $('[data-toggle="popover"]').popover({ trigger: "hover" });

    var anchoa = parseInt($(window).width());
    if (anchoa < 768) {
        $("#main_menu").removeClass("show_menu");
    } else {
        $("#main_menu").addClass("show_menu");
    }

    $(".alert").alert();

    $("#more_info").hide();
    $("#sign-minus, #sign-minus2").hide();

    /*Site help questions*/
    $(".questions li a.question1").click(function () {
        $(this).parent().find("div").toggle();
        $(".sign-plus, .sign-minus", this).toggle();
        $(".questions li a").not(this).parent().find("div").hide();
        $(".questions li a").not(this).find(".sign-plus").show();
        $(".questions li a").not(this).find(".sign-minus").hide();
    })

    /*Site help questions2*/
    $(".questions2 li a").not(".link_question").click(function () {
        $(this).parent().find("div").toggle();
        $(".sign-plus, .sign-minus", this).toggle();
        $(".questions2 li a").not(this).parent().find("div").hide();
        $(".questions2 li a").not(this).find(".sign-plus").show();
        $(".questions2 li a").not(this).find(".sign-minus").hide();
    })
   
    $(".link_question").click(function (e) {
        e.preventDefault();
        var question_open = $(this).attr("href");
        $(question_open).click();
        $('html, body').animate({
            scrollTop: $(question_open).offset().top
        }, 300);
        return false;
    })

    $("#mostrar").click(function () {
        $("#more_info").slideToggle();
        $("#sign-plus").toggle();
        $("#sign-minus").toggle();
    })

    $("#more_info2").hide();

    $("#mostrar2").click(function () {
        $("#more_info2").slideToggle();
        $("#sign-plus2").toggle();
        $("#sign-minus2").toggle();
    })

    $("#search_field_home .input-lg").keyup(function (event) {
        if (event.keyCode == 13) {
            $(this).val("");
            $("#search_home, .searchbox-icon").click();
            $("#search_field_home").addClass("hide")
            $("#home_page_bicoe").removeClass("space_search_field");
        }
    });


    /*BICoE banner*/
    $(".bicoe_menu:not('.search_page_menu') li").first().addClass("active");
    $("#bicoe_banner .inner_text").first().removeClass("hide").addClass("show");
    $(".bicoe_menu li:not('.searchinmenu')").bind("mouseenter", function(){
        $("#bicoe_banner").attr("href",$("a", this).attr("href"));
        $(".bicoe_menu li").removeClass("active");
        $("#bicoe_banner .inner_text").removeClass("show").addClass("hide");
        $("#bicoe_banner #"+$("a", this).attr("data-text-swap")).addClass("show")
        $(this).addClass("active");
        $("#bicoe_banner").css("background-image","url("+$("a", this).attr("data-image-swap")+")")
        boton_segunda_botonera = $("a", this).attr("href");
        $(".bicoe_menu.top_menu li").removeClass("active");
        $(".bicoe_menu.top_menu li a[href='"+boton_segunda_botonera+"']").parent().addClass("active");
    })
    $(".bicoe_menu.top_menu li:not('.searchinmenu') a").click(function(){
        $(".bicoe_menu.top_menu li").removeClass("active");
        $(this).parent().addClass("active");
        if(isOpen){$(".searchbox-icon").click();}
    })
    //if(!window.location.hash){$(".bicoe_menu.top_menu").hide();}
	
    var searchfield = $('.searchinmenu')
    var submitIcon = $('.searchbox-icon');
    var inputBox = $('.searchbox-input');
    var searchBox = $('.searchbox');
    var isOpen = false;
    submitIcon.click(function(){
        if(isOpen == false){
            searchBox.addClass('searchbox-open');
            searchfield.addClass('large');
            $("#quick_links_menu").fadeIn();
            inputBox.focus();
            isOpen = true;
        }else{
            searchBox.removeClass('searchbox-open');
            searchfield.removeClass('large')
            $("#quick_links_menu").fadeOut();
            inputBox.focusout();
            isOpen = false;
        }
    });
	
    $("#search_field_link").click(function(){
        $("#search_field_home").toggleClass("hide");
        $("#home_page_bicoe").toggleClass("space_search_field");
    });
    $("#search_field_home .BtnSearch").click(function(){
        $("#search_home").click();
        $("#search_field_home").addClass("hide")
        $("#home_page_bicoe").removeClass("space_search_field");
        $("#search_field_SR2").val("");
    })


    /* Menu functions */
    // Menu toggle
    var handleClick = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
    $("#menu").click(function (e) {
        e.preventDefault();
        $("#main_menu").toggleClass("toggled");
        $("#main_menu .glyphicon-chevron-right").toggleClass("hide");
        $("#main_menu .glyphicon-chevron-left").toggleClass("hide");
    });

    $("#main_menu").bind("mouseenter", function () {
        $(this).removeClass("toggled");
    }).bind("mouseleave", function () {
        $(this).addClass("toggled");
    });

    // Mobile menu toggle
    $("#menu_xs").click(function (e) {
        e.preventDefault();
        $("#main_menu").slideToggle();
    });

    // Menu toggle via keyboard
    $("#search_field, #search_field_SR").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#search_home").click();
        }
    });

    $(".searchinmenu .searchbox .searchbox-input").keyup(function (event) {
        if (event.keyCode == 13) {
            $(this).val("");
            $("#search_home, .searchbox-icon").click();
        }
    });

    /*$(window).keyup(function (event) {
        if (event.keyCode == 39) {
            $("#main_menu").removeClass("toggled");
            $("#main_menu .glyphicon-chevron-left").removeClass("hide");
            $("#main_menu .glyphicon-chevron-right").addClass("hide");
        }
        if (event.keyCode == 37) {
            $("#main_menu").addClass("toggled");
            $("#main_menu .glyphicon-chevron-left").addClass("hide");
            $("#main_menu .glyphicon-chevron-right").removeClass("hide");
        }
    });*/
    /* End menu functions */

    /* Activate tooltips for every A tag */
    $("a").tooltip();
    /* End activate */

    $('.search_results li').each(function () {
        var $elem = $(this);
        $elem.popover({
            placement: 'right',
            trigger: 'hover',
            html: true,
            container: $elem,
            animation: true,
            content: function () {
                return $('#' + $(this).attr("data-pop-up")).html();
            }
        });
    });


    $('.home_menu_secc li a').each(function () {

        var $elementos = $(this)

        $elementos.popover({
            placement: 'bottom',
            trigger: 'hover',
            html: true
        });
    })
    /* End popup functions */

    /* Popup funcions for search page */

    $(window).bind('hashchange', function () {

        newHash = window.location.hash.substring(1);
        
        if (newHash || newHash=="") {            
            HashManager.ShowHashPage({ Hash: newHash });
        };

    });

    // Add tooltips to ribbon links
    $('a').tooltip();

    $('.carousel').carousel({
        pause: "hover",
        interval: 4000
    });

});

function GetSort() {
    return 'relevance'; //Harcodeado hasta que este este filtro
}



function GetCurrentPageFromHash(hash) {
    if (hash.length == 0)
        return "";

    // Remove hash symbol
    if (hash[0] == '#')
        hash = hash.substring(1);

    // Find question mark
    var questionIndex = hash.indexOf('?')

    // Calculate page
    var page = questionIndex == -1 ? hash : hash.substring(0, questionIndex);

    return page;
}


function PagesDisplayNone_ON() {
    $(".PagesDisplayNone").css('display', 'none');
}

function ShowHashPage(hashPage) {
    var PartView = hashPage.replace('#', '');
    if (PartView == "Search" || PartView == "OData") {
        $("body").addClass("footer_search");
        $("footer").addClass("search footer_search").appendTo("#footer_search");
        $("#principal.bicoe_menu.top_menu").hide();
    } else {
        $("body").removeClass("footer_search");
        $("footer").removeClass("search footer_search").insertAfter($("#footer_search"));
        $("#principal.bicoe_menu.top_menu").show();
    }
    if (PartView == "Home") {
        $(".home-btn").hide();
        //$(".bicoe_menu.top_menu").hide();
        $(".bicoe_menu:not('.search_page_menu') li").first().addClass("active");
    } else {
        $(".home-btn").show();
        //$(".bicoe_menu.top_menu").show();
    }

    if (PartView == "Pilars") {
        $("footer .privacy_policy").hide();
    } else {
        $("footer .privacy_policy").show();
    }
    
    if (PartView == "") {
        PartView = PageDefault; //Page Default
    }
    if (PartView.toLowerCase().indexOf("search") > -1) {
        if (PartView.indexOf('?') > -1) {
            var partes = PartView.split("?");
            PartView = "Search";
            var textoSearch = partes[1].split('=')[1];
            BuscoResultados(textoSearch);
        } else {
        }
    }
    $(".PagesDisplayNone").removeClass("activo");
    $('#' + PartView).addClass("activo");
}


