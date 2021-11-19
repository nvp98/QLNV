var express = require('express');
require('dotenv').config();
var app = express();
const bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.set('view engine', 'pug');
app.set('views', './Views');

// const xlsx =require('node-xlsx');
// Or var xlsx = require('node-xlsx').default;

// Parse a buffer
// const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/myFile.xlsx`));
// Parse a file
// const workSheetsFromFile = xlsx.parse(`${__dirname}/Test.xlsx`);

const PORT = process.env.PORT;
const db_server =process.env.DB_SERVER;

var sql = require("mssql");

// config for your database
var config = {
    user: 'sa',
    password: '123456',
    server: db_server, 
    database: 'Test',
    trustServerCertificate: true, 
};


app.get('/', function (req, res) {
   
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);
        // var val = "INSERT INTO dbo.nhanvien1 (name, code, phongban, vitri) VALUES ('Company Inc','11','22','33')";
        // create Request object
        var request = new sql.Request();
        // // query to the database and get the records
        request.query('select * from nhanvien1', function (err, recordset) {           
            if (err) console.log(err)
            console.log(recordset.recordsets[0][0],'len');
            // res.send(recordset);
            res.render('index',{records: recordset.recordsets[0]})
            
        });
    });
});

app.get('/create',function(req,res){
    res.render('create')
})

app.post('/',function(req,res){
    // var val1 = "INSERT INTO dbo.nhanvien1 (name, code, phongban, vitri) VALUES (" + req.body.name + "," + req.body.code + "," + req.body.phongban + "," + req.body.vitri + ")";
    sql.connect(config, function (err) {
        if (err)
          console.log(err);
    
        var request = new sql.Request();
        request
          .input('name', sql.NVarChar(50), req.body.name)
          .input('code', sql.NVarChar(50), req.body.code)
          .input('phongban', sql.NVarChar(50), req.body.phongban)
          .input('vitri', sql.NVarChar(50), req.body.vitri)
          .query('insert into nhanvien1 (name, code, phongban, vitri) values (@name, @code, @phongban, @vitri)', function (err, result) {
    
            if (err) {
              console.log(err);
              res.send(err);
            }
            sql.close();
            res.redirect('/');
          });
      });
})
//delete
app.get('/delete/:id',function(req,res){
    sql.connect(config, function (err) {
        if (err)
          console.log(err);
    
        var request = new sql.Request();
        request.input('id', sql.NVarChar(50), req.params.id)
          .query('delete from nhanvien1 where id=@id', function (err, result) {
    
            if (err) {
              console.log(err);
              res.send(err);
            }
            sql.close();
            res.redirect('/');
          });
      });
})
//update
app.get('/edit/:id',function(req,res){
    sql.connect(config, function (err) {
        if (err)
          console.log(err);
    
        var request = new sql.Request();
        request.input('id', sql.NVarChar(50), req.params.id)
        request.query("select * from nhanvien1 where id=@id", function (err, result) {
    
          if (err) {
            console.log(err)
            res.send(err);
          }
          // var rowsCount = result.rowsAffected;
         
          sql.close();
          res.render('edit', {
            data: result.recordset[0]
          });
    
        }); // request.query
      }); // sql.conn
})

app.post('/update/:id',function(req,res){
    sql.connect(config, function (err) {
        if (err)
          console.log(err);
    
        var request = new sql.Request();
        request.input('name', sql.NVarChar(50), req.body.name)
          .input('code', sql.NVarChar(50), req.body.code)
          .input('phongban', sql.NVarChar(50), req.body.phongban)
          .input('vitri', sql.NVarChar(50), req.body.vitri)
          .input('id',sql.NVarChar(50),req.params.id)
          .query('update nhanvien1 set name=@name,code=@code,phongban=@phongban,vitri=@vitri where id=@id', function (err, result) {
    
            if (err) {
              console.log(err);
              res.send(err);
            }
            sql.close();
            res.redirect('/');
          });
      });
})

var server = app.listen(PORT, function () {
    console.log('Server is running..'); 
});