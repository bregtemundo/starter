/* todo
-clean up code
-exlude drupal/wordpress/external links from barba
-hoe integratie marketing js (google tag manager)
*/
import $ from "jquery.slim.min.js";
import { $document, $html, $body, isDebug } from 'utils/environment';
import Barba from 'barba.js';
import DefaultTransition from 'transitions/DefaultTransition';

export default class TransitionManager {
  clickedLink = undefined;
  transition = '';

  constructor() {
    // jQuery ondomready
    $(() => {
      this.onLoad()
    });

    // Define different page transitions
    Barba.Pjax.getTransition = this.onGetTransition;

    // prevent smooth transitions on admin things
    Barba.Pjax.originalPreventCheck = Barba.Pjax.preventCheck;
    Barba.Pjax.preventCheck = this.onPreventCheck;

    // add event listeners to barba.js
    Barba.Dispatcher.on('linkClicked', this.onLinkClicked);
    Barba.Dispatcher.on('newPageReady', this.onNewPageReady);

    // set barba conainers
    Barba.Pjax.Dom.containerClass = 'js-barba-container';
    Barba.Pjax.Dom.wrapperId = 'js-barba-wrapper';

    //start barba.js    
    Barba.Pjax.start();
    
  }

  onPreventCheck(event, element) {           
    // do original check
    if (!Barba.Pjax.originalPreventCheck(event, element)) {
      return false;     
    }

    // exclude drupal and wordpress admin links
    let exclude_paths = [
      'admin\/',
      'devel\/',
      '\/add',
      '\/edit',
      '\/logout',
      'wpadmin',
    ];    
    
    let exclude_re = new RegExp(exclude_paths.join("|"), "i");
    if( exclude_re.test(element.href.toLowerCase()) ){      
      return false;
    }          

    return true;
    

  }

  // get the transition for barba.js
  onGetTransition() {
    this.transition = (this.clickedLink instanceof Node) ? this.clickedLink.getAttribute('data-transition') : (typeof transition === 'string' ? transition : '');

    let TransitionObject;      
    TransitionObject = DefaultTransition();
    
    this.clickedLink = undefined;
    this.transition = '';

    return TransitionObject;
  }

  // link clicked
  onLinkClicked(HTMLElement, MouseEvent) {        
    this.clickedLink = HTMLElement;
  }

  // new page is ready
  onNewPageReady(currentStatus, prevStatus, container, currentHTML) {
    // Fetch any inline script elements.
    const scripts = container.querySelectorAll('script.js-inline');

    if (scripts instanceof window.NodeList) {
      let i = 0;
      let len = scripts.length;
      for (; i < len; i++) {
        eval(scripts[i].innerHTML);
      }
    }

    // transfer body classes
    let response = currentHTML.replace(/(<\/?)body( .+?)?>/gi, '$1notbody$2>', currentHTML)
    let bodyClasses = $(response).filter('notbody').attr('class')
    $body.attr('class', bodyClasses);

    /**
     * Execute any third party features.
     */

    // Google Analytics
    if (window.ga && !isDebug) {
      ga('send', 'pageview');
    }
  }

  /**
   * DOM is loaded  
   */
  onLoad() {
    $html.addClass('dom-is-loaded');
    $html.removeClass('dom-is-loading');
    setTimeout(() => {
      $html.addClass('dom-is-animated');
    }, 1000)
  }

    
}
