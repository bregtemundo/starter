import { $document, $body, $html } from '../utils/environment';
import $ from "jquery";
import "match-media";
import "jquery.mmenu";
import Headroom from "headroom";

// superfish doesn't have an export
// make jquery object available global ,then import
window.jQuery = $;
require("superfish");


export default class Navigation {
  mobileMenu = null;
  desktopMenu = null;
  scrollbar = null;

  constructor(options) {
    this.scrollbar = options;
    if(this.isActive()){
      this.init();
    }

  }

  isActive(){
    // has navigation element
    if($('#block-starter-main-menu').length){
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
    this.mobileMenu = $("#block-starter-main-menu").mmenu(
      //options
      {
        extensions: [
          "pagedim",
          // "fullscreen"
        ],
        offCanvas: {
          position: "right",
          zposition: "front",
          pageNodetype: "nav",
        },
        navbar: false,
        slidingSubmenus: false, // display submenu below
      }
    ).data('mmenu');


    //add the toggle
    $("body").prepend('<a href="#" class="c-mmenu__toggle">menu</a>');
    $('.c-mmenu__toggle').on('click', () => this.openCloseMobileNavigation());
  }

  openCloseMobileNavigation(){
    if($html.hasClass('mm-opened')){
      this.mobileMenu.close();
      $('.c-mmenu__toggle').removeClass('c-mmenu__toggle--close');
    }
    else{
      this.mobileMenu.open();
      $('.c-mmenu__toggle').addClass('c-mmenu__toggle--close');
    }
  }

  initDesktopNavigation(){
    /*
     * add superfish with custom css animation
     * when showing menu (ul) we add a sf-opened class to set inital values (eg opacity:0) and show (display block)
     * then add sf-opening that sets end values (eg opacity:1)
     */
    this.desktopMenu = $("#block-starter-main-menu > .menu").superfish({
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

    // add headroom.js (doesn't work in combination with smooth-scrollbar)
    this.headroom = new Headroom(
      $('#block-starter-main-menu').get(0),
      {
        scroller: this.scrollbar
      }
    );

    // overwrite attachEvent and getScrollY when working with smooth-scrollbar
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

    // init headroom
    this.headroom.init();
  }

  destroy() {
    //destroy event listeners

    //destroy additional functionality
  }
}