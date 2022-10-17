export const getXP = level => 
    10 * level * (level - 1)

export const getLevel = xp => 
    Math.floor(( 10 + ( 100 + ( 40 * xp ) ) ** 0.5 ) / 20)