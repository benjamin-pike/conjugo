export default (string, threshold) => {
    if (string.length > threshold) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
    
        context.font = '1em Montserrat';
        
        return context.measureText(string).width;
    }

    return 0
}