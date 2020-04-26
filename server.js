'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const methodOverride = require('method-override');
let pg = require('pg');
let PORT = process.env.PORT || 3000;
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    const URL = 'https://digimon-api.herokuapp.com/api/digimon';
    superagent.get(URL)
    .then(data =>{
        res.render('./index',{digimons : data.body});
    })
});

app.get('/favorite/:name',(req,res)=>{
    let digimonsName = req.params.name;
    console.log(digimonsName);
    const newURL = `https://digimon-api.herokuapp.com/api/digimon/name/${digimonsName}`;
    superagent.get(newURL)
    .then(data =>{
        // console.log(data.body[0].name);
        let SQL = `INSERT INTO digimons (name, img, level) VALUES ('${data.body[0].name}', '${data.body[0].img}', '${data.body[0].level}');`;
        client.query(SQL)
        .then(data =>{
            console.log('done');
        });
        
    })
    let SQL1 = 'SELECT * FROM digimons;';
    client.query(SQL1)
    .then(data =>{
        console.log(data.rows);
        res.render('./favorite' , {DB : data.rows});
        
    })
})

app.get('/details/:id',(req,res)=>{
    let unique = req.params.id;
    let SQL = `SELECT * FROM digimons WHERE id=${unique};`;
    client.query(SQL)
    .then(data =>{
        res.render('./details', {one: data.rows[0]});
    })
})

app.delete('/delete/:id',(req,res)=>{
    let unique = req.params.id;
    let SQL = `DELETE FROM digimons WHERE id = ${unique};`;
    client.query(SQL)
    .then(data =>{
        console.log('deleted');
        res.redirect('/');
    })
})

app.put('/update/:id' , (req,res)=>{
    let unique = req.params.id;
    let newName = req.body.nameChange;
    let newLevel = req.body.levelChange;
    let SQL = ` UPDATE digimons SET name = '${newName}', level = '${newLevel}'  WHERE id=${unique};`;
    client.query(SQL)
    .then(data =>{
        res.redirect(`/favorite/${newName}`)
    })


})


client.connect()
.then(()=>{
    app.listen(PORT, () => console.log(`you listen on ${PORT}`));
})
