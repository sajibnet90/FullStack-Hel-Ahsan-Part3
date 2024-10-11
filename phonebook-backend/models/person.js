const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI
console.log('connecting to......', url)

mongoose.connect(url).then(() => {
  console.log('connected to MongoDB!')
})
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

//schema person--------------
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'Name is required']
  },
  number: {
    type  : String,
    minlength: [8, 'Phone number must be at least 8 characters long.'],
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        // Regex for valid phone number formats: "DD-DDDDDD" or "DDD-DDDDDDD"
        return /\d{2,3}-\d{6,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number! Format must be DD-DDDDDD or DDD-DDDDDDD`
    }
  }
})

//to remove _id obj and _v
personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = mongoose.model('Person', personSchema)
module.exports = Person