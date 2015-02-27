

var ucSearch = {
    NameContainer: 'Search',
    BookmarksMode: false,
    scope: '',
    /*
        SortBy: este metodo retorna el valor de ordenamiento del result del metodo Search
    */
    SortBy: function(){
        return 'relevance'; //Harcodeado hasta que este este filtro
    },
    /*
        _OldTerms y _NewTerms: son propiedades privadas del objeto que se utilizan internamente
        para guardar los valores de busqueda y detectar si se trata de un refrezco voluntario
        y de dicha manera poder pedirle al Controller que traiga nuevamente las cantidades 
        de resultados para cada filtro para dicha busqueda, esas propiedades estan encapsuladas
        en el metodo Aggregate()
    */
    _OldTerms: '',
    _NewTerms: '',
    /*
        Aggregate: este metodo retorna un boolean con el valor true si el term en cuestion
        es nuevo y false cc.
    */
    Aggregate: function(){
        return (!this.BookmarksMode && this._OldTerms != this._NewTerms);
    },
    SearchBoxShow: true,
    ForceIndexes: '',
    ForceCategories: '',
    ForceDocumentTypes:'',
   
    /*
        UpdateHashSearch: este metodo recibe un objeto con los parametros del
        nuevo hash y sobrescribe la url, esto dispara el evento HashChange
        el cual va a invocar el Load de este mismo objeto.
    */
    UpdateHashSearch: function (param) {
        var config = {
            TextSearch: '',
            sort: '',
            page: 1,
            filters: '',
            docTypes: '',
            filterAggergation: '' //(Por el momento no aplica este comentario) '' no fue seleccionado ningun filtro, T selecciono el filtro type, DT selecciono el filtro DocType
        }
        $.extend(config, param);
        // Get the corresponding search field value
        var currentPage = GetCurrentPageFromHash(window.location.hash);

        //Encode unicode characters
        var paramTerms = encodeURIComponent(config.TextSearch);         

        var ParamHash = '?terms=' + paramTerms;

        if (param) {
            ParamHash += '&sort=' + config.sort + '&page=' + config.page + '&filters=' + config.filters + '&docTypes=' + config.docTypes;// + '&fAggr=' + config.filterAggergation;
        }
        window.location.hash = '#Search' + ParamHash;

        // Hide autocomplete
        $('.SearchText').typeahead('close');

        $('#searchMenu').attr('href', window.location.hash);
    },
    /*
        Load: este metodo es invocado automaticamente por el objeto HashManage, 
        este le pasa por parametro un string con los parametros del hash de la URL
        aqui es donde se realiza el split correspondiente, muestra el div cullo nombre 
        esta seteado en la propiedad NameConteiner, e invoca al metodo Search con los parametros
        anteriormente obtenidos.
    */
    Load: function (parameters) {
        $("#panel_similar_searches").toggle(!ucSearch.BookmarksMode);
        $("#panel_people_also").toggle(!ucSearch.BookmarksMode);
        $("#panel_refine_search").toggle(!ucSearch.BookmarksMode);
        $("#panel_bookmarks").toggle(ucSearch.BookmarksMode);

        var Params = parameters.split('&');
        var textSearch = "";

        if (Params[0] != "")
            textSearch = Params[0].split('=')[1];

        var SearchParams = {
            TextSearch: textSearch,
            sort: this.SortBy(),
            page: 1,
            filters: '',
            docTypes: '',
            filAgg: ''
        }

        //Decode unicode characters
        if (textSearch!="")
            SearchParams.TextSearch = decodeURIComponent(SearchParams.TextSearch);

        if (Params.length > 1) {
            SearchParams.sort = Params[1].split('=')[1];
            SearchParams.page = Params[2].split('=')[1];
            SearchParams.filters = Params[3].split('=')[1];
            SearchParams.docTypes = Params[4].split('=')[1];
            //SearchParams.filAgg = Params[5].split('=')[1];
        }

        if (this.ShowImgsOpenForBeta) {
            $('#BetaText').css('display', 'block');
            $('#BetaBanner').css('display', 'block');
        }
        
        $('html').scrollTop(0);
        this.Search(SearchParams);
        $('#' + this.NameContainer).css('display', 'block');
        if (!this.SearchBoxShow) {
            $("#SearchBox").css('display', 'none');
            $('#NotHiddenSearchBox').remove();
        }
    },
    /*
        Search: en este metodo se hace un pedido POST por ajax el cual retorna el listado
        obtenido de elasticSearch y muestra los resultados de la pagina en cuestion, redibuja
        los filtros y el pager.
    */
    Search: function (Params) {
        var config = {
            TextSearch:'',
            sort: '',
            page: '',
            filters: '',
            docTypes: '',
            filAgg:''
        }
        $.extend(config, Params);
        this._NewTerms = config.TextSearch;
        var newData = {
            searchTerms: config.TextSearch,
            PageNumber: config.page,
            sortBy: config.sort,
            Types: config.filters,
            scope: this.scope,
            Aggregate: this.Aggregate(),
            docTypes: config.docTypes,
            filAgg: config.filAgg,
            fIdx: ucSearch.ForceIndexes,
            fTyp: ucSearch.ForceCategories,
            fDocTyp: ucSearch.ForceDocumentTypes,
            bookmarksMode:ucSearch.BookmarksMode
        };
        this._CompletInputSearchBox(config.TextSearch);
        $("#ResultContent").fadeOut(500, function () {
            // Cancel previous ajax call if still running
            var request = ucSearch.currentAjaxRequest;
            if (request && request.readyState !== 4) {
                // console.log('Abort!')
                request.abort();
            }

            ucSearch.currentAjaxRequest = $.ajax({
                url: '/Search/Search',
                data: newData,
                type: 'POST',
                dataType: 'json', 
                beforeSend: function () {
                    $('#ajaxLoadingSearchResults').fadeIn(500);
                },
                success: function (result) {
                    $('#ajaxLoadingSearchResults').fadeOut(500, function () {
                        // Update Google Analytics data
                        var searchContent = {
                            DocTypeFilters: config.docTypes,
                            CategoryFilters: config.filters,
                            Terms: config.TextSearch,
                            ResultCount: result.TotalResults
                        };

                        GaCitrix.RegisterSearch("Search", ucSearch.scope, searchContent);
                                                
                        // Draw and show results                        
                        ucSearch._drawResults(result, config.sort, config.filters, config.TextSearch, config.docTypes);
                        $("#ResultContent").fadeIn(500);
                        $("a").tooltip();
                        $('.bt_star').click(function () {
                            var item = $(this);
                            var parent = item.parent();//h4
                            var grandpa = parent.parent();//div 
                            var children_nv = grandpa.parent().children(".nv");
                            var children_vv = grandpa.parent().children(".vv");

                            var index = item.data("index");
                            var type = item.data("typees");
                            var id = item.data("id");

                            if (grandpa.hasClass("nv")){
                                                               
                                ucSearch.AddBookmark({
                                    index: index,
                                    type: type,
                                    id: id,
                                    grandpa: grandpa,
                                    children: children_vv,
                                    callback: function () {
                                        }
                                });

                            }
                            else if (grandpa.hasClass("vv")) {
                                ucSearch.RemoveBookmark({
                                    index: index,
                                    type: type,
                                    id: id,
                                    grandpa: grandpa,
                                    children: children_nv,
                                    callback: function () {
                                    }
                                });
                            }
                            
                        });
                    });
                },
                error: function (xhr, status, error) {
                    if (status != "abort") {
                        $('#ajaxLoadingSearchResults').fadeOut(500);
                        alert('Could not retrieve search results, please contact your administrator.');
                    }
                }
            });
        });


        
    },
    //Remove bookmark from document
    RemoveBookmark: function (obj) {
        var newData = {
            index: "",
            type: "",
            id: "",
            grandpa: "",
            children: "",
            callback: function () { }
        }
        $.extend(newData, obj);

        $.ajax({
            url: '/Search/RemoveBookmark',
            data: { index: newData.index, type: newData.type, id: newData.id },
            type: 'POST',
            dataType: 'json',
            success: function (result) {
                //newData.callback();
                newData.grandpa.SetClassBookmark();
                newData.children.removeClass("oculto").addClass("visible");
            },
            error: function (xhr, status, error) {
                //TODO                
            }
        });
    },
    //Add bookmark from document
    AddBookmark: function (obj) {
        var newData = {
            index: "",
            type: "",
            id: "",
            grandpa: "",
            children: "",
            callback: function () { }
        }
        $.extend(newData, obj);
        
        $.ajax({
            url: '/Search/AddBookmark',
            data: {index:newData.index, type:newData.type, id:newData.id},
            type: 'POST',
            dataType: 'json',            
            success: function (result) {
                //newData.callback();
                newData.grandpa.SetClassBookmark();
                newData.children.removeClass("oculto").addClass("visible");

            },
            error: function (xhr, status, error) {
                //TODO                
            }
        });
    },
    /*
    UpdateViewCount: this method execute a POST by ajax for updating value of view portal count 
    on ElasticSearch.
    */
    UpdateViewCount: function (index, type, id) {

        var newData = {
            index: index,
            type: type,
            id: id
        };

        $.ajax({
                url: '/Search/UpdateViewCount',
                data: newData,
                type: 'POST',
                dataType: 'json',                
                success: function (result) {
                    //TODO
                },
                error: function (xhr, status, error) {
                    //TODO                
                }
            });

    },
    /*
        _CompletInputSearchBox: Metodo privado que coloca el texto de busqueda en todos los
        inputs de busquedas de la singlePage.
    */
    _CompletInputSearchBox: function(text){

        $('.BtnSearch').each(function () {
            $('#' + $(this).data('idinputasociate')).val(text);
        });
    },
    _drawResults: function (result, sortBy, Types, TextSearch, docTypes) {
        $("#ResultContent").html('');
        if (result.Items.length == 0) {
            $("#ResultContent").html('No results found. Please try again with different search terms or change your filter criteria');

        }
        else {
            if (sortBy == "type") {
                // Sort by type template
                $("#ResultContent").html($("#tmpl_searchResultsByType").render(result, { showType: false, encodeURI: encodeURI, shortenUrl: shortenUrl, prettifyText: prettifyText }));
            } else {
                // Sort by relevance template
                $("#ResultContent").html($("#tmpl_searchResultsByRelevance").render(result, { showType: true, encodeURI: encodeURI, shortenUrl: shortenUrl, prettifyText: prettifyText }));
            }
            $('.external_link').click(function () {
                // External
                var url = $(this).attr('href');
                GaCitrix.RegisterExternalLink(url, null);

            });



        }
        $('#CantResults').html(result.TotalResults + ' results');

        if (ucSearch.Aggregate()) {
            this._OldTerms = this._NewTerms;
            var Cantidades = result.CantTypes;

            //Only draw filters sections when there are results
            ucSearch._ShowHideFilters(result);
        }
        //switch (result.filAgg) {
        //    case "T":
        //        ucSearch._DrawFiltersDocTypesLeft(result.FiltersDocType);
        //        ucSearch._ShowHideFilters(result);
        //        break;
        //    case "DT":
        //        ucSearch._DrawFiltersLeft(result.Filters);
        //        ucSearch._ShowHideFilters(result);
        //        break
        //}

        ucSearch._DrawFiltersActive(result.TypesActive);
        ucSearch._DrawAlsoSearched(result.AlsoSearched);
        ucSearch._DrawSimilarSearched(result.SimilarsSeareched);
        
        var ObjPager = {
            Types: Types,
            docTypes: docTypes
        }
        $.extend(ObjPager, result);
        drawPager(ObjPager, TextSearch);
        this._DrawTotalResults({
            fromPage: result.fromPage,
            toPage: result.toPage,
            TotalResults: result.TotalResults,
            terms: TextSearch
        });
    },
    _ShowHideFilters: function (result) {
        if (result.TotalResults > 0) {
            //Category
            document.getElementById("byCategory").style.display = "";
            document.getElementById("FilterLeftCategory").style.display = "";
            
            
                var categoryFilter = result.Filters.filter(function (i) {
                    return i.Cant != 0
                });
                if (categoryFilter.length > 0) {
                    ucSearch._DrawFiltersLeft(categoryFilter);
                }
            //Document types

            document.getElementById("byDocumentType").style.display = "";
            document.getElementById("DocumentTypeFilterLeft").style.display = "";
            
                var docTypesFilter = result.FiltersDocType.filter(function (i) {
                    return i.Cant != 0
                });
                if (docTypesFilter.length > 0) {
                    ucSearch._DrawFiltersDocTypesLeft(docTypesFilter);
                }
        } else {
            //Category
            document.getElementById("byCategory").style.display = "none";
            document.getElementById("FilterLeftCategory").style.display = "none";
            //Document types
            document.getElementById("byDocumentType").style.display = "none";
            document.getElementById("DocumentTypeFilterLeft").style.display = "none";
        }
    },
    _DrawFiltersLeft: function (Filters) {
        $('#FilterLeftCategory').html($('#tmpl_AddLeftFilter').render({ Items: Filters }));
       
        $('.TypeFilters .BtnFiltros').click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
            else {
                $(this).addClass('active');
            }
            filtrarResults(ucSearch._NewTerms,'T');
        });
    },
    _DrawFiltersDocTypesLeft: function (Filters) {
        $('#DocumentTypeFilterLeft').html($('#tmpl_AddLeftFilter').render({ Items: Filters }));
                
        $('.DocTypeFilters .BtnFiltros').click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
            else {
                $(this).addClass('active');
            }
            filtrarResults(ucSearch._NewTerms,'DT');
        });
    },
    _DrawFiltersActive: function (TypeActive) {
        var unTypeActive = {
            Value: '',
            Active: false
        }
        $.each(TypeActive, function (i, element) {
            $.extend(unTypeActive, element);
            $('.' + unTypeActive.Value).addClass((unTypeActive.Active)?'active':'');
        });
    },
    _DrawAlsoSearched: function (Items) {
        Items = encodeTerm(Items);
        $("#ContontAlsoSearched").html($("#tmpl_AlsoSearched").render({ Items: Items }));
    },    
    _DrawSimilarSearched: function (Items) {
        Items = encodeTerm(Items);
        $("#ContontSimilarSearched").html($("#tmpl_AlsoSearched").render({ Items: Items }));
    },
    /*
        reemplasa la imagen con la imagen cuya ruta se pasa en el parametro url
    */
    ChangeImgLogo: function (url) {
        $('#LinkImgLogoSearch img').attr('src', url);
    },
    /*
        En caso de que se decee dirigir a otra pagina distinta de #Home utilizar esta propiedad
    */
    SetHrefLogo: function(url){
        $('#LinkImgLogoSearch').attr('href', url);
    },
    _DrawTotalResults: function (obj) {
        var config = {
            fromPage: 0,
            toPage: 0,
            TotalResults: 0,
            terms: ''
        }
        $.extend(config, obj);

        if (config.TotalResults == 0)
            $('#TotalResultsSearched').html($("#tmpl_NoResults").render(config));
        else
            $('#TotalResultsSearched').html($("#tmpl_TotalResults").render(config));
        
        $('#TotalResultsLeft').html($("#tmpl_TotalResultsLeft").render(config));
        
    },
    ShowImgsOpenForBeta: false
}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucSearch,
        Key: ucSearch.NameContainer
    });
    // Search with Return Key
    // Trigger menu click

    $('.SearchText').keyup(function (event) {
        if (event.keyCode == 13) {
            ucSearch.UpdateHashSearch({ TextSearch: $(this).val() });
        }
    });

    $('.SearchText').each(function () {
        $(this).AutoComplete();
    });

    

    // Search button to bring search results
    $('.BtnSearch').click(function (e) {
        ucSearch.UpdateHashSearch({ TextSearch: $('#' + $(this).data('idinputasociate')).val() });
    });
});





