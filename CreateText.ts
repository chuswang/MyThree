import * as THREE from 'three';
export default class CreateText {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    constructor() {
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.sprite = null;
    }
    drawText(text: string, ctxOptions ? : any) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const pat = /[A-z]/;
        const pat1 = /\d/;
        const textArr = text.split('');
        const num = textArr.reduce((pre, str) => {
            if (pat.test(str)) {
                pre += 45;
            } else if (pat1.test(str)) {
                pre += 30;
            } else {
                pre += 30;

            }
            return pre;
        }, 0)
        this.canvas.width = THREE.Math.ceilPowerOfTwo(num);
        this.canvas.height = 64;
        this.ctx.fillStyle = ctxOptions.color || '#000';
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        textArr.reduce((pre, str) => {
            if (pat.test(str)) {
                this.ctx.font = `italic 60px "Times New Roman"`;
                this.ctx.fillText(str, pre, 0);
                pre += 45;
            } else if (pat1.test(str)) {
                this.ctx.font = `30px "Times New Roman"`;
                this.ctx.fillText(str, pre, 30);

                pre += 30;
            } else {
                this.ctx.font = `60px "Times New Roman"`;
                this.ctx.fillText(str, pre, 0);

                pre += 30;

            }
            return pre;
        }, 0)
        const texture = new THREE.Texture(this.canvas);
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.LinearMipMapLinearFilter
        texture.needsUpdate = true;
        this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: texture,
        }))
        this.sprite.scale.set(this.canvas.width / 10, this.canvas.height / 10, 1)
        return this.sprite;
    }
}