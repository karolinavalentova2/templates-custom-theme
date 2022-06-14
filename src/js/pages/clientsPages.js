export class ClientsPages {
    static async doInit() {
        ClientsPages.doStyleMisc();
        return true;
    }

    static doStyleMisc() {
        $('body').addClass('in-client');
    }
}
