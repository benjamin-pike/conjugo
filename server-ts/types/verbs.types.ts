export type Conjugations = {
    [key: string]: {
        [key: string]: {
            [key: string]: {
                [key: string]: string;
            }
        }
    }
}

export interface Translations {
    principal: string;
    weighted: [string, number][]
}

export interface Verb {
    rank: number;
    regularity: string;
    translations: Translations;
    participles: { [key: string]: string }
    conjugations: Conjugations;
}