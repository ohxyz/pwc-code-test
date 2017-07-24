
let util = require( './util.js' );

console.log( 'START: Unit test...' );

let a = [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ];

let b = [ 1, 2 ];

let c = [ 3, 4 ];

let d = [ 4, 3 ];

console.log( true, util.hasEqual( a, b ) );
console.log( true, util.hasEqual( a, c ) );
console.log( false, util.hasEqual( a, d ) );


console.log( 'END: Unit test...' );