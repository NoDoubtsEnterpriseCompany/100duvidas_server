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
		registered: [{ type : String, ref: 'User' }],
		numMaxStudents: {type: Number, required:true}
    }
);

module.exports = mongoose.model("GroupLecture",GroupSchema);
