const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config()
const Person = require('./models/person')
const app = express();

//serving the static frontend build
app.use(express.static('dist'))

app.use(express.json());
app.use(cors());

// let persons = [
//     { id: "1", name: "Arto Hellas", number: "040-123456" },
//     { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
//     { id: "3", name: "Dan Abramov", number: "12-43-234345" },
//     { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
// ];

//--------------------------------------------
// Use 'tiny' configuration for logging
//app.use(morgan('tiny'));

// Custom token to log request body in POST requests
morgan.token('post-body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
// Use morgan with a custom format
app.use(morgan(':method :url :status :post-body'))

//-----------without static frontend -----------------------------------

// app.get('/', (req, res) => {
//     const time = new Date();
//     res.send(
//         `<h2>Hello from PhoneBook App</h2>
//          <p>${time}</p>`
//     );
// });

//################ GET all persons #########

// app.get('/api/persons', (req, res) => {
//     res.json(persons);
// });

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons);
    });
  });
  
//############################## GET /info ########

// GET /info
app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
      const time = new Date();
      response.send(
        `<p>Phonebook has info for ${count} people</p>
         <p>${time}</p>`
      );
    });
});

// app.get('/info', (req, res) => {
//     const totalPersons = persons.length;
//     const time = new Date();
//     res.send(
//         `<p>Phonebook has info for ${totalPersons} people</p>
//          <p>${time}</p>`
//     );
// });


//##################### GET by id ###############

app.get('/api/notes/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

// app.get('/api/persons/:id', (req, res) => {
//     const id = req.params.id;
//     const person = persons.find(p => p.id === id);

//     if (person) {
//         res.json(person);
//     } else {
//         res.status(404).send({ error: 'Person not found' });
//     }
// });

//##################### DELETE by id ###################

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const index = persons.findIndex(p => p.id === id);

    if (index !== -1) {
        persons.splice(index, 1);
        res.status(204).end(); // 204 No Content
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
});

//#################### POST to Mongo###############

app.post('/api/persons', (request, response) => {
    const body = request.body;
  
    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'name or number missing' });
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
    });
  
    person.save().then(savedPerson => {
      response.json(savedPerson);
    });
  });


// app.post('/api/persons', (req, res) => {
//     const { name, number } = req.body;

//     if (!name || !number) {
//         return res.status(400).json({ error: 'name or number is missing' });
//     }

//     const personExists = persons.some(p => p.name === name);
//     if (personExists) {
//         return res.status(400).json({ error: 'name must be unique' });
//     }

//     const newPerson = {
//         id: Math.floor(Math.random() * 100000).toString(),
//         name,
//         number
//     };

//     persons = persons.concat(newPerson);
//     res.json(newPerson);
// });


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
