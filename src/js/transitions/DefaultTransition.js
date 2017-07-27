/* jshint esnext: true */
import $ from "jquery.slim.min.js";
import { $document, $body, $html } from 'utils/environment';
import Barba from 'barba.js';

function DefaultTransition(options) {
    options = options || {};
    const startCallback = (typeof options.startCallback === 'function') ? options.startCallback : function(){};
    const overrideClass = (typeof options.overrideClass === 'string') ? options.overrideClass : '';

    return Barba.BaseTransition.extend({
        start: function() {
            $html
                .removeClass('dom-is-loaded dom-is-animated')
                .addClass(`dom-is-loading ${overrideClass}`);

            startCallback();

            /* Close any overlays */

            setTimeout(() => {
                Promise
                  .all([this.newContainerLoading])
                  .then(this.finish.bind(this));
            }, 1000);
        },
        finish: function() {
            this.done();

            const $el = $(this.newContainer);

            // Get the template name of the new container and set it to the DOM
            $html.attr('data-template', $el.data('template'));
            

            $document.triggerHandler({
                type: 'initModules',
                isBarba: true
            });

            $html
                .addClass('dom-is-loaded')
                .removeClass('dom-is-loading');

            setTimeout(() => {
                $html
                    .removeClass(overrideClass)
                    .addClass('dom-is-animated');
            }, 1000);
        }
    });
}

export default DefaultTransition;
