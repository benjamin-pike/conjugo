const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id:         { type: String, required: true, unique: true },
    username:   { type: String, required: true, unique: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true, unique: false },
    firstName:  { type: String, required: true, unique: false },
    lastName:   { type: String, required: true, unique: false },
    dob:        { type: String, required: true, unique: false },
    token:      { type: String, required: true, unique: false },
    languages:  { type: Object, required: true, unique: false },
    practice:   { type: Object, required: true, unique: false },
    reference:  { type: Object, required: true, unique: false },
    image:      { type: String, required: true, unique: false },
    inception:  { type: Number, required: true, unique: false },
})

const verbSchema = new mongoose.Schema({
    _id: { type: String },
    infinitive: { type: String },
    rank: { type: Number },
    regularity: { type: String },
    conjugations: { type: Object },
    translations: { type: Object },
})

module.exports.userSchema = userSchema
module.exports.verbSchema = verbSchema
module.exports.User = mongoose.model("user", userSchema);
module.exports.Verb = mongoose.model("verb", verbSchema);