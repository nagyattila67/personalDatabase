const fs = require('fs');
const express = require('express')
const app = express()
const path = require('path');
const bodyParserUrlencoded = require('body-parser').urlencoded;
const bodyParserJson = require('body-parser').json;

app.set('view engine','ejs');
app.get('/tagok',(req,res)=>{
    fs.readFile('./members.json',(err,file)=>{
        const members = JSON.parse(file)
      res.render('index',{members:members})  
    })
})


app.get('/', function (req, res) {
    //res.sendFile(__dirname+'/views/index.html')
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/members', function (req, res) {
    res.sendFile(path.join(__dirname, 'members.json'))
})

/*case req.url === '/members' && req.method === 'GET':
            fs.readFile('./members.json', function (err, data) {
                res.setHeader('content-type', 'application/json');
                res.writeHead(200);
                res.end(data)
            })*/

app.get('/script.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'script.js'))
})

app.get('/tagok', function (req, res) {
    //res.sendFile(path.join(__dirname, 'members.json'));
})
app.get('/list', function (req, res) {
    fs.readFile('./members.json', function (err, data) {
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.writeHead(200);
        const members = JSON.parse(data);
        let HTMLcontent = '<table class="table table-striped table-hover"><thead><th>név</th><th>kor</th><th>város</th><th>faj</th></thead><tbody>';
        for (k of members) {
            HTMLcontent += `<tr><td>${k.name}</td><td>${k.age}</td><td>${k.city}</td><td>${k.species}</td>`
        }
        HTMLcontent += '</tbody> </table>';
        res.end(HTMLcontent);
    })
})

function loggerMiddleWare(req, res, next) {
    console.log("url", req.url);
    req.valami = 1;
    console.log("hhhhh", req.valami)
    next();
}

//app.post('/members', loggerMiddleWare, function (req, res) {
//  console.log("hellohello");
//console.log(req.body)
//})

app.post('/', loggerMiddleWare, bodyParserUrlencoded({ extended: true }), function (req, res) {
    //amikor a  <form id="members-data-form" action="/" taget="_self" method="POST"> van bekapcsola
    //a buttonról le kell venni az onclick-et
    //viszont nem tudja újratölteni az oldalt
    console.log(req.body);
    let myBody = req.body;
    console.log("yyyyyyyyyyyyy", myBody)

    fs.readFile('./members.json', (err, data) => {
        const members = JSON.parse(data);
        console.log("qqqqqqqqqqqq", myBody)
        let newMember = Object();
        newMember.name = sanitizeString(myBody.name);
        newMember.age = sanitizeString(myBody.age);
        newMember.city = sanitizeString(myBody.city);
        newMember.species = sanitizeString(myBody.species);
        let myId = members.length;
        newMember.id = myId + 1;
        members.push(newMember);
        fs.writeFile('./members.json', JSON.stringify(members), () => {
            const content = loadData(members);
            res.end(content);
        })
    })
})
app.delete('/members', bodyParserJson({ extended: true }), function (req, res) {
    console.log("sziaszia")
    console.log("vvvvvvv",req.body)
    let myId = req.body.id;
    console.log("ccccccccccc",myId)
    fs.readFile('./members.json', (err, data) => {
        let members_del = JSON.parse(data);
        members_del = members_del.filter((value) => {
            if (value.id != myId) {
                if (value.id > myId) {
                    value.id = `${value.id - 1}`;
                };
                return value
            }
        })
        fs.writeFile('./members.json', JSON.stringify(members_del), () => {
            res.writeHead(200);
            res.end();
        })
    });
})

function loadData(members) {


    let content = "<thead><th>nr</th><th>név</th><th>kor</th><th>város</th><th>faj</th></thead>";
    for (k of members) {
        content += `
        <tr><td>${k.id}.</td>
        <td>${k.name}</td>
        <td>${k.age}</td>
        <td>${k.city}</td>
        <td>${k.species}</td>
        <td><button id='${k.id}' class="btn btn-secondary btn-small" onclick="myModify(event)">módosít</button></td>
        <td><button id='${k.id}' class="btn btn-secondary btn-small" onclick="myDelete(event)">töröl</button></td></tr>
        `
    }
    console.log("content", content);
    return content;
    //document.querySelector("#data-content").innerHTML = content;
}


app.post('/members', function (req, res) {
    //amikor csak a  <form id="members-data-form"> van bekapcsolva
    //ekkor a buttonon onclick kell, hogy legyen
    console.log("most");
    let body = '';
    req.on('data', function (chunk) {
        body += chunk.toString();
    })

    req.on('end', function () {
        let newMember = JSON.parse(body);

        fs.readFile('./members.json', (err, data) => {
            const members = JSON.parse(data);
            newMember = JSON.parse(newMember);
            newMember.name = sanitizeString(newMember.name);
            newMember.age = sanitizeString(newMember.age);
            newMember.city = sanitizeString(newMember.city);
            newMember.species = sanitizeString(newMember.species);
            let myId = members.length;
            newMember.id = myId + 1;
            members.push(newMember);
            fs.writeFile('./members.json', JSON.stringify(members), () => {
                res.end();
            })
        })
    });
})

app.put('/members', bodyParserJson({ extended: true }), function (req, res) {

        let myBody_put = req.body;
        myId_put = myBody_put.id;
        myName_put = myBody_put.name;
        myCity_put = myBody_put.city;
        myAge_put = myBody_put.age;
        mySpecies_put = myBody_put.species;
        console.log("mySpecies_put",mySpecies_put)
        fs.readFile('./members.json', (err, data) => {
            let members_put = JSON.parse(data);
            const myObject = members_put[myId_put - 1];
            myObject.name = sanitizeString(myName_put);
            myObject.age = sanitizeString(myAge_put);
            myObject.city = sanitizeString(myCity_put);
            myObject.species = sanitizeString(mySpecies_put);
            fs.writeFile('./members.json', JSON.stringify(members_put), () => {
                res.writeHead(200);
                res.end();
            })
        });
    })


app.listen(8080);

function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñüűúő_-\s\.,]/gim, "");
    return str.trim();
}