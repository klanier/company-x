class VisDirective {
  constructor (d4) {
    'ngInject';
    let directive = {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<div id="vis"></div>',
      //controller: VisController,
      //controllerAs: 'vm',
      link: linkFunc
    };

    const d3 = window.d3;

    function linkFunc(scope, el, attr, vm){

     let svg = d3.select(el[0]).append('svg')
       .attr('width', 100)
       .attr('height', 100);

     let circle = svg.append('circle')
       .attr('r', 40)
       .attr('cx', 20)
       .attr('cy', 20)
       .attr('fill', 'blue');

    }

    return directive;
  }

}
export default VisDirective;
