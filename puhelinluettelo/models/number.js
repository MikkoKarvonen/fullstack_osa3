const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const puhelinluetteloSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true 
    },
    number:  {
        type: String,
        minlength: 7,
        required: true
    },
    id: 'Number',
})
puhelinluetteloSchema.plugin(uniqueValidator, {
    message: '{VALUE} löytyy jo puhelinluettelosta' 
});

puhelinluetteloSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Number', puhelinluetteloSchema)