const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(morgan('tiny'))

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
    res.json(numbers)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const number = numbers.find(number => number.id === id)
    number ? res.json(number) : res.status(404).end()
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

    const number = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 2000) + 1000,
    }

    numbers = numbers.concat(number)

    res.json(number)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})