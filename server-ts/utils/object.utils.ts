type anyObject = {[key: string]: any}

export const exclude = (originalObject: anyObject, excludedKeys: string[]): anyObject => {
    return Object.keys(originalObject).reduce((filteredObject: anyObject, key: string) => {
        
        if (!excludedKeys.includes(key)) {
            filteredObject[key] = originalObject[key]
        }
        
        return filteredObject
    }, {} )
}