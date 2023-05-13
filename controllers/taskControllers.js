const Users = require("../models/user.js");
const jwt = require("jsonwebtoken");
const Tasks = require("../models/task.js");
const bcrypt = require('bcrypt');
const { valid } = require("joi");
const JWT_SECRET = "newtonSchool";

/*

request.body = {
    heading: heading,
    description: description,
    token: token
}

1. Create new task from request body .
2. From JWT token payload get creator_id of this task. (userId in payload will be creator_id).
3. Save heading, description, creator_id for every task.

Response :

1. Success

200 StatusCode

json = 
{
    "message": 'Task added successfully',
    "task_id": task._id, //id of task that is created.
    "status": 'success'
}

2. Unabel to verify token (Invalid Token)
404 Status Code
json = 
{
    "status": 'fail',
    "message": 'Invalid token'
}

3. Fail to do

404 Status Code
json = 
{
    "status": 'fail',
    "message": error message
}

*/

const createTask = async (req, res) => {
  try {
    const { heading, description, token } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const creator_id = decoded.userId;
    const task = new Tasks({ heading, description, creator_id });
    await task.save();
    res.status(200).json({
      message: 'Task added successfully',
      task_id: task._id,
      status: 'success'
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(404).json({
        status: 'fail',
        message: 'Invalid token'
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: err.message
      });
    }
  }
}

/*

getdetailTask Controller

req.body = {
    "task_id" : task_id,
    "token" : token
}

1. Return the detail of the task with given task_id.
2. For this task you will be only test with valid (Existing) task_id.

Response --> 

1. Success

200 Status code

json = {
  status: 'success',
  data: {
    Status: 'pending',
    _id: 'mxcnbxzcn-khscc',
    heading: 'Study Doglapan',
    description: 'Need to study atleast 10 Pages',
    creator_id: 'kdjhgsdjgmsbmbs'
  }
}

2. Fail

404 Status Code
json = {
    "status": 'fail',
    "message": error message
}

*/

const getdetailTask = async (req, res) => {
  try {
    const { task_id, token } = req.body;
    const task = await Tasks.findById(task_id);
    if (!task) {
      throw new Error('Task not found');
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (task.creator_id !== decoded.userId) {
      throw new Error('Unauthorized access');
    }
    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
}

module.exports = { createTask, getdetailTask };


// const Users   = require("../models/user.js");
// const jwt = require("jsonwebtoken");
// const Tasks   = require("../models/task.js");
// const bcrypt  = require('bcrypt');
// const { valid } = require("joi");
// const JWT_SECRET = "newtonSchool";

// /*

// request.body = {
//     heading: heading,
//     description: description,
//     token: token
// }

// 1. Create new task from request body .
// 2. From JWT token payload get creator_id of this task. (userId in payload will be creator_id).
// 3. Save heading, description, creator_id for every task.

// Response :

// 1. Success

// 200 StatusCode

// json = 
// {
//     "message": 'Task added successfully',
//     "task_id": task._id, //id of task that is created.
//     "status": 'success'
// }

// 2. Unabel to verify token (Invalid Token)
// 404 Status Code
// json = 
// {
//     "status": 'fail',
//     "message": 'Invalid token'
// }

// 3. Fail to do

// 404 Status Code
// json = 
// {
//     "status": 'fail',
//     "message": error message
// }

// */

// const createTask =async (req, res) => {

//     //creator_id is user id who have created this task.

//     const { heading, description, token  } = req.body;
//     //Write your code here.

// }

// /*

// getdetailTask Controller

// req.body = {
//     "task_id" : task_id,
//     "token" : token
// }

// 1. Return the detail of the task with given task_id.
// 2. For this task you will be only test with valid (Existing) task_id.

// Response --> 

// 1. Success

// 200 Status code

// json = {
//   status: 'success',
//   data: {
//     Status: 'pending',
//     _id: 'mxcnbxzcn-khscc',
//     heading: 'Study Doglapan',
//     description: 'Need to study atleast 10 Pages',
//     creator_id: 'kdjhgsdjgmsbmbs'
//   }
// }

// 2. Fail

// 404 Status Code
// json = {
//     "status": 'fail',
//     "message": error message
// }

// */

// const getdetailTask = async (req, res) => {

//     const task_id = req.body.task_id;
//     //Write your code here.
// }

// module.exports = { createTask, getdetailTask };
