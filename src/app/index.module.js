/* global malarkey:false, toastr:false, moment:false */
import config from './index.config';

import routerConfig from './index.route';

import runBlock from './index.run';
import MainController from './main/main.controller';
import NavbarDirective from '../app/components/navbar/navbar.directive';
import VisWorld from '../app/components/vis/vis.directive';
import D3Factory from '../app/components/d3/d3.service';
import TopoJsonFactory from '../app/components/topojson/topojson.service';

angular.module('test', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ngMaterial', 'ngMdIcons'])
  .constant('malarkey', malarkey)
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)

  .config(routerConfig)

  .run(runBlock)
  .service('d3', D3Factory)
  .service('topojson', TopoJsonFactory)
  .controller('MainController', MainController)
  .directive('visWorld', ['$interval', 'd3', 'topojson', ($interval, d3, topojson) => new VisWorld($interval, d3, topojson)]);
