

var ucDataSources = {
    NameContainer: 'DataSources',
    /*
        _OldTerms y _NewTerms: son propiedades privadas del objeto que se utilizan internamente
        para guardar los valores de busqueda y detectar si se trata de un refrezco voluntario
        y de dicha manera poder pedirle al Controller que traiga nuevamente las cantidades 
        de resultados para cada filtro para dicha busqueda, esas propiedades estan encapsuladas
        en el metodo Aggregate()
    */
    _OldTerms: '',
    _NewTerms: '',
    _CantsFilterLeft: [],
    _ChangeFilterText: function () {
        return ((this._OldTerms != this._NewTerms));
    },
    /*
        UpdateHashSearch: este metodo resive un objeto con los parametros del
        nuevo hash y sobrescrive la url, esto dispara el evento HashChange
        el cual va a invocar el Load de este mismo objeto.
    */
    UpdateHashSearch: function (param) {
        var config = {
            TextSearch: '',
            page: 1,
            types: ''
        }
        $.extend(config, param);

        var ParamHash = '?terms=' + config.TextSearch;

        if (param) {
            ParamHash += '&page=' + config.page + '&types=' + config.types;
        }
        window.location.hash = '#' + this.NameContainer + ParamHash;
    },
    Load: function (Parameters) {

        $('#' + this.NameContainer).css('display', 'block');

        var config = {
            filter: '',
            page: 1,
            types: ''
        }

        var Params = Parameters.split('&');
        var SearchParams = {
            filter: '',
            page: 1,
            types: ''
        }

        if (Params.length > 1) {
            SearchParams.filter = Params[0].split('=')[1];
            SearchParams.page = Params[1].split('=')[1];
            SearchParams.types = Params[2].split('=')[1];
        }
        this._DrawFiltersLeft();
        this.Search(SearchParams);

    },
    Search: function (Parameters) {

        var config = {
            filter: '',
            page: 1,
            types: ''
        }

        $.extend(config, Parameters);
        this._NewTerms = config.filter;
        this._CompletInputSearchBox(config.filter);
        $.ajax({
            url: '/Admin/Reload',
            data: {
                filter: config.filter,
                page: config.page,
                types: config.types
            },
            type: 'POST',
            dataType: 'json',
            beforeSend: function () {
                $('#ajaxLoadingDataSourcesResults').fadeIn(500);
            },
            complete: function () {
                $('#ajaxLoadingDataSourcesResults').fadeOut(100);
            },
            success: function (result) {
                var Data = {
                    CantTotal: 0,
                    Items: [],
                    CantPages: 0,
                    page: 1,
                    CantTypes: [],
                    types: config.types
                }
                $.extend(Data, result);

                if (Data.Items.length == 0) {
                    $("#ResultListDataSources").html('No results found. Please try again with different search terms.');
                }
                else {
                    $("#ResultListDataSources").html($('#DataSourcesList').render({ Items: Data.Items }));
                }


                ucDataSources._drawPager(Data, config.filter);
                ucDataSources._drawFilters(config.types, config.filter);
                $('.EditDataSources').each(function () {

                    $(this).click(function () {
                        var idDataSource = $(this).data('iddatasource');
                        $.ajax({
                            url: '/Admin/GetDataSource?idDataSource=' + idDataSource,
                            type: 'Get',
                            dataType: 'json',
                            beforeSend: function () {

                            },
                            complete: function () {

                            },
                            success: function (result) {
                                var DS = {
                                    id: '',
                                    Name: '',
                                    Type: '',
                                    Description: '',
                                    ScheduleCant: '',
                                    ScheduleUnit: '',
                                    Adress: '',
                                    user: '',
                                    password: ''
                                }
                                $.extend(DS, result);
                                $('#myModalLabel').html('Edit Data Source');
                                $('#IdDataSource').val(DS.id);
                                $('#Name').val(DS.Name);
                                $('#Adress').val(DS.Adress);
                                $('#UserName').val(DS.user);
                                $('#Password').val(DS.password);
                                $('#Schedule').val(DS.ScheduleCant);
                                $('#DescriptionDS').val(DS.Description);
                            },
                            error: function (xhr, status, error) {

                            }
                        });
                    });
                });
                $('.RemoveDataSource').each(function () {
                    $(this).click(function () {
                        var idDataSource = $(this).data('iddatasource');
                        $.ajax({
                            url: '/Admin/GetDataSource?idDataSource=' + idDataSource,
                            type: 'Get',
                            dataType: 'json',
                            beforeSend: function () {

                            },
                            complete: function () {

                            },
                            success: function (result) {
                                var DS = {
                                    id: '',
                                    Name: '',
                                    Type: '',
                                    Description: '',
                                    ScheduleCant: '',
                                    ScheduleUnit: '',
                                    Adress: '',
                                    user: '',
                                    password: ''
                                }
                                $.extend(DS, result);
                                $('#IdDataSourceRemove').val(DS.id);
                                $('#NameDSRemove').html(DS.Name);

                            },
                            error: function (xhr, status, error) {

                            }
                        });
                    });
                });
                $('#TotalResults').html(Data.TotalResult + " results");
                if (ucDataSources._ChangeFilterText()) {
                    ucDataSources._OldTerms = ucDataSources._NewTerms;
                    ucDataSources._CantsFilterLeft = Data.CantTypes;
                }
                var Cantidades = ucDataSources._CantsFilterLeft;
                    $('.BtnFiltros').each(function () {
                        var filterBtn = $(this).attr('filter');
                        var namefilter = $(this).attr('namefilter');
                        var btnFiltro = $(this);
                        $.each(Cantidades, function (i, filtro) {
                            if (filterBtn.toLowerCase() == filtro.Key) {
                                btnFiltro.html(namefilter + ' [' + filtro.Value + ']');
                            }
                        });
                    });

                
            },
            error: function (xhr, status, error) {

            }
        });
    },
    Save: function () {

        $("#frmAM_DataSource").ajaxForm({
            url: '/Admin/Save',
            type: 'POST',
            success: function (result) {
                if (result) {
                    alert("Data Sources saved");
                    $('#PopUpAM_Datasource').modal('hide');
                    ucDataSources.Load(window.location.hash);
                }
            }
        });
        $("#frmAM_DataSource").validate();
        $("#frmAM_DataSource").submit();

    },
    Remove: function (IdDataSource) {
        $.ajax({
            url: '/admin/DeleteDataSource?IdDataSource=' + IdDataSource,
            type: 'Get',
            dataType: 'json',
            beforeSend: function () {

            },
            complete: function () {

            },
            success: function (result) {
                if (result) {
                    alert("Data Source deleted ");
                    $('#remove_alert').modal('hide');
                    ucDataSources.Load(window.location.hash);
                }
            },
            error: function (xhr, status, error) {

            }
        });
    },
    /*
    _CompletInputSearchBox: Metodo privado que coloca el texto de busqueda en todos los
    inputs de busquedas de la singlePage.
    */
    _CompletInputSearchBox: function (text) {

        $('.BtnSearch').each(function () {
            $('#' + $(this).data('idinputasociate')).val(text);
        });
    },
    _DrawFiltersLeft: function () {
        $.ajax({
            url: '/Admin/GetTypes',
            type: 'Get',
            dataType: 'json',
            beforeSend: function () {

            },
            complete: function () {

            },
            success: function (result) {
                
                $('#FilterLeft').html($('#tmpl_AddLeftFilter').render({ Items: result }));
            },
            error: function (xhr, status, error) {

            }
        });

    },
    _drawFilters: function (Types, TextSearch) {

        $('.BtnFiltros').css('display', 'block');
        $('.BtnFiltros').removeClass('Active');
        var listTipos = Types.split(',');
        var tiposRender = [];
        if (Types != '') {
            $.each(listTipos, function (i, tipo) {
                $('.' + tipo).css('display', 'none');
                $('.' + tipo).addClass('Active');
                tiposRender.push({ Name: tipo, Text: $('.' + tipo).attr('namefilter') });
            });
        }
        if (tiposRender.length > 0) {
            $('#DescriptionPanel').html('Applied filters:');
        }
        else {
            $('#DescriptionPanel').html('');
        }
        $("#FiltersActive").html($('#tmpl_AddFilter').render({ Items: tiposRender }));
        $('.ClickSuprFiltersUp').click(function () {
            var tipo = $(this).parent().attr('filter');
            $(this).parent().remove();
            $('.' + tipo).css('display', 'block');
            $('.' + tipo).removeClass('Active');
            ucDataSources.filtrarResults(TextSearch);
        });
        $('.BtnFiltros').click(function () {
            $(this).addClass('Active');
            $(this).css('display', 'none');
            ucDataSources.filtrarResults(TextSearch);
        });
    },
    filtrarResults: function (TextSearch) {
        var filtrados = $('.Active');
        var txtFiltersHash = '';
        filtrados.each(function () {
            if (txtFiltersHash == '') {
                txtFiltersHash += $(this).attr('filter');
            }
            else {
                txtFiltersHash += ',' + $(this).attr('filter');
            }
        });
        ucDataSources.UpdateHashSearch({
            TextSearch: TextSearch,
            page: 1,
            types: txtFiltersHash
        });
    },
    _drawPager: function (result, TextSearch) {

        $('.PaginationSearch').html($("#tmpl_Pager").render({ Items: GetArrPager(result.page, result.CantPages), TotalPages: result.CantPages }));
        $('.SelectPage').click(function () {
            ucDataSources.Search({
                filter: TextSearch,
                page: $(this).attr('PageNum'),
                types: result.types
            });
        });
        $('.clickNextPrev').click(function () {
            var PageAct = parseInt($(this).attr('PageAct'));
            result.page = ($(this).hasClass('ant') ? (PageAct - 1) : (PageAct + 1));

            ucDataSources.Search({
                filter: TextSearch,
                page: result.page,
                types: result.types
            });
        });

    }
}

