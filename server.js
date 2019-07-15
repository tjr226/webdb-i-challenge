const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    queryString = req.body;
    db('accounts')
        .limit(queryString.limit)
        .orderBy(queryString.sortby, queryString.sortdir)
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(error => {
            res.status(500).json(error);
        })
})

server.get('/:id', (req, res) => {
    db('accounts').where({ id: req.params.id })
        .first()
        .then(account => {
            if (account) {
                res.status(200).json(account);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        })
        .catch(error => res.status(500).json(error));
})

server.post('/', (req, res) => {
    const account = req.body;
    db('accounts')
        .insert(account, 'id')
        .then(arrayOfIds => {
            const idOfLastInsertion = arrayOfIds[0];
            res.status(201).json(idOfLastInsertion);
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

server.delete('/:id', (req, res) => {
    db('accounts').where({ id: req.params.id }).del()
        .then(count => {
            res.status(200).json({ message: `${count} record(s) deleted` });
        })
        .catch(error => res.status(500).json(error));
})

server.put('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id }).update(req.body)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: `${count} record(s) updated` });
            } else {
                res.status(404).json({ message: 'not found' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        })
})



module.exports = server;