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
  })
  .component('navBarBottom', {
    // defines a two way binding in and out of the component
    bindings: {
      brand: '<'
    },
    // Pulls in out template
    templateUrl: 'html/share/components/navbar-bottom.html',
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
  })
  .component('sideBar', {
    // defines a two way binding in and out of the component
    bindings: {
      brand: '<'
    },
    // Pulls in out template
    templateUrl: 'html/share/components/sidebar.html',
    controller: function () {
      this.menu = [{
        id: "001",
        name: "Overview",
        state: ".Overview"
      }, {
        id: "002",
        name: "Reports",
        state: ".Reports"
      }, {
        id: "003",
        name: "Table&Form",
        state: ".Tables"
      }, {
        id: "004",
        name: "Trees",
        state: ".Trees"
      }, {
        id: "005",
        name: "TablePagination",
        state: ".TablePagination"
      }, {
        id: "006",
        name: "Accordion",
        state: ".Accordion"
      }, {
        id: "007",
        name: "Dropdowns",
        state: ".Dropdowns"
      }, {
        id: "008",
        name: "Breadcrumbs",
        state: ".Breadcrumbs"
      },{
        id: "009",
        name: "XEditable",
        state: ".XEditable"
      }];
    }
  })
  ;
})();
