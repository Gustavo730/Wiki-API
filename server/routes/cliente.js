
const express = require('express')
const app = express()
const db = require('../db')

app.get('/clientes', function (req, res) {
  const query = 'SELECT * FROM clientes ORDER BY id ASC ';
  db.query(query, (errDB, resDB) => {

    if (errDB) {
      return res.json({
        error: errDB.stack
      })
    }

    if (resDB.rows.length == 0) {
      return res.json({
        msg: 'tabla sin datos'
      })
    }

    res.json({
      clientes: resDB.rows
    })
  })

})

app.get('/cliente/:id', function (req, res) {
  let id = req.params.id;
  const query = "SELECT nombre, descripcion, ubicacion FROM clientes WHERE id = $1";
  values = [id];

  db.query(query, values, (errDB, resDB) => {
    if (errDB) {
      return res.json({
        error: errDB.stack
      })
    }
    res.json({
      cliente: {
        nombre: resDB.rows[0].nombre,
        descripcion: resDB.rows[0].descripcion,
        ubicacion: resDB.rows[0].ubicacion
      }
    })
  })

})

app.post('/cliente', function (req, res) {

  let body = req.body;

  if (body.nombre === undefined)  {
    return res.status(400).json({
      ok: false,
      error: 'nombre es necesario'
    })
  }

  const query = 'INSERT INTO clientes(nombre, descripcion, ubicacion, fecha_creacion) VALUES($1, $2, $3, current_timestamp) RETURNING *'
  const values = [body.nombre, body.descripcion, body.ubicacion]
  db.query(query, values, (errDB, resDB) => {

    if (errDB) {
      return res.json({
        ok: false,
        error: errDB.stack
      })
    }

    res.json({
      cliente: resDB.rows
    })

  })

})

app.put('/cliente/:id', function (req, res) {

  let id = req.params.id;
  let body = req.body;
  const query = 'UPDATE clientes SET nombre = $1, descripcion = $2, ubicacion = $3 WHERE id = $4 RETURNING *';
  const values = [body.nombre, body.descripcion, body.ubicacion, id];

  db.query(query, values, (errDB, resDB) => {

    if (errDB) {
      return res.json({
        ok: false,
        error: errDB.stack
      })
    }

    if (body.nombre === undefined)  {
      return res.status(400).json({
        ok: false,
        error: 'nombre es necesario'
      })
    }

    res.json({
      cliente: resDB.rows
    })
  })

})

module.exports = app;
