(() => {
  'use strict';
  const app = angular.module('iRestApp');

  app.component('navBarTop', {
    // defines a two way binding in and out of the component
    bindings: {
      brand: '<'
    },
    // Pulls in out template
    templateUrl: 'html/share/components/navbar-top.html',
    controller: function () {
      this.menu = [{
        name: "Home",
        component: "home"
      }, {
        name: "About",
        component: "about"
      }, {
        name: "Contact",
        component: "contact"
      }];
    }
  });
})();
