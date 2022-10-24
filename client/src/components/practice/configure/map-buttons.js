export const buttonsMap = {
	spanish: {
		subjects: [
			"yo",
			"tú",
			"él • ella • usted",
			"nosotros",
			"vosotros",
			"ellos • ellas • ustedes"
		],
		tenses: [
			[
				{
					text: "indicative",
					id: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
				{
					text: "present",
					id: "indicative-present",
					mood: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
				{
					text: "preterite",
					id: "indicative-preterite",
					mood: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
				{
					text: "imperfect",
					id: "indicative-imperfect",
					mood: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
				{
					text: "future",
					id: "indicative-future",
					mood: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
				{
					text: "conditional",
					id: "indicative-conditional",
					mood: "indicative",
					complexities: ["simple", "compound", "progressive"]
				}
			],
			[
				{
					text: "subjunctive",
					id: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "present",
					id: "subjunctive-present",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "imperfect",
					id: "subjunctive-imperfect",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "future",
					id: "subjunctive-future",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				}
			],
			[
				{
					text: "imperative",
					id: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular"]
				},
				{
					text: "affirmative",
					id: "imperative-affirmative",
					mood: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular"]
				},
				{
					text: "negative",
					id: "imperative-negative",
					mood: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular"]
				},
				{
					text: "simple",
					id: "simple"
				},
				{
					text: "compound",
					id: "compound"
				},
				{
					text: "progressive",
					id: "progressive"
				}
			]
		]
	},
    french: {
        subjects: [
            "je",
            "tu",
            "il • elle • on",
            "nous",
            "vous",
            "ils • elles"
        ],
        tenses: [
            [
                {
					text: "indicative",
					id: "indicative",
					complexities: ["simple", "compound"]
				},
				{
					text: "present",
					id: "indicative-present",
					mood: "indicative",
					complexities: ["simple", "compound"]
				},
				{
					text: "preterite",
					id: "indicative-preterite",
					mood: "indicative",
					complexities: ["simple", "compound"]
				},
				{
					text: "imperfect",
					id: "indicative-imperfect",
					mood: "indicative",
					complexities: ["simple", "compound"]
				},
				{
					text: "future",
					id: "indicative-future",
					mood: "indicative",
					complexities: ["simple", "compound"]
				}
            ],
            [
                {
					text: "subjunctive",
					id: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "present",
					id: "subjunctive-present",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "imperfect",
					id: "subjunctive-imperfect",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
                {
					text: "conditional",
					id: "conditional-conditional",
					complexities: ["simple", "compound"],
                    isolate: true
				}
            ],
            [
                {
					text: "imperative",
					id: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular", "thirdSingular", "thirdPlural"]
				},
				{
					text: "affirmative",
					id: "imperative-affirmative",
					mood: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular", "thirdSingular", "thirdPlural"]
				},
				{
					text: "negative",
					id: "imperative-negative",
					mood: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular", "thirdSingular", "thirdPlural"]
				},
				{
					text: "simple",
					id: "simple"
				},
				{
					text: "compound",
					id: "compound"
				}
            ],

        ]
    },
    german: {
        subjects: [
            "ich",
            "du",
            "er • sie • es",
            "wir",
            "ihr",
            "Sie"
        ],
        tenses: [
            [
                {
					text: "indicative",
					id: "indicative",
					complexities: ["simple", "compound"]
				},
				{
					text: "present",
					id: "indicative-present",
					mood: "indicative",
					complexities: ["simple", "compound"]
				},
				{
					text: "imperfect",
					id: "indicative-imperfect",
					mood: "indicative",
					complexities: ["simple", "compound"]
				},
				{
					text: "future",
					id: "indicative-future",
					mood: "indicative",
					complexities: ["simple", "compound"]
				}
            ],
            [
                {
					text: "subjunctive",
					id: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "present",
					id: "subjunctive-present",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "past",
					id: "subjunctive-imperfect",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
                {
					text: "future",
					id: "subjunctive-future",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "conditional",
					id: "subjunctive-conditional",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
            ],
            [
                {
					text: "imperative",
					id: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular", "thirdSingular"]
				},
				{
					text: "affirmative",
					id: "imperative-affirmative",
					mood: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular", "thirdSingular"]
				},
				{
					text: "negative",
					id: "imperative-negative",
					mood: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular", "thirdSingular"]
				},
				{
					text: "simple",
					id: "simple"
				},
				{
					text: "compound",
					id: "compound"
				}
            ],

        ]
    },
    italian: {
		subjects: [
			"io",
			"tu",
			"lei • lui",
			"noi",
			"voi",
			"loro"
		],
		tenses: [
			[
				{
					text: "indicative",
					id: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
				{
					text: "present",
					id: "indicative-present",
					mood: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
				{
					text: "preterite",
					id: "indicative-preterite",
					mood: "indicative",
					complexities: ["simple", "compound"]
				},
				{
					text: "imperfect",
					id: "indicative-imperfect",
					mood: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
				{
					text: "future",
					id: "indicative-future",
					mood: "indicative",
					complexities: ["simple", "compound"]
				}
			],
			[
				{
					text: "subjunctive",
					id: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "present",
					id: "subjunctive-present",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "imperfect",
					id: "subjunctive-imperfect",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "conditional",
					id: "conditional-conditional",
					complexities: ["simple", "compound"],
                    isolate: true
				}
			],
			[
				{
					text: "imperative",
					id: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular"]
				},
				{
					text: "affirmative",
					id: "imperative-affirmative",
					mood: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular"]
				},
				{
					text: "negative",
					id: "imperative-negative",
					mood: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular"]
				},
				{
					text: "simple",
					id: "simple"
				},
				{
					text: "compound",
					id: "compound"
				},
				{
					text: "progressive",
					id: "progressive"
				}
			]
		]
	},
    portuguese: {
		subjects: [
			"eu",
			"tu",
			"ele • ela • você",
			"nós",
			"vós",
			"eles • elas • vocês"
		],
		tenses: [
			[
				{
					text: "indicative",
					id: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
				{
					text: "present",
					id: "indicative-present",
					mood: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
				{
					text: "preterite",
					id: "indicative-preterite",
					mood: "indicative",
					complexities: ["simple", "progressive"]
				},
				{
					text: "imperfect",
					id: "indicative-imperfect",
					mood: "indicative",
					complexities: ["simple", "compound", "progressive"]
				},
                {
                    text: "pluperfect",
                    id: "indicative-pluperfect",
                    mood: "indicative",
                    complexities: ["simple"]
                },
				{
					text: "future",
					id: "indicative-future",
					mood: "indicative",
					complexities: ["simple", "compound", "progressive"]
				}
			],
			[
				{
					text: "subjunctive",
					id: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "present",
					id: "subjunctive-present",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "imperfect",
					id: "subjunctive-imperfect",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
				{
					text: "future",
					id: "subjunctive-future",
					mood: "subjunctive",
					complexities: ["simple", "compound"]
				},
                {
					text: "conditional",
					id: "conditional-conditional",
					complexities: ["simple", "compound", "progressive"],
                    isolate: true
				}
			],
			[
				{
					text: "imperative",
					id: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular"]
				},
				{
					text: "affirmative",
					id: "imperative-affirmative",
					mood: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular"]
				},
				{
					text: "negative",
					id: "imperative-negative",
					mood: "imperative",
					complexities: ["simple"],
					excludedSubjects: ["firstSingular"]
				},
				{
					text: "simple",
					id: "simple"
				},
				{
					text: "compound",
					id: "compound"
				},
				{
					text: "progressive",
					id: "progressive"
				}
			]
		]
	}
};
