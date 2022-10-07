"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSpecificToGeneric = exports.mapGenericToSpecific = exports.subjectsGenericConst = exports.subjectsGeneric = exports.subjectsConst = void 0;
const subjects = {
    spanish: ["yo", "tú", "él", "ella", "usted", "nosotros", "vosotros", "ellos", "ellas", "ustedes"],
    french: ["je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles"],
    german: ["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"],
    italian: ["io", "tu", "lei", "lui", "noi", "voi", "loro"],
    portuguese: ["eu", "tu", "ele", "ela", "você", "nós", "vós", "eles", "elas", "vocês"]
};
exports.subjectsConst = {
    spanish: ["yo", "tú", "él", "ella", "usted", "nosotros", "vosotros", "ellos", "ellas", "ustedes"],
    french: ["je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles"],
    german: ["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"],
    italian: ["io", "tu", "lei", "lui", "noi", "voi", "loro"],
    portuguese: ["eu", "tu", "ele", "ela", "você", "nós", "vós", "eles", "elas", "vocês"]
};
exports.subjectsGeneric = ["firstSingular", "secondSingular", "thirdSingular", "firstPlural", "secondPlural", "thirdPlural"];
exports.subjectsGenericConst = ["firstSingular", "secondSingular", "thirdSingular", "firstPlural", "secondPlural", "thirdPlural"];
exports.mapGenericToSpecific = {
    spanish: {
        firstSingular: ["yo"],
        secondSingular: ["tú"],
        thirdSingular: ["él", "ella", "usted"],
        firstPlural: ["nosotros"],
        secondPlural: ["vosotros"],
        thirdPlural: ["ellos", "ellas", "ustedes"]
    },
    french: {
        firstSingular: ["je"],
        secondSingular: ["tu"],
        thirdSingular: ["il", "elle", "on"],
        firstPlural: ["nous"],
        secondPlural: ["vous"],
        thirdPlural: ["ils", "elles"]
    },
    german: {
        firstSingular: ["ich"],
        secondSingular: ["du"],
        thirdSingular: ["er", "sie", "es"],
        firstPlural: ["wir"],
        secondPlural: ["ihr"],
        thirdPlural: ["Sie"]
    },
    italian: {
        firstSingular: ["io"],
        secondSingular: ["tu"],
        thirdSingular: ["lei", "lui"],
        firstPlural: ["noi"],
        secondPlural: ["voi"],
        thirdPlural: ["loro"]
    },
    portuguese: {
        firstSingular: ["eu"],
        secondSingular: ["tu"],
        thirdSingular: ["ele", "ela", "você"],
        firstPlural: ["nós"],
        secondPlural: ["vós"],
        thirdPlural: ["eles", "elas", "vocês"]
    }
};
exports.mapSpecificToGeneric = {
    spanish: {
        yo: "firstSingular",
        tú: "secondSingular",
        él: "thirdSingular",
        ella: "thirdSingular",
        usted: "thirdSingular",
        nosotros: "firstPlural",
        vosotros: "secondPlural",
        ellos: "thirdPlural",
        ellas: "thirdPlural",
        ustedes: "thirdPlural"
    },
    french: {
        je: "firstSingular",
        tu: "secondSingular",
        il: "thirdSingular",
        elle: "thirdSingular",
        on: "thirdSingular",
        nous: "firstPlural",
        vous: "secondPlural",
        ils: "thirdPlural",
        elles: "thirdPlural"
    },
    german: {
        ich: "firstSingular",
        du: "secondSingular",
        er: "thirdSingular",
        sie: "thirdSingular",
        es: "thirdSingular",
        wir: "firstPlural",
        ihr: "secondPlural",
        Sie: "thirdPlural"
    },
    italian: {
        io: "firstSingular",
        tu: "secondSingular",
        lei: "thirdSingular",
        lui: "thirdSingular",
        noi: "firstPlural",
        voi: "secondPlural",
        loro: "thirdPlural"
    },
    portuguese: {
        eu: "firstSingular",
        tu: "secondSingular",
        ele: "thirdSingular",
        ela: "thirdSingular",
        você: "thirdSingular",
        nós: "firstPlural",
        vós: "secondPlural",
        eles: "thirdPlural",
        elas: "thirdPlural",
        voces: "thirdPlural"
    }
};
exports.default = subjects;
