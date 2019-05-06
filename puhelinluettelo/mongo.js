const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0-cbk8n.mongodb.net/puhelinluettelo?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const puhelinluetteloSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: 'Number',
})

const Number = mongoose.model('Number', puhelinluetteloSchema)

if (process.argv.length === 5){
    const number = new Number({
        name: process.argv[3],
        number: process.argv[4],
        id: Math.floor(Math.random() * 2000) + 1000
    })

    number.save().then(response => {
        console.log(`lisätään ${process.argv[3]} numero ${process.argv[3]} luetteloon`);
        mongoose.connection.close();
    })
} else if (process.argv.length === 3){
    console.log('puhelinluettelo:');
    Number.find({}).then(result => {
        result.forEach(number => {
            console.log(`${number.name} ${number.number}`)
        })
        mongoose.connection.close()
    })
}