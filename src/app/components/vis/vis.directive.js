/* global _:false */
class VisWorld {
  constructor ($interval, d3, topojson) {
    this.restrict = 'E';
    this.scope =  {
      data: '='
    };
    this.template = '<div id="vis"></div>';
    this.$interval = $interval;
    this.d3 = d3;
    this.topojson = topojson;
  }

  compile () {
    return this.link.bind(this);
  }

  link(scope, el) {
    const $interval = this.$interval;
    const d3 = this.d3;
    const topojson = this.topojson;
    const colorList = [
      'rgba(177, 213, 72, 0.4)',
      'rgba(99, 200, 209, 0.4)',
      'rgba(224, 213, 67, 0.5)',
      'rgba(245, 137, 31, 0.4)',
      'rgba(231, 68, 94, 0.4)',
      'rgba(138, 83, 177, 0.4)'
    ];
    const colors = d3.scale.ordinal().range(colorList);

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
            let citiesArr = _.toArray(cities);
            svg.selectAll('circle')
                .data(_.sample(citiesArr, 50))
              .enter().append('circle')
                .attr('id', (d) => {
                  return d.city.replace(/\s/g, '');
                })
                .attr('transform', (d) => {
                  let p = projection([d.lon, d.lat]);
                  return 'translate(' + p[0] + ',' + p[1] + ')';
                })
                .attr('fill', (d, i) => { return colors(i); })
                .attr('r', 0)
              .transition()
                .attr('r', () => {
                  return Math.random() * 10;
                })
                .duration(1000);

            $interval(() => {
              let place = _.sample(citiesArr, 1)[0];
              svg.append('circle')
                  .attr('transform', () => {
                    let p = projection([place.lon, place.lat]);
                    return 'translate(' + p[0] + ',' + p[1] + ')';
                  })
                  .attr('fill', () => {
                    return _.sample(colorList, 1)[0];
                  })
                  .attr('r', 0)
                .transition()
                  .attr('r', 20)
                  .duration(1000)
                .transition()
                  .attr('r', () => {
                    return Math.random() * (10 - 3) + 3;
                  })
                  .duration(1000);

            }, Math.random() * 7000);
          }
        });
      }
    });
  }

}

// TODO: see if necessary for register directive helper
// VisWorld.$inject = ['$interval', 'd3'];

export default VisWorld;
