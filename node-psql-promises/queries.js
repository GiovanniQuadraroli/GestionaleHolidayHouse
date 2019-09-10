
var promise = require('bluebird');

var options = {
    promiseLib : promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:postgres@localhost:5432/Gestionale';
var db = pgp(connectionString);

const str = (col) => {
    return {
        name : col,
        skip : c => c.value === null || c.value === undefined
    };
};

const int = (col) => {
    return {
        name : col,
        skip : c => c.value === null || c.value === undefined,
        init : c => +c.value
    }
}

const csGeneric = new pgp.helpers.ColumnSet([
    str('nome'), str('cognome'), str('username'), str('mail'), str('password'),int('id')], {table: 'Proprietario'});

const getUsers = (req,res,next) => {
    db.any('select * from Proprietario')
    .then((data) => {
        res.status(200)
        .json({
            status: 'success',
            data : data,
            message : "Selezionati tutti gli utenti"
        });
    }).catch((err) => {
        return next(err);
    });
}

const getUser = (req,res,next) => {
    var userId = parseInt(req.params.id);
    db.any('select * from Proprietario where id = $1', userId)
    .then((data) => {
        res.status(200)
        .json({
            status: 'success',
            data : data,
            message : "Selezionato l'utente:" + userId
        });
    }).catch((err) => {
        return next(err);
    });
};

const updateUser = (req,res,next) => {

    var update = pgp.helpers.update(req.body, csGeneric) + 'where id = ' + parseInt(req.params.id);
    update = update.replace("\"Proprietario\"","Proprietario");
    
    db.none(update)
    .then(
        () => {res.status(200).json({
            status: 'success',
            messagge : 'Utente aggiornat0'
            });
    }).catch((err) => next(err));
};

const deleteUser = (req,res,next) => {
    var userId = parseInt(req.params.id);
    db.result('delete from Proprietario where id = $1', userId)
    .then((result) => {
        res.status(200)
        .json({
            status:"success",
            message: `Utente con Id: ${result.rowCount} eliminato`
        });
    }).catch((err) => next(err) );
};

module.exports = {
    getUser : getUser,
    createUser : createUser,
    updateUser : updateUser,
    deleteUser : deleteUser,
    getUsers : getUsers
};

function createUser(req, res, next) {
    db.none('insert into Proprietario(nome,cognome,username,mail,password)'+
        'values(${nome},${cognome},${username},${mail},${password})',req.body)
        .then(function() {
            res.status(200).json({
                status : "success",
                message : "inserito un utente"
            })
        })
        .catch(function(err){
            return next(err);
        });
};

