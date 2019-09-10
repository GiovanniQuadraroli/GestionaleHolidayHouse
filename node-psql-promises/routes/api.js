var express = require("express");
var router = express.Router();

var db = require('../queries');

router.get('/utenti/:id', db.getUser);
router.post('/utenti', db.createUser);
router.get('/utenti', db.getUsers);
router.put('/utenti/:id', db.updateUser);
router.delete('/utenti/:id', db.deleteUser);

module.exports = router;