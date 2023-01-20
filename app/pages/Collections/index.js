import Page from "classes/Page";

export default class Collections extends Page {
    constructor() {
        super({
            id: 'collections', element: '.collections', elements:
            {
                wrapper: '.collections__wrapper',
                navigation: document.querySelector('.navigation'),
            }
        });
    }
}