import GSAP from 'gsap';
import { Texture, Mesh, Program } from 'ogl';

import fragment from 'shaders/plane.fragment.glsl';
import vertex from 'shaders/plane.vertex.glsl';

export default class {
    constructor({ gl, element, index, geometry, scene, sizes }) {
        this.gl = gl;
        this.element = element;
        this.index = index;
        this.geometry = geometry;
        this.scene = scene;
        this.sizes = sizes;

        this.createTexture();
        this.createProgram();
        this.createMesh();

        this.extra = {
            x: 0,
            y: 0
        }

    }

    createTexture() {
        this.texture = new Texture(this.gl);

        const img = this.element.querySelector('img');

        this.image = new Image();
        this.image.crossOrigin = 'anonymous';
        this.image.src = img.getAttribute('data-src');
        this.image.onload = _ => (this.texture.image = this.image);
    }

    createProgram() {
        this.program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                uAlpha: {value: 0},
                tMap: { value: this.texture },
            }
        });
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        });

        this.mesh.setParent(this.scene);
    }

    createBounds({ sizes }) {
        this.sizes = sizes;
        this.bounds = this.element.getBoundingClientRect();

        this.updateScale();
        this.updateX();
        this.updateY();
    }

    /** 
     * Animations
    */
    show() {
        GSAP.fromTo(this.program.uniforms.uAlpha, {
            value: 0
        }, {
            value: 1
        })
    }

    hide() {
        GSAP.to(this.program.uniforms.uAlpha, {
            value: 0
        })
    }

    /** 
     * Events
    */
    onResize(sizes, scroll) {
        this.extra = 0;

        this.createBounds(sizes);

        this.updateX(scroll);
        this.updateY(0);
    }

    /**
    * Loop.
    */

    updateScale() {
        this.height = this.bounds.height / window.innerHeight;
        this.width = this.bounds.width / window.innerWidth;

        this.mesh.scale.x = this.sizes.width * this.width;
        this.mesh.scale.y = this.sizes.height * this.height;
    }

    updateX(x = 0) {
        this.x = (this.bounds.left + x) / window.innerWidth;

        this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width) + this.extra
    }

    updateY(y = 0) {
        this.y = (this.bounds.top + y) / window.innerHeight;

        this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height)
    }

    update(scroll) {
        if (!this.bounds) return

        this.updateX(scroll);
        this.updateY(0);
    }
}