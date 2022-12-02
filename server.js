const express = require('express'); 
const app = express();
const port = process.env.PORT || 4000; 
const bodyParser = require('body-parser');
const  fs  = require('fs');

app.listen(port, () => console.log(`Listening on port ${port}`)); 
app.use (bodyParser.urlencoded({extended:false}))
app.use( bodyParser.json())

let client;
app.post('/t', function(req, res){
    client=req.body.items;
    const data=JSON.stringify(client)
    res.send(data)
    console.log(data)
    fs.writeFile("./newjson.json", data, error=>{
    if(error){
        console.log("Error writing file",error)
    }else{
        console.log("File written")}
    })
})

app.get('/t',function(req, res){
    fs.readFile('./newjson.json','utf8', function(err, data){
    if (err) throw err;
    console.log(data);
    res.send(data)
    })
})