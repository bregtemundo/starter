import { $document, $body, $html } from '../utils/environment';
import $ from "jquery";
import "match-media";
import "jquery.mmenu";


export default class Navigation {
  mobileMenu = null;
  desktopMenu = null;

  constructor(options) {

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
    // superfish doesn't have an export
    // make jquery object available global ,then import
    window.jQuery = $;
    require("superfish");

    this.desktopMenu = $("#block-starter-main-menu > .menu").superfish();
    this.desktopMenu.addClass('sf-menu');
  }

  destroy() {
    //destroy event listeners

    //destroy additional functionality
  }
}
