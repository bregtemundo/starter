/* jshint esnext: true */
import { $document, $html, $window, $body } from '../utils/environment';
import $ from "jquery";

import Scrollbar from 'smooth-scrollbar';


export default class ScrollManager {
  useSmoothScroll;

  constructor(useSmoothScroll=false) {
    this.useSmoothScroll = useSmoothScroll;

    this.init();

    // listen for new page loads and check if the page is for this module
    // todo destroy if was initiated and not needed on current page
    $document.on('initModules', (event) => {
      this.reset(event.keepScroll);
    });
  }



  init() {
    // init smooth scrollbar
    if(this.useSmoothScroll) {
      this.scrollbar = Scrollbar.init($('.scrollable').get(0),{
        overscrollEffect: 'bounce'
      });
    }
    else {
      this.scrollbar = $window;
    }
  }

  reset(keepScroll) {
    // reset scrollPosition
    if(this.useSmoothScroll){
      this.scrollbar.update();
      if(!keepScroll){
        this.scrollbar.setPosition(0,0);
      }
    }
    else{
      if(!keepScroll) {
        this.scrollbar.scrollTop(0);
      }
      //$body.scrollTop(0);
    }
  }

}
