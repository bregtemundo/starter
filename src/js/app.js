import TransitionManager from 'transitions/TransitionManager';
import $ from "jquery";
import { $document, $html, $body, isDebug } from 'utils/environment';
import ScrollManager from 'modules/ScrollManager';

import Navigation from './modules/Navigation'
import Example from './modules/Example';

class App {
  transitionManager;
  scrollManager;

  constructor() {
    // set a global reference to the app
    $window.app = this;

    // start transitionManager if needed
    this._startTransitions();

    this._createModules();

    // load webfonts
    this._startFontLoader();

    // smooth scrolling
    this._startScroll();

    // mobile navigation
    this._startNavigation();
  }

  _createModules(){
    this.example = new Example();
  }

  _startFontLoader (){
    var WebFont = require('webfontloader');
    WebFont.load({
      google: {
        families: ['Roboto:300,400,500,700']
      }
    });
  }

  _startTransitions(){
    const transitionManager = new TransitionManager();
  }

  _startScroll() {
    this.scrollManager = new ScrollManager(true);
  }

  _startNavigation() {
    this.navigation = new Navigation();
  }

}


// IIFE for loading the application
// ==========================================================================
(function() {
  new App();

  $document.trigger({
      type: 'initModules',
      firstBlood: true
  });

})();
