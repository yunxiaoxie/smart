
/**
 * Created by yunxiaoxie.
 */
angular.module('directive')

    .component('navBarTop', {
        // defines a two way binding in and out of the component
        bindings: {
          brand: '<'
        },
        // Pulls in out template
        template: require('../views/components/navbar-top.html'),
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
        template: require('../views/components/navbar-bottom.html'),
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
        template: require('../views/components/sidebar.html'),
        controller: function () {
          this.menu = [{
            id: "001",
            name: "Overview",
            state: "main.overview"
          }, {
            id: "002",
            name: "Reports",
            state: "main.reports"
          }, {
            id: "003",
            name: "Table&Form",
            state: "main.tables"
          }, {
            id: "004",
            name: "Trees",
            state: "main.trees"
          }, {
            id: "005",
            name: "GlobalException",
            state: "main.globalexception"
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
            state: "main.xeditable"
          },{
            id: "010",
            name: "Upload",
            state: "main.upload"
          },{
            id: "011",
            name: "Canvas",
            state: "main.canvas"
          }];
    }
  })