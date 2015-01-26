/**
 * Created by Iago on 24/01/2015.
 */
var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema(
    {
        name: {type: String, required:true},
		date: {type: Date},
		professor: {
			username: String,
			name: String
		},
		registered: [{ type : String, ref: 'User' }]
    }
);

module.exports = mongoose.model("GroupLecture",GroupSchema);
