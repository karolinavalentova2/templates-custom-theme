import {HelperFunctions} from "../config/helperFunctions";
import {TranslationsManager} from "../utils/localisationManager";

export function doStyleSidebarFilters() {
    if(!$('.open-filter-modal').length) {
        $(`<div class="open-filter-modal desktop">${TranslationsManager.doGetStringByLang("DETAILED_FILTER")}</div>`).prependTo('.type-category .sidebar-inner');
        $(`<div class="open-filter-modal mobile">${TranslationsManager.doGetStringByLang("DETAILED_FILTER")}</div>`).insertBefore('.type-category #category-header');
    }

    $('.filter-sections .filter-section-boolean').insertBefore('.filter-section.filter-section-count');

    $('.filter-section .filter-label.active').closest('.filter-section').addClass('open');
    $(".slider-wrapper").prependTo("#category-filter-hover");
    $('#category-filter-hover .filter-section, #category-filter-hover .slider-wrapper').addClass('open');

    $("body").on("click", ".filter-sections h4", function(event){
        event.preventDefault();
        $(this).closest(".filter-section").toggleClass("open");
        $(this).closest(".slider-wrapper").toggleClass("open");
    });
    $("body").on("click", ".box-categories h4", function(event){
        event.preventDefault();
        $(this).closest(".box-categories").toggleClass("open");
    });

    $(`
        <div class="filter-modal-wrapper">
            <div class="top">
                <p>${TranslationsManager.doGetStringByLang("DETAILED_FILTERING")}</p>
                <div class="close"></div>
            </div>
            <div class="filter-inside">
                <div class="triggers"></div>
                <div class="forms"></div>
            </div>
            <div class="bottom">
                <div class="btn close">${TranslationsManager.doGetStringByLang("CLOSE")}</div>
                <div class="btn apply">${TranslationsManager.doGetStringByLang("SHOW")}</div>
            </div>
        </div>
        <div class="filter-bg"></div>
    `).appendTo('#filters');
    $('#filters #price-filter-form, #filters > .filter-sections').appendTo('.filter-modal-wrapper .filter-inside .forms');

    $('#filters .close, #filters .filter-bg').on('click', function () {
        $('#filters').removeClass('visible');
        $('.filters-unveil-button-wrapper > a').data('text', TranslationsManager.doGetStringByLang("SH_CLOSE_FILTER")).text(TranslationsManager.doGetStringByLang("SH_OPEN_FILTER"));
        HelperFunctions.doCloseAllModalOverlays();
    })

    // style filters as modal on desktop
    $('.open-filter-modal').on('click', function () {
        $(document.body).addClass('fv-filter-modal');
    })
}
export function doStyleCategorySliderFilter() {
    const filterToSlider = {
        // 'en': {
        // },
        'cs': {
            120: {},
            129: {},
            132: {},
            135: {},
            138: {},
            141: {},
        },
    };
    const filterSliderUnit = {
        // 'en': {
        // },
        'cs': {
            120: '',
            129: '',
            132: '',
            135: 'min',
            138: '',
            141: '',
        },
    }
    const floatNumberFixer = 1000000;
    const language = $('html').attr('lang');

    const $filterWrapper = $('<div class="filter-section-custom-wrapper"></div>');
    $('#content-wrapper #filters .filter-sections').prepend($filterWrapper);

    if (typeof filterToSlider[language] === 'undefined') {
        return;
    }

    $.each(filterToSlider[language], function (paramId, data) {
        var filterSection = $('#content-wrapper #filters .filter-section.filter-section-parametric-id-'+ paramId);

        filterToSlider[language][paramId] = {};

        if (filterSection.length > 0) {
            var query = null;

            filterSection.addClass('otevreny aktivni');
            $filterWrapper.append(filterSection);

            var fieldset = filterSection.find('fieldset');
            fieldset.addClass('fvstudio-hidden').hide();
            filterSection.find('fieldset input[data-filter-id="' + paramId + '"]:not(:disabled)').each(function (i, e) {

                if (query === null) {
                    query = $(this).attr('data-url');
                }

                var paramValue = $(this).attr('id').match(/pv\[\]([0-9]+)$/);
                var value = $(this).val();

                if (typeof paramValue[1] !== 'undefined') {
                    value = value.replace(/ /g,'').replace(',', '.').replace('+', '');
                    value = parseFloat(value.replace( /[^\d\.-]*/g, ''));
                    value = parseInt(value * floatNumberFixer);

                    if (!isNaN(value)) {
                        filterToSlider[language][paramId][value] = parseInt(paramValue[1]);
                    }
                }
            });

            var urlSite = new URL(query);
            var urlParams = new URLSearchParams(urlSite.search);
            if (urlParams.has('pv' + paramId)) {
                urlParams.delete('pv' + paramId);
            }

            var ordered = Object.keys(filterToSlider[language][paramId]).sort((a, b) => a - b).reduce(
                (obj, key) => {
                    key = parseFloat(key);
                    obj[key + ' '] = filterToSlider[language][paramId][key];
                    return obj;
                },
                {}
            );

            filterToSlider[language][paramId] = ordered;

            if (!$.isEmptyObject(filterToSlider[language][paramId])) {

                var $slider = $('<div class="slider-wrapper-params">' +
                    '   <div class="slider-header-params">' +
                    '      <span class="from"><span id="min-' + paramId + '">0</span></span>' +
                    '      <span class="to"><span id="max-' + paramId + '">0</span></span>' +
                    '   </div>' +
                    '   <div class="slider-content-params">' +
                    '      <div id="slider-' + paramId + '"></div>' +
                    '   </div>' +
                    '</div>');

                var sliderValues = [];

                var i = 0;
                var length = parseInt(Object.keys(filterToSlider[language][paramId]).length);

                var filterValues = [];

                var minSelected = null;
                var maxSelected = null;


                var queryCurrent = window.location.search;
                var urlParamsCurrent = new URLSearchParams(queryCurrent);

                var selectedParams = urlParamsCurrent.get('pv'+ paramId);
                if (selectedParams !== null) {
                    var arr = selectedParams.split(',');
                    minSelected = arr[0];
                    maxSelected = arr[arr.length - 1];
                }

                $.each(filterToSlider[language][paramId], function (value, paramValue) {
                    value = value.replace(/ /g,'');
                    value = parseFloat(value) / parseFloat(floatNumberFixer);

                    if ((minSelected === false && i == 0) || minSelected == paramValue) {
                        filterValues.push(i);
                    }

                    if ((maxSelected === false && i == (length-1)) || maxSelected == paramValue) {
                        filterValues.push(i);
                    }

                    sliderValues.push(parseFloat(value));

                    i++;
                });

                if (filterValues.length == 0) {
                    filterValues = [0, length-1];
                }

                $slider.find('#min-' + paramId).text(sliderValues[filterValues[0]] + ' '+ filterSliderUnit[language][paramId]);
                $slider.find('#max-' + paramId).text(sliderValues[filterValues[1]] + ' '+ filterSliderUnit[language][paramId]);

                $slider.find('#slider-' + paramId).slider({
                    range: true,
                    min: 0,
                    max: length-1,
                    values: filterValues,
                    disabled: (sliderValues.length <= 1 ? true : false),
                    slide: function( event, ui ) {
                        $slider.find('#min-' + paramId).text( parseFloat(sliderValues[ui.values[ 0 ]]) + ' '+ filterSliderUnit[language][paramId] );
                        $slider.find('#max-' + paramId).text( parseFloat(sliderValues[ui.values[ 1 ]]) + ' '+ filterSliderUnit[language][paramId] );
                    },
                    stop: function( event, ui ) {
                        var m = parseFloat(sliderValues[ui.values[ 0 ]]) * parseFloat(floatNumberFixer);
                        var n = parseFloat(sliderValues[ui.values[ 1 ]]) * parseFloat(floatNumberFixer);

                        var selected = [];
                        $.each(filterToSlider[language][paramId], function (v, p) {
                            if (m <= v && n >= v) {
                                selected.push(p);
                            }
                        });

                        if (selected.length === Object.keys(filterToSlider[language][paramId]).length) {
                            urlParams.delete('pv' + paramId);
                        } else {
                            urlParams.set('pv' + paramId, selected.join(','));
                        }

                        var url = window.location.href;
                        if (url.indexOf("?")>-1) {
                            url = url.substr(0,url.indexOf("?"));
                        }

                        HelperFunctions.makeRequest(url +'?'+ urlParams.toString().replace(/%2C/g, ','), true, false, event.target, 'ShoptetPageFilterValueChange');

                    }
                });

                fieldset.after($slider);
            }
        }
    });

    doStyleFilterModalTriggers();
}
export function doStyleFilterModalTriggers() {
    $('#category-filter-hover > .slider-wrapper').addClass('filter-section');
    $('.filter-section.filter-section-boolean').prepend(`<h4><span>${TranslationsManager.doGetStringByLang("FLAGS")}</span></h4>`);

    // if($('.fv-filter-modal').length) {
    //     $('#filters h4').on('click', function (ev) {
    //         ev.preventDefault();
    //         ev.stopImmediatePropagation();
    //     })
    // }

    $('.filter-section:not(.filter-section-count):not(.filter-section-button)').each((index, element) => {
        const name = $(element).find('h4').text();
        $(element).attr(`data-trigger`, index);
        $(`<div class="trigger ${index === 0 ? 'active' : ''}" data-rec="${index}"><span>${name}</span></div>`).appendTo('.filter-modal-wrapper .triggers');

        if(index === 0) {
            $(element).addClass("show-in-modal");
        }
    })

    $('#filters .filter-modal-wrapper .triggers .trigger').on('click', function (ev) {
        const data = $(ev.currentTarget).attr('data-rec');
        const $section = $(`.filter-section[data-trigger="${data}"]`);

        $(`.filter-section`).removeClass("show-in-modal");
        $section.addClass("show-in-modal");
        $('.fv-filter-modal #filters .filter-modal-wrapper .triggers .trigger').removeClass('active');
        $(ev.currentTarget).addClass('active');
    })
}
