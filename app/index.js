import each from "lodash/each";

import Preloader from "./components/Preloader";

import About from "./pages/About";
import Collections from "./pages/Collections";
import Detail from "./pages/Detail";
import Home from "./pages/Home";

class App {
    constructor() {
        this.createPreloader();
        this.createContent();
        this.createPages();

        this.addEventListeners();
        this.addLinkListeners();

        this.onResize();

        this.update();
    }

    createPreloader() {
        this.preloader = new Preloader();
        this.preloader.once('completed', this.onPreloaded.bind(this))
    }

    createContent() {
        this.content = document.querySelector('.content');
        this.template = this.content.getAttribute('data-template');
    }

    createPages() {
        this.pages = {
            about: new About(),
            collections: new Collections(),
            detail: new Detail(),
            home: new Home()
        }

        this.page = this.pages[this.template]
        this.page.create();
    }
    
    async onPreloaded() {
        this.preloader.destroy();

        this.onResize();
        
        await this.page.show();
    }

    async onChange(url) {
        await this.page.hide()
        const request = await window.fetch(url);

        if (request.status === 200) {
            const html = await request.text();

            const div = document.createElement('div');
            div.innerHTML = html;

            const divContent = div.querySelector('.content');
            this.template = divContent.getAttribute('data-template');

            this.content.setAttribute('data-template', this.template)
            this.content.innerHTML = divContent.innerHTML;

            // Setup incoming page
            this.page = this.pages[this.template];

            this.page.create();

            this.onResize();

            await this.page.show();

            this.addLinkListeners();
        } else {
            console.log("Error");
        }
    }

    onResize() {
        if (this.page && this.page.onResize) {
            this.page.onResize();
        }
    }

    update() {
        if (this.page && this.page.update) {
            this.page.update();
        }

        this.frame = window.requestAnimationFrame(this.update.bind(this));
    }

    addEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
    }

    addLinkListeners() {
        const links = document.querySelectorAll('a');

        each(links, link => {
            link.onclick = event => {
                event.preventDefault();

                const { href } = link;

                this.onChange(href);
            }
        })
    }
}

new App;