function shortenUrl(url) {
    if (url.length > 20) {
        return url.substring(0, 20) + '...';
    }
    else {
        return url;
    }
}

function prettifyText(text) {
    text = text.replace("\r\n", "<br/>");
    return text;
}

function filtrarResults(TextSearch, filterAggergation) {
    var filtrados = $('.TypeFilters .active');
    var txtFiltersHash = '';
    filtrados.each(function () {
        if (txtFiltersHash == '') {
            txtFiltersHash += $(this).data('keyfilter');
        }
        else {
            txtFiltersHash += ',' + $(this).data('keyfilter');
        }
    });

    var docTypesFiltrados = $('.DocTypeFilters .active');
    var txtDocTypeFiltersHash = '';
    docTypesFiltrados.each(function () {
        if (txtDocTypeFiltersHash == '') {
            txtDocTypeFiltersHash += $(this).data('keyfilter');
        }
        else {
            txtDocTypeFiltersHash += ',' + $(this).data('keyfilter');
        }
    });

    ucSearch.UpdateHashSearch({
        TextSearch: TextSearch,
        sort: GetSort(),
        page: 1,
        filters: txtFiltersHash,
        docTypes: txtDocTypeFiltersHash,
        filterAggergation: filterAggergation
    });
}

function drawPager(result, TextSearch) {

    $('.PaginationSearch').html($("#tmpl_Pager").render({ Items: GetArrPager(result.PageNumber, result.TotalPages), TotalPages: result.TotalPages }));
    $('.SelectPage').click(function () {
        ucSearch.UpdateHashSearch({
            TextSearch: TextSearch,
            sort: result.sortBy,
            page: $(this).attr('PageNum'),
            filters: result.Types,
            docTypes: result.docTypes
        });
    });
    $('.clickNextPrev').click(function () {
        var PageAct = parseInt($(this).attr('PageAct'));
        if($(this).hasClass('first')){
            result.PageNumber = 1;
        }
        else if ($(this).hasClass('last')) {
            result.PageNumber = result.TotalPages;
        }
        else {
            result.PageNumber = ($(this).hasClass('ant') ? (PageAct - 1) : (PageAct + 1));
        }
        ucSearch.UpdateHashSearch({
            TextSearch: TextSearch,
            sort: result.sortBy,
            page: result.PageNumber,
            filters: result.Types,
            docTypes: result.docTypes
        });
    });

}

