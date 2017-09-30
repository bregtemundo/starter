/* jshint esnext: true */
import { $document, $body, APP_NAME } from '../utils/environment';
import $ from "jquery";
import Flickity from "flickity"
// Get individual components
import { TimelineMax, CSSPlugin, TextPlugin, Linear } from "gsap";

const MODULE_NAME = 'Example';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;

const EVENT = {
  CLICK: `click.${EVENT_NAMESPACE}`
};

export default class Example {
  constructor(options) {

    // listen for new page loads and check if the page is for this module
    // todo destroy if was initiated and not needed on current page
    $document.on('initModules', (event) => {
        if(this.isActive()){
          this.init();
        }
    });
  }

  isActive(){
    //if this is a project detail
    if($body.hasClass('page-node-type-project') || $body.hasClass('path-contact')){
      return true;
    }
    return false;
  }

  init() {
    // Set events
    $('.block-page-title-block').on('click', this.onTitleClick);

    //set functionality
    this.images = new Flickity('.field--type-image');
    this.initScroll();


  }

  destroy() {
    //destroy event listeners
    $('.block-page-title-block').off('click');

    //destroy additional functionality
  }

  initScroll() {
    var ScrollMagic = require('scrollmagic');

    require('debug.addIndicators');
    require('animation.gsap');


    // init controller
    var controller = new ScrollMagic.Controller({addIndicators: true, globalSceneOptions: {offset:'0px'}});

    // build scenes
    new ScrollMagic.Scene({triggerElement: ".page-title", triggerHook: 1, offset: 0, reverse: false})
      .setClassToggle(".page-title", "active")
      //.addIndicators()
      .addTo(controller);

    new ScrollMagic.Scene({triggerElement: ".field--type-image", duration:300, triggerHook: 1, offset: 0})
      .addTo(controller)
      .on("progress", (e) => {
        //scroll progress
        let scrollProgress = e.progress.toFixed(3);
        let totalImages = this.images.cells.length;
        let percentPerImage = 1/totalImages;
        let activeIndex = Math.round(scrollProgress / percentPerImage);

        this.images.select( activeIndex );
      });

      // build tween
      let tween = new TimelineMax()
        .add([
          TweenMax.to(".node__meta", 10, {y: "-40", ease: Linear.easeNone}),
          //TweenMax.to(".node__content", 10, {y: "-10px", ease: Linear.easeNone}),
          TweenMax.to(".block-page-title-block", 10, {y: "-60px", skewY:"-10deg", color:'#ccff00', ease: Linear.easeNone}),
        ]);

      new ScrollMagic.Scene({triggerElement: "article.node--type-project", duration:'100%', triggerHook:1})
          .setTween(tween)
          .addIndicators()
          .addTo(controller);



  }

  onTitleClick(e) {
    console.log("click title");
    TweenMax.to(".field--name-title", 10, {text:{value:"quality, bespoke content", padSpace:true, ease:Linear.easeNone}, ease:Linear.easeNone});
  }
}
