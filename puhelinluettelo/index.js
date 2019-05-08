require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Number = require('./models/number')

const logger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(logger)
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

app.get('/api/persons/:id', (req, res, next) => {
    Number.findById(req.params.id).then(number => {
        if (number) {
            res.json(number.toJSON())
        } else {
            res.status(204).end()
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Number.findByIdAndRemove(req.params.id)
        .then(r => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
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

    number.save()
        .then(savedNumber => {
            res.json(savedNumber.toJSON())
        })
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Error 400 '+error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})