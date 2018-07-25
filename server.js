var azure = require('azure-storage');
var formidable = require('formidable');
var express = require('express');

const storageAccount = ''
const storageAccessKey = ''
const azureEndpoint = ''
const containerName = '';
var app = express();

var blobClient = azure.createBlobService(storageAccount, storageAccessKey);


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.post('/uploadhandler', function (req, res) {
  var form = new formidable.IncomingForm();
  var itemId = new Date().getTime()
  form.parse(req, function (err, fields, files) {
    console.log(JSON.stringify(files))

      var options = {
        contentType: 'image/jpeg',
        metadata: {fileName: itemId}
        }
      var imgPath = files.image.path
      var machineId = fields.machineId
      var userName = fields.userName
      uploadFull(imgPath, itemId, options)
  });
});

var uploadFull = function(imgPath, itemId, options){
  var fileName = itemId + '.jpg'
  blobClient.createBlockBlobFromLocalFile(containerName, fileName, imgPath, options, function (error) {
    if (error != null) {
      console.log('Azure Upload Error: ', error)
    } else {
      console.log('Azure Upload Success')
    }
  });
}




var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on port " + port);
});


