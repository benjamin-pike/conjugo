type anyObject = {[key: string]: any}

export const exclude = (originalObject: anyObject, excludedKeys: string[]): anyObject => {
    return Object.keys(originalObject).reduce((filteredObject: anyObject, key: string) => {
        
        if (!excludedKeys.includes(key)) {
            filteredObject[key] = originalObject[key]
        }
        
        return filteredObject
    }, {} )
}

export const include = (originalObject: anyObject, includedKeys: string[]): anyObject => {
    return Object.keys(originalObject).reduce((filteredObject: anyObject, key: string) => {
        
        if (includedKeys.includes(key)) {
            filteredObject[key] = originalObject[key]
        }
        
        return filteredObject
    }, {} )
}

export const compare = (object1: anyObject, object2: anyObject): boolean => {

    if (typeof object1 !== 'object' || typeof object2 !== 'object')
        return false

    if (Object.keys(object1).length !== Object.keys(object2).length)
        return false

    return Object.keys(object1).every(key => {
        if (typeof object1[key] !== 'object')
            return object1[key] === object2[key]

        return compare(object1[key], object2[key])
    })
}