$(document).ready(function () {
    HashManager.RegisterPartialView({
        obj: ucDataSources,
        Key: ucDataSources.NameContainer
    });
    $('.SearchText').keyup(function (event) {
        if (event.keyCode == 13) {
            ucDataSources.UpdateHashSearch({ TextSearch: $(this).val() });
        }
    });

    // Search button to bring search results
    $('.BtnSearch').click(function (e) {
        ucDataSources.UpdateHashSearch({ TextSearch: $('#' + $(this).data('idinputasociate')).val() });
    });
});


function GetArrPager(numPagActual, TotalPaginas) {
    var pages = [];

    var Extremos = 2;

    var ExtremoIz = numPagActual - Extremos;
    var ExtremoDer = numPagActual + Extremos;

    ExtremoIz = ((ExtremoIz <= 0) ? 1 : ExtremoIz);
    ExtremoDer = ((ExtremoDer > TotalPaginas) ? TotalPaginas : ExtremoDer);
    if (numPagActual > 1) {
        pages.push({ clases: 'ant clickNextPrev', PageNum: '<<', PageAct: numPagActual, TotalPage: TotalPaginas });
    }
    for (var i = ExtremoIz; i <= ExtremoDer ; i++) {
        var clases = 'SelectPage ';
        if (i == numPagActual) {
            clases = 'active';
        }

        pages.push({ clases: clases, PageNum: i, PageAct: numPagActual, TotalPage: TotalPaginas });
    }
    if (ExtremoDer < TotalPaginas) {
        pages.push({ clases: 'Sig clickNextPrev', PageNum: '>>', PageAct: numPagActual, TotalPage: TotalPaginas });

    }
    return pages;
}