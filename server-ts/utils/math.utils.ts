export const randomNumber = ( lower: number, upper: number ) => 
    Math.floor( Math.random() * ( upper - lower ) ) + lower

export const randomElement = ( array: any[] ) => 
    array[ randomNumber( 0, array.length ) ]

export const randomElementNotPrevious = ( array: any[], previous: any ) => {
    let element = randomElement(array)
    
    if (element === previous) {
        element = randomElementNotPrevious(array, previous)
    }
    
    return element
}
