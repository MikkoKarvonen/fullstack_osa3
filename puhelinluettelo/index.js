require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Number = require('./models/number')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ')
}))
app.use(express.static('build'))

let numbers = [
    {
        id: 1,
        name: 'Timo Testaaja',
        number: '040-1234567'
    },
    {
        id: 2,
        name: 'Maija Meikäläinen',
        number: '040-1122334'
    },
    {
        id: 3,
        name: 'Roope Ankka',
        number: '09-123123'
    },
]

app.get('/info', (req, res) => {
    res.send(`<p>Puhelinluettelossa ${numbers.length} henkilön tiedot</p>` +
        `<p>${new Date()}</p>`)
})

app.get('/api/persons/', (req, res) => {
    Number.find({}).then(result => {
        res.json(result.map(r => r.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res) => {
    Number.findById(req.params.id).then(number => {
        res.json(number.toJSON())
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    numbers = numbers.filter(numbers => numbers.id !== id);

    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    } else if (numbers.find(e => e.name === body.name)) {
        return res.status(400).json({
            error: 'name already added'
        })
    }

    const number = new Number({
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 2000) + 1000,
    })

    number.save().then(savedNumber => {
        res.json(savedNumber.toJSON())
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})