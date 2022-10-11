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
	}
};
