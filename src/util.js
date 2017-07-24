let _ =  require( 'lodash' );

function hasEqual( array, item ) {
    
    for ( let i = 0; i < array.length; i ++ ) {
        
        if ( _.isEqual( array[ i ], item ) === true ) {
            
            return true;
        }
    }
    
    return false;
}


module.exports = {
    
    hasEqual
};