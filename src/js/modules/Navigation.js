import { $document, $window, $body, $html } from '../utils/environment';
import $ from "jquery";
import "match-media";
import offside from 'offside-js';
import Headroom from "headroom";

// superfish doesn't have an export
// make jquery object available global ,then import
window.jQuery = $;
require("superfish");


export default class Navigation {
  mobileMenu = null;
  desktopMenu = null;


  constructor() {
    if(this.isActive()){
      this.init();
    }

  }

  isActive(){
    // has navigation element
    if($('.menu--main').length){
      return true;
    }
    return false;
  }

  init() {
    // only execute mobile or large navigation on correct size
    // check /src/css/settings/variables for used media queries
    if(matchMedia("(min-width: 1020px)").matches) {
      this.initDesktopNavigation();
    }
    else{
      this.initMobileNavigation();
    }
  }

  initMobileNavigation(){
    // setup mmenu
    // setup mmenu
    this.mobileMenu = offside( ".offcanvas", {
      buttonsSelector: 'mmenu__toggle',
      slidingSide: 'right',

      beforeOpen: function(){
        $('body').removeClass('offside-closing');
        $('body').removeClass('offside-opened');
        $('body').removeClass('offside-opening');
        clearTimeout(this.offsideInt);
        this.offsideInt = setTimeout( () => { $('body').addClass('offside-opened') }, 1 );
      },
      afterOpen: function(){
        this.offsideInt = setTimeout( () => { $('body').addClass('offside-opening') }, 100 );
      },
      beforeClose: function(){
        $('body').removeClass('offside-opened');
        $('body').removeClass('offside-opening');
        $('body').removeClass('offside-closing');
        clearTimeout(this.offsideInt);
        $('body').addClass('offside-closing')
      },
      afterClose: function(){
        this.offsideInt = setTimeout( () => { $('body').removeClass('offside-closing') }, 600 );
      },
    });


    //add the toggle
    $("body").prepend('<a href="#" class="c-mmenu__toggle">menu</a>');
    $('.c-mmenu__toggle').on('click', () => this.openCloseMobileNavigation());
  }

  openCloseMobileNavigation(){
    this.mobileMenu.toggle();
  }

  initDesktopNavigation(){
    /*
     * add superfish with custom css animation
     * when showing menu (ul) we add a sf-opened class to set inital values (eg opacity:0) and show (display block)
     * then add sf-opening that sets end values (eg opacity:1)
     */
    this.desktopMenu = $(".menu--main > .menu").superfish({
      animation: {},
      animationOut: {},
      onBeforeShow: function() {
        this.removeClass('sf-opening');
        this.addClass('sf-opened');
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(
          () => this.addClass("sf-opening"),
          1
        );
        return false;
      },
      onBeforeHide: function() {
        this.removeClass('sf-opening');

        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(
          () => this.removeClass("sf-opened"),
          600 // set this to duration of outro animation
        );

        return false;
      },

    });
    this.desktopMenu.addClass('sf-menu');


    // add headroom.js
    this.headroom = new Headroom( $('header').get(0) );

    // (doesn't work in combination with smooth-scrollbar)
    // overwrite attachEvent and getScrollY when working with smooth-scrollbar
    if($window.app.scrollManager.useSmoothScroll) {
      this.headroom.scroller = $window.app.scrollManager.scrollbar;

      this.headroom.getScrollY = function() {
        return this.scroller.scrollTop;
      }
      this.headroom.attachEvent = function() {
        if(!this.initialised){
          this.lastKnownScrollY = this.getScrollY();
          this.initialised = true;
          this.scroller.addListener(() => {
            this.debouncer.handleEvent();
          });

          this.debouncer.handleEvent();
        }
      }
    }

    // init headroom
    this.headroom.init();
  }

  destroy() {
    //destroy event listeners

    //destroy additional functionality
  }
}
