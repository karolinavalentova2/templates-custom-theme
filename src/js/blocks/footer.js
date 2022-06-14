
export function doStyleFooter() {
    $("#signature").append(' | <a href="https://www.fv-studio.cz/?utm_source=tlama-games&utm_medium=footer+signature" target="_blank" class="footer-customized">Upravilo <strong>FV STUDIO</strong></a>');

    // advantage
    // doStyleAdvantages('.custom-footer > div:first-child');

    // banners
    $('#footer .custom-footer .banner').parent().addClass('hidden');

    // newsletter
    $('#footer .extended').prependTo('#footer');
    $('#footer .extended').append('<div class="text container"></div>');
    $('#footer .extended .newsletter-header, #footer .extended form').appendTo('#footer .extended .text');
    $('#footer .extended h4 span').text('').append('<span><strong>Přihlašte se</strong> do našeho newsletteru</span>');
    $('#footer .extended .newsletter-header').append('<p>a získejte slevu na Váš nákup!</p>');
    $('#footer .extended button').text('Přihlásit se');

    // footer store
    $('#footer .footer-store').closest('.banner').parent().addClass('store').removeClass('hidden');

    // contact
    $('.custom-footer__contact > h4 span').text('Máte dotaz?');
    $('.custom-footer__contact ul li .mail, .custom-footer__contact ul li .tel').append('<span>zákaznické centrum</span>');

    // social
    // $(`
    //     <div class="social-footer">
    //         <h4>Sledujte nás</h4>
    //         <div></div>
    //     </div>
    // `).appendTo('.custom-footer')
    // const $banner = $('#footer img[alt="social"]');
    // $banner.parent().attr('target', '_blank');
    // $banner.closest('.banner').parent().appendTo('.social-footer > div');
    //
    // $('.contact-box .facebook').parent().addClass('hidden');
    // $('.contact-box .instagram').parent().addClass('hidden');
    //
    // // search
    // $('.header-top .search').clone().appendTo('#footer .custom-footer');

    // accordeon
    if(window.matchMedia('(max-width: 767px)').matches) {
        $('#footer .custom-footer > div:first-of-type').addClass('active');
    }
    const triggers = $('#footer .custom-footer > div:not(.custom-footer__contact) > h4:first-of-type');
    $(triggers).on("click", function () {
        if ($(this).parent().hasClass("active")) {
            $(this).parent().removeClass("active");
        } else {
            $("#footer .custom-footer > div").removeClass("active");
            $(this).parent().addClass("active");
        }
    });
}
