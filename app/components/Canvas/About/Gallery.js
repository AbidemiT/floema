import { Transform } from 'ogl';
import GSAP from 'gsap';

import map from "lodash/map";

import Media from "./Media";

export default class Gallery {
    constructor({ gl, element, index, geometry, scene, sizes }) {
        this.elementWrapper = element.querySelector('.about__gallery__wrapper');

        this.gl = gl;
        this.element = element;
        this.index = index;
        this.geometry = geometry;
        this.scene = scene;
        this.sizes = sizes;

        this.group = new Transform();

        this.scroll = {
            current: 0,
            target: 0,
            start: 0,
            lerp: 0.1,
            velocity: 1
        }

        this.createMedias();

        this.group.setParent(this.scene);
    }


    createMedias() {
        this.mediasElements = this.element.querySelectorAll('.about__gallery__media');

        this.medias = map(this.mediasElements, (element, index) => {
            return new Media({
                gl: this.gl,
                element,
                index,
                geometry: this.geometry,
                scene: this.group,
                sizes: this.sizes
            })
        })
    }

    /** 
     * Animations.
    */
    show() {
        map(this.medias, gallery => gallery.show());
    }

    hide() {
        map(this.medias, gallery => gallery.hide());
    }

    /**
     * Events
     */

    onResize(event) {
        this.bounds = this.elementWrapper.getBoundingClientRect();

        this.sizes = event.sizes;

        this.width = this.bounds.width / window.innerWidth * this.sizes.width

        this.scroll.current = this.scroll.target = 0;

        map(this.medias, media => media.onResize(event, this.scroll.current));
    }

    onTouchDown({ x, y }) {
        this.scroll.start = this.scroll.current
    }

    onTouchMove({ x, y }) {
        const distance = x.start - x.end

        this.scroll.target = this.scroll.start - distance
    }

    onTouchUp({ x, y }) {

    }

    update(scroll) {
        if (!this.bounds) return

        const distance = (scroll.current - scroll.target) * 0.1;
        const y = scroll.current / window.innerHeight;

        if (this.scroll.current < this.scroll.target) {
            this.direction = 'right';
            this.scroll.velocity = -1;
        } else if (this.scroll.current > this.scroll.target) {
            this.direction = 'left'
            this.scroll.velocity = 1;
        }

        this.scroll.target -= this.scroll.velocity;
        this.scroll.target += distance;

        this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp);

        map(this.medias, (media, index) => {
            const scaleX = media.mesh.scale.x / 2 + 0.25

            if (this.direction === 'left') {
                const x = media.mesh.position.x + scaleX;

                if (x < -this.sizes.width / 2) {
                    media.extra += this.width;
                }

            } else if (this.direction === 'right') {
                const x = media.mesh.position.x - scaleX;

                if (x > this.sizes.width / 2) {
                    media.extra -= this.width;
                }
            }


            media.update(this.scroll.current);

            // media.mesh.position.y = Math.cos((media.mesh.position.x / this.width) * Math.PI) * 1 - 1;
        })

        this.group.position.y = y * this.sizes.height
    }

    /** 
     * Destroy
    */

    destroy() {
        this.scene.removeChild(this.group);
    }
}