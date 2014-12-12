/**
 * Created by Lurian on 03/12/2014.
 */
var mongoose = require('mongoose');

var SubjectSchema = new mongoose.Schema(
    {
        name: {type: String, required:true, unique: true}
    }
);

SubjectSchema.index({name: 1}, {unique: true});

module.exports = mongoose.model("Subject",SubjectSchema);
