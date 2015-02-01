/**
 * Created by Iago on 24/01/2015.
 */
var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema(
    {
        name: {type: String, required:true},
		date: {type: Date, required:true},
		price: {type: Number, required: true},
		address: {type: String, required: true},
		description: {type: String, required: false},
		subject: {type: mongoose.Schema.Types.ObjectId, ref: "Subject"},
		professor: {
			username: {type: String, required:true},
			profile: {
				name: String
			}
		},
		numMaxStudents: {type: Number, required:true},
		studentsRegistered: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    }
);

module.exports = mongoose.model("GroupLecture",GroupSchema);
