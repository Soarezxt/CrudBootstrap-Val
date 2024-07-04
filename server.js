const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

// Configuração do Sequelize
const sequelize = new Sequelize('sqlite::memory:');

// Definição do modelo
const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// Sincronizar modelo com o banco de dados
sequelize.sync();

const app = express();
app.use(bodyParser.json());

// Rotas CRUD
app.get('/items', async (req, res) => {
  const items = await Item.findAll();
  res.json(items);
});

app.post('/items', async (req, res) => {
  const item = await Item.create(req.body);
  res.json(item);
});

app.put('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (item) {
    await item.update(req.body);
    res.json(item);
  } else {
    res.status(404).send('Item não encontrado');
  }
});

app.delete('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (item) {
    await item.update({ status: false });
    res.json(item);
  } else {
    res.status(404).send('Item não encontrado');
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
