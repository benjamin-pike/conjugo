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