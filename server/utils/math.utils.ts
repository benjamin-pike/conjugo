import { compare } from './object.utils'

export const randomNumber = ( lower: number, upper: number ) => 
    Math.floor( Math.random() * ( upper - lower ) ) + lower

export const randomElement = ( array: any[] ) => 
    array[ randomNumber( 0, array.length ) ]

export const randomElementNotPrevious = ( array: any[], previous: any ) => {
    let element = randomElement(array)

    if (typeof previous !== typeof element)
        return element
    
    if (typeof previous !== 'object' && element === previous) {
        element = randomElementNotPrevious(array, previous)
    }

    if (typeof previous === 'object' && compare(element, previous)) {
        element = randomElementNotPrevious(array, previous)
    }
    
    return element
}

export const randomChance = ( probability: number ) => Math.random() < probability