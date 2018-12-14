
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/admin',{
	user: 'root',
    pass: 'root'
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connection success！')
	createTable();
});

function createTable(){
	const eventSchema  = new mongoose.Schema({
		thing: { type: 'string', unique: true }
	});

	const Event = mongoose.model('Event', eventSchema );

	Event.find({}, function(arr){
		console.log(arr);
	});
}