function encodeTerm(items) {
    var encodedItems = [];
    var term = "";
    for (var i in items) {
        items[i].encodedTerm = encodeURIComponent(items[i].term);
        encodedItems.push(items[i]);
    }

    return encodedItems;
}

function GetArrPager(numPagActual, TotalPaginas) {
    var pages = [];

    var Extremos = 2;

    var ExtremoIz = numPagActual - Extremos;
    var ExtremoDer = numPagActual + Extremos;

    ExtremoIz = ((ExtremoIz <= 0) ? 1 : ExtremoIz);
    ExtremoDer = ((ExtremoDer > TotalPaginas) ? TotalPaginas : ExtremoDer);
    if (numPagActual > 1) {
        pages.push({ clases: 'first clickNextPrev', PageNum: 'First', PageAct: numPagActual, TotalPage: TotalPaginas });
        pages.push({ clases: 'ant clickNextPrev', PageNum: '<', PageAct: numPagActual, TotalPage: TotalPaginas });
    }
    for (var i = ExtremoIz; i <= ExtremoDer ; i++) {
        var clases = 'SelectPage ';
        if (i == numPagActual) {
            clases = 'active';
        }

        pages.push({ clases: clases, PageNum: i, PageAct: numPagActual, TotalPage: TotalPaginas });
    }
    if (ExtremoDer < TotalPaginas) {
        pages.push({ clases: 'Sig clickNextPrev', PageNum: '>', PageAct: numPagActual, TotalPage: TotalPaginas });
        pages.push({ clases: 'last clickNextPrev', PageNum: 'Last', PageAct: numPagActual, TotalPage: TotalPaginas });

    }
    return pages;
}
    
(function ($) {
        
    $.fn.AutoComplete = function () {
        /* Typeahead function */
        var inputSearch = $(this);
       

        inputSearch.typeahead(null, {
            name: 'Suggest',
            displayKey: 'value',
            hint: true,
            highlight: true,
            source: function (query, process) {
                $.get('/Search/GetSearchSuggest?text=' + encodeURIComponent(inputSearch.val()), { query: query }, function (data) {
                    objects = [];
                    $.each(data, function (i, object) {
                        objects.push({ value: object });
                    });
                    return process(objects);
                });
            },
            updater:function (item) {
                //item = selected item
                //do your stuff.
                alert(item);
                //dont forget to return the item to reflect them into input
                return item;
            }
        });

       
        inputSearch.on('typeahead:selected', function (e, datum) {
            ucSearch.UpdateHashSearch({ TextSearch: datum.value });
        });
    }
    
    $.fn.SetClassBookmark = function () {
        if ($(this).hasClass("visible")) {
            $(this).removeClass("visible").addClass("oculto");
        }
        else {
            $(this).removeClass("oculto").addClass("visible");
        }
    }

})(jQuery);