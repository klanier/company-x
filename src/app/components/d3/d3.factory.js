class D3Factory {
  constructor () {
    'ngInject';

    this.d3 = window.d3;
    console.log(this.d3, 'd3');
    return this.d3;
  }
}
export default D3Factory;
