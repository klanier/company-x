/* global _:false */
class VisDirective {
  constructor ($interval) {
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
      let width = angular.element('#vis')[0].clientWidth - 175,
          height = (width / 2);

      let svg = d3.select('#vis').append('svg')
        .attr('width', width)
        .attr('height', height);

      let projection = d3.geo.equirectangular()
        .scale(width * 0.159)
        .translate([(width / 2), (height / 2)])
        .precision(0.1);

      let path = d3.geo.path()
        .projection(projection);

      let graticule = d3.geo.graticule();

      d3.json('/assets/data/world-50m.json', (error, world) => {
        if (!error) {
          svg.insert('path', '.graticule')
            .datum(topojson.feature(world, world.objects.land))
            .attr('class', 'land')
            .attr('fill', '#eeeeee')
            .attr('d', path);

          d3.json('/assets/data/major-cities.json', (error, cities) => {
            if (!error) {
              svg.selectAll('circle')
                  .data(_.sample(_.toArray(cities), 50))
                .enter().append('circle')
                  .attr('transform', (d) => {
                    let p = projection([d.lon, d.lat]);
                    return 'translate(' + p[0] + ',' + p[1] + ')';
                  })
                  .attr('fill', 'rgba(15, 147, 67, 0.4)')
                  .attr('r', 0)
                .transition()
                  .attr('r', (d) => {
                    return Math.random() * 10;
                  })
                  .duration(1000);
            }
          });
        }
      });

    }

    return directive;
  }

}
export default VisDirective;
