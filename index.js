const http = require('http');
const fs = require('fs');



const requestListener = function (req, res) {
    switch (true) {
        case req.url === '/' && req.method === 'GET':
            fs.readFile('./views/index.html', function (err, data) {
                res.setHeader('content-type', 'text/html;charset=utf-8');
                res.writeHead(200);
                res.end(data);
            })
            break;
        case req.url === '/script.js' && req.method === 'GET':
            fs.readFile('./public/script.js', function (err, data) {
                res.setHeader('content-type', 'application/javascript;charset=utf-8');
                res.writeHead(200);
                res.end(data)
            })
            break;
        case req.url === '/members' && req.method === 'GET':
            fs.readFile('./members.json', function (err, data) {
                res.setHeader('content-type', 'application/json');
                res.writeHead(200);
                res.end(data)
            })
            break;
        case req.url === '/list' && req.method === 'GET':
            fs.readFile('./members.json', function (err, data) {
                res.setHeader('content-type', 'text/html;charset=utf-8');
                res.writeHead(200);
                const members = JSON.parse(data);
                let HTMLcontent = '<table class="table table-striped table-hover"><thead><th>név</th><th>kor</th><th>város</th></thead><tbody>';
                for (k of members) {
                    HTMLcontent += `<tr><td>${k.name}</td><td>${k.age}</td><td>${k.city}</td>`
                }
                HTMLcontent += '</tbody> </table>';
                res.end(HTMLcontent);
            })
            break;
        case req.url === '/members' && req.method === 'PUT':
            let put_body = '';
            req.on('data', function (chunk) {
                put_body += chunk.toString();
            })
            req.on('end', function () {
                let myBody_put = JSON.parse(put_body);
                myBody_put = JSON.parse(myBody_put);
                myId_put = myBody_put.id;
                myName_put = myBody_put.name;
                myCity_put = myBody_put.city;
                myAge_put = myBody_put.age;
                fs.readFile('./members.json', (err, data) => {
                    let members_put = JSON.parse(data);
                    const myObject = members_put[myId_put - 1];
                    myObject.name = sanitizeString(myName_put);
                    myObject.age = sanitizeString(myAge_put);
                    myObject.city = sanitizeString(myCity_put);
                    fs.writeFile('./members.json', JSON.stringify(members_put), () => {
                        res.writeHead(200);
                        res.end();
                    })
                });
            });
            break;
        case req.url === '/members' && req.method === 'DELETE':
            let del_body = '';
            req.on('data', function (chunk) {
                del_body += chunk.toString();
            })
            req.on('end', function () {
                let myId = JSON.parse(del_body);
                myId = JSON.parse(myId);
                myId = myId.id;
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
            });
            break;
        case req.url === '/members' && req.method === 'POST':
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
                    let myId = members.length;
                    newMember.id = myId + 1;
                    members.push(newMember);
                    fs.writeFile('./members.json', JSON.stringify(members), () => {
                        res.end();
                    })
                })
            });
            break;
        default:
            fs.readFile('./views/404.html', function (err, data) {
                res.setHeader('content-type', 'text/html;charset=utf-8');
                res.writeHead(200);
                res.end(data)
            })
    }
}

const server = http.createServer(requestListener);
server.listen(8080);

function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñüűúő_-\s\.,]/gim, "");
    return str.trim();
}