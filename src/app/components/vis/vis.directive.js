class VisDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<div id="vis"></div>',
      link: linkFunc
    };

    const d3 = window.d3;
    const topojson = window.topojson;

    function linkFunc(scope, el, attr, vm) {
      // Decrease width and height to allow for margin around svg
      let width = angular.element('#vis')[0].clientWidth - 150;
      let height = width / 2;

      let svg = d3.select('#vis').append('svg')
        .attr('width', width)
        .attr('height', height);

      let projection = d3.geo.equirectangular()
        .scale(153)
        .translate([(width / 2), ((height / 2))])
        .precision(0.1);

      let path = d3.geo.path()
        .projection(projection);

      let graticule = d3.geo.graticule();

      svg.append('path')
        .datum(graticule)
        .attr('class', 'graticule')
        .attr('d', path);

      d3.json('/assets/data/world-50m.json', function(error, world) {
        if (!error) {
          svg.insert('path', '.graticule')
            .datum(topojson.feature(world, world.objects.land))
            .attr('class', 'land')
            .attr('fill', '#eeeeee')
            .attr('d', path);
        }
      });

    }

    return directive;
  }

}
export default VisDirective;
