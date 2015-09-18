/* global _:false */
class VisDirective {
  constructor ($interval) {
    'ngInject';

    this.restrict = 'E';
    this.scope =  {
      data: '='
    };
    this.template = '<div id="vis"></div>';
    this.$interval = $interval;
  }

  link(scope, el) {
    const d3 = window.d3;
    const topojson = window.topojson;
    const colors = d3.scale.ordinal().range([
      'rgba(177, 213, 72, 0.4)',
      'rgba(99, 200, 209, 0.4)',
      'rgba(240, 213, 117, 0.4)',
      'rgba(245, 137, 31, 0.4)',
      'rgba(231, 68, 94, 0.4)'
    ]);

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
                .attr('fill', (d, i) => { return colors(i); })
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

}
export default VisDirective;
