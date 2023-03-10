"use strict";

const express = require("express");
const bodyParser = require("body-parser");
var app = express();
var cors = require('cors');

//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static("./"));
app.use(cors());
app.use(express.json())
//To get inputs sent in the body of the request, we need to use the body-parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//This app starts a server and listens on port 8080 for connection



const start = async () => {
  try {
    await app.listen(8080);
    console.log('Server listening on http://3.220.228.48:8080');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();

//////////////////////////////////////Marcus routes///////////////////////////////////////
const userController = require('./marcus/controllers/userController')                   //
const serviceController = require('./marcus/controllers/serviceController')             //
//////////////////////////////////////Route for Users/////////////////////////////////////  
app.route('/users').get(userController.getAllUser);                                     //
app.route('/register').post(userController.addUser);                                    //
app.route('/delusers').delete(userController.deleteUser);//                             //
app.route('/login').post(userController.loginUser);                                     //
app.route('/viewuser').post(userController.getuserData);//                              //      
app.route('/upduser').put(userController.updateUser);                                   //
/////////////////////////////////////Route for services///////////////////////////////////
app.route('/vaultga').post(serviceController.getUserVault);                             // 
app.route('/vaultgui').post(serviceController.getUserIndiv);                            //
app.route('/vaultac').post(serviceController.addAcc);                                   //
app.route('/vaultdac/').delete(serviceController.deleteAcc);                            //
app.route('/vaultupac/').put(serviceController.updateAcc);                              //
//////////////////////////////////////////////////////////////////////////////////////////



//Kieron routes
const { ROLE, users } = require('./kieron/data')
const { authUser, authRole } = require('./kieron/basicAuth')
const projectRouter = require('./kieron/routes/projects')
const router = express.Router()
const { projects } = require('./kieron/data')
app.use('/projects', projectRouter)
app.get('/', (req, res) => {
  res.send('Home Page')
})
app.get('/dashboard', authUser, (req, res) => {
  res.send('Dashboard Page')
})
app.get('/admin', authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send('Admin Page')
})
function setUser(req, res, next) {
  const userId = req.body.userId
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next()
}

router.get('/', (req, res) => {
  res.json(projects)
})

router.get('/:projectId', setProject, (req, res) => {
  res.json(req.project)
})

function setProject(req, res, next) {
  const projectId = parseInt(req.params.projectId)
  req.project = projects.find(project => project.id === projectId)
  
  if (req.project == null) {
    res.status(404)
    return res.send('Project not found')
  }
  next()
}

module.exports = router
//