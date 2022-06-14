import {doStyleProductsListing} from "../blocks/productsListing";
import {doStyleAdvantages} from "../blocks/advantages";

export class MainPage {
    static EventListeners = {
    }

    static async doInit() {
        doStyleProductsListing();
        MainPage.doStyleMisc();
        MainPage.doAddTitleToProductSliders();
        MainPage.doSetupBlogEntries();
        MainPage.doStyleCarouselWithNav();
        MainPage.doStyleBodyBanners();
        MainPage.doStyleProductSlider();
        doStyleAdvantages($('.products-block').closest('.content-wrapper'));
        return true;
    }

    static doStyleMisc() {
        // respo move carousel under header so it can be full width of screen
        $('body.mobile .wide-carousel').insertAfter('#header');

        $('<div class="homepage-group-title homepage-footer-banner-heading-1 h4">Oblíbené kategorie</div>').insertBefore('.footer-banners');
    }
    static doAddTitleToProductSliders() {
        $('[class*="homepage-products-heading-"]').each(function (index, element) {
            const $productBlock = $(element).find('+ .products-block');
            $(`<div class="products-block-wrapper i-${index}"></div>`).insertAfter($productBlock);
            $(element).appendTo(`.products-block-wrapper.i-${index}`);
            $productBlock.appendTo(`.products-block-wrapper.i-${index}`);
        })
    }
    static doSetupBlogEntries() {
        $('<div class="blog-hp container"></div>').insertBefore($("#dklab_instagram_widget").length ? "#dklab_instagram_widget" : "#footer");

        $(".blog-hp").load("/blog/ .news-wrapper .news-item:nth-child(-n+2)", function() {
            $('.blog-hp').prepend('<div class="blog-title"><div class="page-title-separator"></div><h4 class="homepage-group-title h4">ještě jste nečetli naše poslední články?</h4></div>');
            $('.news-item .text').append('<div class="news-item-btn"><a href="/">Přečíst článek</a></div>');
            $('.blog-hp .news-item').each(function (index, element) {
                var $link = $(element).find('.text > a').attr('href');
                $(element).find('.news-item-btn > a').attr('href', $link);
            });
        });
    }
    static doStyleCarouselWithNav() {
        const slider = '#carousel';
        if ($(slider).length) {
            $(slider).wrap("<div class='glider-contain fv-carousel'/>");
            $(slider).parent().append(`
                    <div data-glide-el="controls">
                        <button aria-label="Previous" class="glider-prev"></button>
                        <button aria-label="Next" class="glider-next"></button>
                    </div>
                    <div role="tablist" class="dots"></div>
                `);

            new Glider(document.querySelector('.carousel-inner'), {
                draggable: true,
                slidesToShow: 1,
                dragVelocity: 1,
                dots: `.fv-carousel .dots`,
                arrows: {
                    prev: `.fv-carousel .glider-prev`,
                    next: `.fv-carousel .glider-next`,
                },
            });
        }

        // let $currentlySelectedIndex = 0;
        // // add carousel navigation
        // $(`<div id="carousel-navigation"></div>`).insertAfter('#carousel');
        //
        // let item = $('#carousel > .carousel-inner > .item');
        // for( let i=0; i < item.length; i++ ) {
        //     $(item[i]).addClass(`item${i}`);
        //     $(`
        //             <a class="nav-item item${i} carousel" href="#carousel" role="button" data-slide-to="${i}"><span>${i+1}</span></a>
        //         `).appendTo('#carousel-navigation');
        // }
        //
        // $(item)
        //     .observe({ attributes: true, attributeFilter: ['class'] },  function(record) {
        //         if(record.target.classList.contains('active') && !record.target.classList.contains('left')) {
        //             let currentItemNo = record.target.className.match(/[0-9]+/g);
        //
        //             // Prevent already selected items from being reselected
        //             if(currentItemNo[0] === $currentlySelectedIndex) { return; }
        //
        //             let prevSelector = `.nav-item.item${$currentlySelectedIndex}`;
        //             let currentSelector = `.nav-item.item${currentItemNo[0]}`
        //             // Cleanup previous selection
        //
        //             $(prevSelector).removeClass('active');
        //             $currentlySelectedIndex = currentItemNo[0];
        //             $(currentSelector).addClass('active');
        //         }
        //     });
    }
    static doStyleBodyBanners() {
        // $('.before-carousel .banners-row .next-to-carousel-banners').insertBefore('.body-banners');
    }
    static doStyleProductSlider() {
        const slider = '.products-block';
        if ($(slider).length) {
            $(slider).each(function (index, element) {
                $(element).wrap("<div class='glider-contain'/>");
                $(element).parent().append(`
                    <div data-glide-el="controls">
                        <button aria-label="Previous" class="glider-prev"></button>
                        <button aria-label="Next" class="glider-next"></button>
                    </div>
                `);

                new Glider(element, {
                    draggable: true,
                    slidesToShow: 1.25,
                    dragVelocity: 1,
                    // dots: `.i-${index} .dots`,
                    arrows: {
                        prev: `.i-${index} .glider-prev`,
                        next: `.i-${index} .glider-next`,
                    },
                    responsive: [
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 2.25,
                                slidesToScroll: 2,
                            },
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 4.5,
                                slidesToScroll: 4,
                            },
                        },
                    ],
                });
            })
        }
    }
}
