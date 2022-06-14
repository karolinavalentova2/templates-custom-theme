export class BlogListPage {
    static EventListeners = {
        'ShoptetDOMPageContentLoaded': BlogListPage.doLoadOnShoptetDOMPageContentLoaded,
    }
    static doLoadOnShoptetDOMPageContentLoaded() {
        BlogListPage.doStyleMisc();
    }

    static async doInit() {
        BlogListPage.doStyleMisc();
        return true;
    }

    static doStyleMisc() {
        // $('.news-item').each(function (index, element) {
        //     // $(element).addClass("col-sm-12 col-md-12 col-lg-6");
        //     var $link = $(element).find('.image > a').attr('href');
        //     $(element).find('.text').append('<div class="news-item-btn"><a href="/">Přečíst</a></div>');
        // })
    }
}
