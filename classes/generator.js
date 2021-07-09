
const PImage = require('pureimage');
// const utils = require('../utils');
// var fs = require('fs');
// var path = require('path');

const Generator = class {
    constructor(options) {
        this.fnt = PImage.registerFont('./assets/fonts/SourceSansPro-Regular.ttf','Source Sans Pro');
        this.img;
        this.ctx;

        this.bounds = {
            x1: 100,
            y1: 100,
            x2: this.width - 200,
            y2: this.height - 200
        }

        this.width = 1500;
        this.height = 1000;
        this.border_width = 100;
    }

    loadFont = () => {
        return new Promise((resolve,reject)=>{
            this.fnt.load(() => {
                resolve();
            })
        })
    }

    setupImage = async(options) => {
        return new Promise( async(resolve,reject)=>{

            if(options.img){
                this.img = options.img
                this.ctx = this.img.getContext('2d');   
            }else{
                this.img = PImage.make(this.width, this.height);
                this.ctx = this.img.getContext('2d');             
            }

            resolve();
        })
    }



    draw = () => {

        let height_pt = 54;
        let height_px = height_pt * 1.3281472327365;

        this.ctx.font = height_pt.toString()+"pt 'Source Sans Pro'";

        this.ctx.strokeStyle = "rgba(250,70,22,1)"
        this.ctx.fillStyle = 'rgba(250,70,22,1)';
        this.ctx.textAlign = 'center'

        // this.ctx.lineWidth = 6;
        this.ctx.fillText('Test', 208, 150 + (height_px / 2));

        // let img2 = PImage.make(694,371);
        // let c = img2.getContext('2d');

        // c.drawImage(this.img,
        //     0, 0, this.img.width, this.img.height, // source dimensions
        //     0, 0, img2.width, img2.height                 // destination dimensions
        // );

        // this.img = img2
    }

}


module.exports = Generator