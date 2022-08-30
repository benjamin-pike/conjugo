const buttonsData = {
    spanish: 
        {
            subjects:[
                {
                    text:"all",
                    genericId:"all",
                    specificId:"all",
                    position:"",
                    divider: true
                },
                {
                    text:"yo",
                    genericId:"firstSingular",
                    specificId:"yo",
                    position:"",
                    divider: false
                },
                {
                    text:"tú",
                    genericId:"secondSingular",
                    specificId:"tú",
                    position:"",
                    divider: false
                },
                {
                    text:"él • ella • usted",
                    genericId:"thirdSingular",
                    specificId:"él_ella_usted",
                    position:"",
                    divider: false
                },
                {
                    text:"nosotros",
                    genericId:"firstPlural",
                    specificId:"nosotros",
                    position:"",
                    divider: false
                },
                {
                    text:"vosotros",
                    genericId:"secondPlural",
                    specificId:"vosotros",
                    position:"",
                    divider: false
                },
                {
                    text:"ellos • ellas • ustedes",
                    genericId:"thirdPlural",
                    specificId:"ellos_ellas_ustedes",
                    position:"right-end",
                    divider: false
                }
            ],
            
            tenses:[
                {
                    text:"indicative",
                    id:"indicative-master",
                    family:"indicative",
                    tier:2,
                    exclusions:{subjects: [], tenses: []},
                    position:"left-end",
                    row:1,
                    divider: true
                },
                {
                    text:"present",
                    id:"indicative-present",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"preterite",
                    id:"indicative-preterite",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"imperfect",
                    id:"indicative-imperfect",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"future",
                    id:"indicative-future",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"conditional",
                    id:"indicative-conditional",
                    family:"indicative",
                    tier: 1,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:1,
                    divider: false
                },
                {
                    text:"subjunctive",
                    id:"subjunctive-master",
                    family:"subjunctive",
                    tier:2,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"left-end",
                    row:2,
                    divider: true
                },
                {
                    text:"present",
                    id:"subjunctive-present",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"",
                    row:2,
                    divider: false
                },
                {
                    text:"imperfect",
                    id:"subjunctive-imperfect",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"",
                    row:2,
                    divider: false
                },
                {
                    text:"future",
                    id:"subjunctive-future",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"right-end",
                    row:2,
                    divider: false
                },
                {
                    text:"imperative",
                    id:"imperative-master",
                    family:"imperative",
                    tier:2,
                    exclusions:{subjects: ["firstSingular"], tenses: ["compound", "progressive"]},
                    position:"left-end",
                    row:3,
                    divider: true
                },
                {
                    text:"affirmative",
                    id:"imperative-affirmative",
                    family:"imperative",
                    tier:1,
                    exclusions:{subjects: ["firstSingular"], tenses: ["compound", "progressive"]},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"negative",
                    id:"imperative-negative",
                    family:"imperative",
                    tier:1,
                    exclusions:{subjects: ["firstSingular"], tenses: ["compound", "progressive"]},
                    position:"",
                    row:3,
                    divider: true
                },
                {
                    text:"simple",
                    id:"simple",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"perfect",
                    id:"compound",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"progressive",
                    id:"progressive",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:3,
                    divider: false
                }
            ]
    },

    french: 
        {
            subjects:[
                {
                    text:"all",
                    genericId:"all",
                    specificId:"all",
                    position:"",
                    divider: true
                },
                {
                    text:"je",
                    genericId:"firstSingular",
                    specificId:"je",
                    position:"",
                    divider: false
                },
                {
                    text:"tu",
                    genericId:"secondSingular",
                    specificId:"tu",
                    position:"",
                    divider: false
                },
                {
                    text:"il • elle • on",
                    genericId:"thirdSingular",
                    specificId:"il_elle_on",
                    position:"",
                    divider: false
                },
                {
                    text:"nous",
                    genericId:"firstPlural",
                    specificId:"nous",
                    position:"",
                    divider: false
                },
                {
                    text:"vous",
                    genericId:"secondPlural",
                    specificId:"vous",
                    position:"",
                    divider: false
                },
                {
                    text:"ils • elles",
                    genericId:"thirdPlural",
                    specificId:"ils_elles",
                    position:"right-end",
                    divider: false
                }
            ],
            
            tenses:[
                {
                    text:"indicative",
                    id:"indicative-master",
                    family:"indicative",
                    tier:2,
                    exclusions:{subjects: [], tenses: []},
                    position:"left-end",
                    row:1,
                    divider: true
                },
                {
                    text:"present",
                    id:"indicative-present",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"preterite",
                    id:"indicative-preterite",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"imperfect",
                    id:"indicative-imperfect",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"future",
                    id:"indicative-future",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:1,
                    divider: false
                },
                {
                    text:"subjunctive",
                    id:"subjunctive-master",
                    family:"subjunctive",
                    tier:2,
                    exclusions:{subjects: [], tenses: []},
                    position:"left-end",
                    row:2,
                    divider: true
                },
                {
                    text:"present",
                    id:"subjunctive-present",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:2,
                    divider: false
                },
                {
                    text:"imperfect",
                    id:"subjunctive-imperfect",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:2,
                    divider: true
                },
                {
                    text:"conditional",
                    id:"conditional-conditional",
                    family:"conditional",
                    tier: 1,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:2,
                    divider: false
                },
                {
                    text:"imperative",
                    id:"imperative-master",
                    family:"imperative",
                    tier:2,
                    exclusions:{subjects: ["firstSingular", "thirdSingular", "thirdPlural"], tenses: ["compound"]},
                    position:"left-end",
                    row:3,
                    divider: true
                },
                {
                    text:"affirmative",
                    id:"imperative-affirmative",
                    family:"imperative",
                    tier:1,
                    exclusions:{subjects: ["firstSingular", "thirdSingular", "thirdPlural"], tenses: ["compound"]},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"negative",
                    id:"imperative-negative",
                    family:"imperative",
                    tier:1,
                    exclusions:{subjects: ["firstSingular", "thirdSingular", "thirdPlural"], tenses: ["compound"]},
                    position:"",
                    row:3,
                    divider: true
                },
                {
                    text:"simple",
                    id:"simple",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"perfect",
                    id:"compound",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:3,
                    divider: false
                }
            ]
    },

    italian: 
        {
            subjects:[
                {
                    text:"all",
                    genericId:"all",
                    specificId:"all",
                    position:"",
                    divider: true
                },
                {
                    text:"io",
                    genericId:"firstSingular",
                    specificId:"io",
                    position:"",
                    divider: false
                },
                {
                    text:"tu",
                    genericId:"secondSingular",
                    specificId:"tu",
                    position:"",
                    divider: false
                },
                {
                    text:"lei • lui",
                    genericId:"thirdSingular",
                    specificId:"lei_lui",
                    position:"",
                    divider: false
                },
                {
                    text:"noi",
                    genericId:"firstPlural",
                    specificId:"noi",
                    position:"",
                    divider: false
                },
                {
                    text:"voi",
                    genericId:"secondPlural",
                    specificId:"voi",
                    position:"",
                    divider: false
                },
                {
                    text:"loro",
                    genericId:"thirdPlural",
                    specificId:"loro",
                    position:"right-end",
                    divider: false
                }
            ],
            
            tenses:[
                {
                    text:"indicative",
                    id:"indicative-master",
                    family:"indicative",
                    tier:2,
                    exclusions:{subjects: [], tenses: []},
                    position:"left-end",
                    row:1,
                    divider: true
                },
                {
                    text:"present",
                    id:"indicative-present",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"preterite",
                    id:"indicative-preterite",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"imperfect",
                    id:"indicative-imperfect",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"future",
                    id:"indicative-future",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"right-end",
                    row:1,
                    divider: false
                },
                {
                    text:"subjunctive",
                    id:"subjunctive-master",
                    family:"subjunctive",
                    tier:2,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"left-end",
                    row:2,
                    divider: true
                },
                {
                    text:"present",
                    id:"subjunctive-present",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"",
                    row:2,
                    divider: false
                },
                {
                    text:"imperfect",
                    id:"subjunctive-imperfect",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"",
                    row:2,
                    divider: true
                },
                {
                    text:"conditional",
                    id:"conditional-conditional",
                    family:"conditional",
                    tier: 1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"right-end",
                    row:2,
                    divider: false
                },
                {
                    text:"imperative",
                    id:"imperative-master",
                    family:"imperative",
                    tier:2,
                    exclusions:{subjects: ["firstSingular"], tenses: ["compound", "progressive"]},
                    position:"left-end",
                    row:3,
                    divider: true
                },
                {
                    text:"affirmative",
                    id:"imperative-affirmative",
                    family:"imperative",
                    tier:1,
                    exclusions:{subjects: ["firstSingular"], tenses: ["compound", "progressive"]},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"negative",
                    id:"imperative-negative",
                    family:"imperative",
                    tier:1,
                    exclusions:{subjects: ["firstSingular"], tenses: ["compound", "progressive"]},
                    position:"",
                    row:3,
                    divider: true
                },
                {
                    text:"simple",
                    id:"simple",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"perfect",
                    id:"compound",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"progressive",
                    id:"progressive",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:3,
                    divider: false
                }
            ]
        },
    
    german: 
        {
            subjects:[
                {
                    text:"all",
                    genericId:"all",
                    specificId:"all",
                    position:"",
                    divider: true
                },
                {
                    text:"ich",
                    genericId:"firstSingular",
                    specificId:"ich",
                    position:"",
                    divider: false
                },
                {
                    text:"du",
                    genericId:"secondSingular",
                    specificId:"du",
                    position:"",
                    divider: false
                },
                {
                    text:"er • sie • es",
                    genericId:"thirdSingular",
                    specificId:"er_sie_es",
                    position:"",
                    divider: false
                },
                {
                    text:"wir",
                    genericId:"firstPlural",
                    specificId:"wir",
                    position:"",
                    divider: false
                },
                {
                    text:"ihr",
                    genericId:"secondPlural",
                    specificId:"ihr",
                    position:"",
                    divider: false
                },
                {
                    text:"Sie",
                    genericId:"thirdPlural",
                    specificId:"Sie",
                    position:"right-end",
                    divider: false
                }
            ],
            
            tenses:[
                {
                    text:"indicative",
                    id:"indicative-master",
                    family:"indicative",
                    tier:2,
                    exclusions:{subjects: [], tenses: []},
                    position:"left-end",
                    row:1,
                    divider: true
                },
                {
                    text:"present",
                    id:"indicative-present",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"past",
                    id:"indicative-imperfect",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"future",
                    id:"indicative-future",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:1,
                    divider: false
                },
                {
                    text:"subjunctive",
                    id:"subjunctive-master",
                    family:"subjunctive",
                    tier:2,
                    exclusions:{subjects: [], tenses: []},
                    position:"left-end",
                    row:2,
                    divider: true
                },
                {
                    text:"present",
                    id:"subjunctive-present",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:2,
                    divider: false
                },
                {
                    text:"past",
                    id:"subjunctive-imperfect",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:2,
                    divider: false
                },
                {
                    text:"future",
                    id:"subjunctive-future",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:2,
                    divider: false
                },
                {
                    text:"conditional",
                    id:"subjunctive-conditional",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:2,
                    divider: false
                },
                {
                    text:"imperative",
                    id:"imperative-master",
                    family:"imperative",
                    tier:2,
                    exclusions:{subjects: ["firstSingular", "thirdSingular"], tenses: ["compound"]},
                    position:"left-end",
                    row:3,
                    divider: true
                },
                {
                    text:"affirmative",
                    id:"imperative-affirmative",
                    family:"imperative",
                    tier:1,
                    exclusions:{subjects: ["firstSingular", "thirdSingular"], tenses: ["compound"]},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"negative",
                    id:"imperative-negative",
                    family:"imperative",
                    tier:1,
                    exclusions:{subjects: ["firstSingular", "thirdSingular"], tenses: ["compound"]},
                    position:"",
                    row:3,
                    divider: true
                },
                {
                    text:"simple",
                    id:"simple",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"perfect",
                    id:"compound",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:3,
                    divider: false
                }
            ]
        },

    portuguese: 
        {
            subjects:[
                {
                    text:"all",
                    genericId:"all",
                    specificId:"all",
                    position:"",
                    divider: true
                },
                {
                    text:"eu",
                    genericId:"firstSingular",
                    specificId:"eu",
                    position:"",
                    divider: false
                },
                {
                    text:"tu",
                    genericId:"secondSingular",
                    specificId:"tu",
                    position:"",
                    divider: false
                },
                {
                    text:"ele • ela • você",
                    genericId:"thirdSingular",
                    specificId:"ele_ela_você",
                    position:"",
                    divider: false
                },
                {
                    text:"nós",
                    genericId:"firstPlural",
                    specificId:"nós",
                    position:"",
                    divider: false
                },
                {
                    text:"vós",
                    genericId:"secondPlural",
                    specificId:"vós",
                    position:"",
                    divider: false
                },
                {
                    text:"eles • elas • vocês",
                    genericId:"thirdPlural",
                    specificId:"eles_elas_vocês",
                    position:"right-end",
                    divider: false
                }
            ],
            
            tenses:[
                {
                    text:"indicative",
                    id:"indicative-master",
                    family:"indicative",
                    tier:2,
                    exclusions:{subjects: [], tenses: []},
                    position:"left-end",
                    row:1,
                    divider: true
                },
                {
                    text:"present",
                    id:"indicative-present",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"preterite",
                    id:"indicative-preterite",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["compound"]},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"imperfect",
                    id:"indicative-imperfect",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"pluperfect",
                    id:"indicative-pluperfect",
                    family:"indicative",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["compound", "progressive"]},
                    position:"",
                    row:1,
                    divider: false
                },
                {
                    text:"future",
                    id:"indicative-future",
                    family:"indicative",
                    tier: 1,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:1,
                    divider: false
                },
                {
                    text:"subjunctive",
                    id:"subjunctive-master",
                    family:"subjunctive",
                    tier:2,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"left-end",
                    row:2,
                    divider: true
                },
                {
                    text:"present",
                    id:"subjunctive-present",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"",
                    row:2,
                    divider: false
                },
                {
                    text:"imperfect",
                    id:"subjunctive-imperfect",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"",
                    row:2,
                    divider: false
                },
                {
                    text:"future",
                    id:"subjunctive-future",
                    family:"subjunctive",
                    tier:1,
                    exclusions:{subjects: [], tenses: ["progressive"]},
                    position:"",
                    row:2,
                    divider: true
                },
                {
                    text:"conditional",
                    id:"conditional-conditional",
                    family:"conditional",
                    tier:1,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:2,
                    divider: false
                },
                {
                    text:"imperative",
                    id:"imperative-master",
                    family:"imperative",
                    tier:2,
                    exclusions:{subjects: ["firstSingular"], tenses: ["compound", "progressive"]},
                    position:"left-end",
                    row:3,
                    divider: true
                },
                {
                    text:"affirmative",
                    id:"imperative-affirmative",
                    family:"imperative",
                    tier:1,
                    exclusions:{subjects: ["firstSingular"], tenses: ["compound", "progressive"]},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"negative",
                    id:"imperative-negative",
                    family:"imperative",
                    tier:1,
                    exclusions:{subjects: ["firstSingular"], tenses: ["compound", "progressive"]},
                    position:"",
                    row:3,
                    divider: true
                },
                {
                    text:"simple",
                    id:"simple",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"perfect",
                    id:"compound",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"",
                    row:3,
                    divider: false
                },
                {
                    text:"progressive",
                    id:"progressive",
                    family:"complexity",
                    tier:3,
                    exclusions:{subjects: [], tenses: []},
                    position:"right-end",
                    row:3,
                    divider: false
                }
            ]
    }
}

export default buttonsData;