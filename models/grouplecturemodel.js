/**
 * Created by Iago on 24/01/2015.
 */
var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema(
    {
        name: {type: String, required:true},
		date: {type: Date, required:true},
		professor: {
			username: {type: String, required:true},
			name: String
		},
		numMaxStudents: {type: Number, required:true},
		studentsRegistered: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    }
);

module.exports = mongoose.model("GroupLecture",GroupSchema);
