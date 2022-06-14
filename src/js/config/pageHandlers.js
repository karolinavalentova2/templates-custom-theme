import {MainPage} from "../pages/mainPage";
import {CartFirstStep} from "../pages/cart/cartFirstStep";
import {CartSecondStep} from "../pages/cart/cartSecondStep";
import {CartThirdStep} from "../pages/cart/cartThirdStep";
import {ProductPage} from "../pages/productPage";
import {CategoryPage} from "../pages/categoryPage";
import {BlogListPage} from "../pages/blog/blogListPage";
import {CartThankYouPage} from "../pages/cart/cartThankYouPage";
import {NotFoundPage} from "../pages/notFoundPage";
import {ClientsPages} from "../pages/clientsPages";

/*
* @desc We use the jQuery hasClass to match the pages, so you can add multiple classes to be matched as ex: 'type-index type-blog'
* */
export const PageHandlers = {
    '.type-index': MainPage,
    '.in-kosik': CartFirstStep,
    '.in-krok-1': CartSecondStep,
    '.in-krok-2': CartThirdStep,
    '.in-dekujeme': CartThankYouPage,
    '.type-product': ProductPage,
    '.type-category': CategoryPage,
    '.in-blog.type-posts-listing': BlogListPage,
    '.in-404': NotFoundPage,
    'load-by-url': {
        '/klient/': ClientsPages,
        '/klient/nastaveni/': ClientsPages,
        '/klient/objednavky/': ClientsPages,
        '/klient/klient-doklady/': ClientsPages,
        '/klient/klient-slevy/': ClientsPages,
        '/klient/klient-hodnoceni/': ClientsPages,
        '/klient/klient-diskuze/': ClientsPages,
    }
}
