let util = require( './util.js' );

console.log( 'Start...' );

const MAX_OF_TABLES = 4;

let GLOBAL = {
    
    // Example:
    
    //         +--------------------------------------> Restaurant 0 Table 0
    //         |          +---------------------------> Restaurant 0 Table 1
    //         |          |                   +-------> Restaurant 0 Table 3
    // [       |          |                   |
    //     [ 'Adam',   'Daniel',  'Adam', 'Charles' ], 
    //     [ 'Daniel', 'Charles', 'Adam']
    // ]       |                    |
    //         |                    +-----------------> Restaurant 1 Table 2
    //         +--------------------------------------> Restaurant 1 Table 0
    //
    //
    restaurantsTablesWaitersMap: [],

    // [ [ waiterName, restaurantIndex, tableIndex ], ... ]
    //
    // Example:
    // 
    // [ [ 'Adam',    0,  0 ],
    //   [ 'Adam',    1,  0 ],
    //   [ 'Daniel',  0,  3 ],
    //   [ 'Charles', 0, 19 ],
    //   [ 'Hoden',   1, 19 ] ]
    //
    waitersRestaurantsTablesMap: [],
    
    waiters: [],
    
    getWaiterByName: ( waiterName ) => {
    
        for ( let i = 0; i < GLOBAL.waiters.length; i ++ ) {
            
            let waiter = GLOBAL.waiters[ i ];
            
            if ( waiter.name === waiterName ) {
                
                return waiter
            }
        }
        
        return null;
    },
    
    getWaiterNameAssigned: ( restaurantIndex, tableIndex ) => {
        
        for ( let i = 0;
              i < GLOBAL.waitersRestaurantsTablesMap.length;
              i ++ ) 
        {
            
            let map = GLOBAL.waitersRestaurantsTablesMap[ i ];
            
            if ( map[ 1 ] === restaurantIndex && map[ 2 ] === tableIndex ) {
                
                return map[ 0 ];
            }
        }
        
        return '';

    },
    
    getNamesOfWaiterAvailable: () => {
        
        let waiterNamesAvailable = [];
        
        GLOBAL.waiters.forEach( ( waiter ) => {
            
            if ( waiter.restaurantsTablesAssigned < 4 ) {
                
                waiterNamesAvailable.push( waiter.name );
            }
            
        } );
        
        return waiterNamesAvailable;
    }
    
};

class MaxOfTablesAssignedError extends Error {
    
    constructor() {
        
        super();       
        this.message = `Can only assign ${MAX_OF_TABLES} tables to each waiter.`;
    }
}

class AlreadyAssignedError extends Error {
    
    constructor( waiterName ) {
        
        super();       
        this.message = `This table is already assinged to ${waiterName}.`;
    }
}

class Hotel {
    
    constructor( managerName = 'William',
                 numberOfRestaurants = 2,
                 numberOfTablesEachRestaurant = 20,
                 waiterNames = [ 'Adam', 'Bob', 'Charles', 'Daniel',
                                 'Edward', 'Frank', 'Garry', 'Holden' ] ) 
    {
        
        this.manager = new Manager( managerName );
        GLOBAL.waiters = [];
        
        waiterNames.forEach( ( name ) => {
            
            GLOBAL.waiters.push( new Waiter( name ) );
        } );
        
        for ( let i = 0; i < numberOfRestaurants; i ++ ) {
            
            GLOBAL.restaurantsTablesWaitersMap
                .push( new Array( numberOfTablesEachRestaurant ) );
                
        }
    }
    
    printManagerView() {
        
        console.log( 'Manager View' );
        
        GLOBAL.restaurantsTablesWaitersMap.forEach( ( restaurant, restaurantIndex ) => {
            
            restaurant.forEach( ( tableWithWaiterName, tableIndex ) => {
                
                if ( tableWithWaiterName === undefined ) {
                    
                    return;
                }
                
                let info = `Restaurant ${restaurantIndex} Table ${tableIndex}: ${tableWithWaiterName}`;
                
                console.log( info );
            } );
            
        } );
    }
    
    printWaiterView() {
        
        GLOBAL.waiters.forEach( ( waiter ) => {
            
            let info = `${waiter.name}: `;
            
            waiter.restaurantsTablesAssigned.forEach( ( assignment ) => {
                
                info += `Restaurant ${assignment[0]} Table ${assignment[1]}, `;
                
            } );
            
            console.log( info );
            
        } );
    }
}

class Manager {
    
    constructor( name ) {
        
        this.name = name;
    }
    
    assign( restaurantIndex, tableIndex, waiterName ) {
        
        try {
            
            let waiter = GLOBAL.getWaiterByName( waiterName );
            waiter.getAssigned( restaurantIndex, tableIndex );
            return true;
        }
        catch ( error ) {
            
            console.error( error );
            
            if ( error instanceof MaxOfTablesAssignedError ) {
                
                console.log( 'Waiters available:', GLOBAL.getNamesOfWaiterAvailable() );
            }
        }
        
        return false;
    }
}

class Waiter {
    
    constructor( name ) {
        
        this.name = name;
        
        // e.g [ [ 0, 1 ], [0, 3], [2, 3 ] ] means
        // Restaurant 0 and Table 1, R0 and T3, R2 and T3 are assigned
        this.restaurantsTablesAssigned = [];
        
    }
    
    getAssigned( restaurantIndex, tableIndex ) {
        
        if ( this.isAssigned( restaurantIndex, tableIndex ) === true ) {
            
            throw new AlreadyAssignedError( this.name );
        }
        
        let waiterNameAssigned = 
            GLOBAL.getWaiterNameAssigned( restaurantIndex, tableIndex );

        if (  waiterNameAssigned !== '' ) {
            
            throw new AlreadyAssignedError( waiterNameAssigned );
        }
        
        if ( this.restaurantsTablesAssigned.length >= MAX_OF_TABLES ) {
            
            throw new MaxOfTablesAssignedError();
        }

        let assignment = [ restaurantIndex, tableIndex ];
        this.restaurantsTablesAssigned.push( assignment );
        
        GLOBAL
            .restaurantsTablesWaitersMap[ restaurantIndex ]
                                        [ tableIndex ] = this.name;
        
        GLOBAL
            .waitersRestaurantsTablesMap.push( [ this.name, 
                                                 restaurantIndex, 
                                                 tableIndex ] );

    }
    
    isAssigned( restaurantIndex, tableIndex ) {
        
        let assignment = [ restaurantIndex, tableIndex ];
        
        if ( util.hasEqual( this.restaurantsTablesAssigned, assignment ) === true ) {
            
            return true;
        }
        
        return false;
    }
}

let hotelPwc = new Hotel();

// Debug in Chrome dev tools
window.hotelPwc = hotelPwc;

console.log( 'End...' );