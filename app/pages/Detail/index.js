import Button from "classes/Button";
import Page from "classes/Page";

export default class Detail extends Page {
    constructor() {
        super({
            id: 'detail', 
            element: '.detail', 
            elements:
            {
                wrapper: '.detail__wrapper',
                navigation: document.querySelector('.navigation'),
                button: '.detail__button'
            }
        });
    }

    create() {
        super.create();
        this.link = new Button({
            element: this.elements.button
        })
    }

    destroy() {
        super.destroy();
        this.link.removeEventListeners();
    }
}