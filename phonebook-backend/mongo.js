const mongoose = require('mongoose');

// Get command line arguments
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://notes_user:${password}@cluster0.5us6o.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to the database
mongoose.connect(url);

// Define the Person model
const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema); 
//mongo may change the database name from person to people as convention

// If only the password is given, list all phonebook entries
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });

// If name and number are provided, add a new entry
} else if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        name: name,
        number: number
    });

    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });

// Handle incorrect number of arguments
} else {
    console.log('Please provide the name and number: node mongo.js <password> <name> <number>');
    process.exit(1);
}
