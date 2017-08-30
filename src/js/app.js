import TransitionManager from 'transitions/TransitionManager';
import $ from "jquery";
import { $document, $html, $body, isDebug } from 'utils/environment';
import Scrollbar from 'smooth-scrollbar';

import Navigation from './modules/Navigation'
import Example from './modules/Example';

class App {
  transitionManager;

  constructor() {
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
    this.scrollbar = Scrollbar.init($body[0]);
  }

  _startNavigation() {
    this.navigation = new Navigation(this.scrollbar);
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
