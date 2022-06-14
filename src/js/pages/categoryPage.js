import {doStyleProductsListing} from "../blocks/productsListing";
import {doStyleCategorySliderFilter, doStyleSidebarFilters} from "../blocks/sidebarFilters";
import {STATES} from "../config/states";

export class CategoryPage {
    static EventListeners = {
        'ShoptetDOMPageContentLoaded': CategoryPage.doInit,
        'ShoptetDOMPageMoreProductsLoaded': CategoryPage.doLoadOnShoptetDOMPageMoreProductsLoaded,
    }
    static doLoadOnShoptetDOMPageMoreProductsLoaded() {
        doStyleProductsListing();
    }

    static async doInit() {
        CategoryPage.doStyleMisc()
        CategoryPage.doStylePerex();
        // CategoryPage.doStyleSorting();
        doStyleProductsListing();
        doStyleSidebarFilters();
        doStyleCategorySliderFilter();
        if($('.content-wrapper-in > .empty-content').length) {
            $('body').addClass('empty-category');
        }
        return true;
    }

    static doStyleMisc() {
        // $('.type-category main > h4:contains("Nejprodávanější")').addClass('hidden');
    }

    // static doStyleSorting() {
    //     const $selectedSort = $(".category-header input[type=\"radio\"]:checked+label").text();
    //     $("<div class='category-header-sort'>").insertBefore("#category-header > form > fieldset")
    //         .append(`<p>&nbsp ${$selectedSort} &nbsp</p><span class="submenu-arrow"></span>`);
    //
    //     $(".category-header-sort").click(function(){
    //         $(".category-header-sort .submenu-arrow").toggleClass("up").css("padding-right", "1em");
    //         $("#category-header > form > fieldset").toggleClass("visibility");
    //     });
    //
    //     $(document).on("click", function (e) {
    //         if (!$(e.target).closest(".category-header-sort").length) {
    //             $("#category-header > form > fieldset").removeClass("visibility");
    //             $(".category-header-sort .submenu-arrow").removeClass('up');
    //         }
    //     });
    // }

    static doStylePerex() {
        if(!$('.content-wrapper-in > .category-perex').length) {
            $('main .category-perex').prependTo('.content-wrapper-in');
            $('main h1.category-title').prependTo('.category-perex');
            // const $perex = $('main .category-perex')
            // const $header = $('main h1.category-title');
            // const $perexImg = $('main .category-perex img');
            // const perexImgSrc = $perexImg.attr('src');
            //
            // if( !STATES.isCategoryPerexRan ) {
            //     STATES.isCategoryPerexRan = true;
            //     $perex.prependTo('.content-wrapper-in');
            // }
            // $header.prependTo($perex);
            // $perex.css('background-image', `url(${perexImgSrc})`);
            // $perexImg.closest('p').addClass('hidden');
        }
    }
}
