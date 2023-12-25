const express = require('express');
const router = express.Router();
const config = require('../config')
const jsonwebtoken = require("jsonwebtoken")
router.post('/login', function (req, res) {
  if (!(req.body.username == config.web_username && req.body.password == config.web_password)) {
    return res.send({
      status: 403,
      msg: 'Invalid username or password'
    });
  }
  // 生成token
  const tokenConfig = { username: config.web_username }
  const token = "Bearer " + jsonwebtoken.sign(tokenConfig, config.jwtSecret, { expiresIn: '1h' })
  res.send({
    status: 200,
    msg: "登录成功",
    token: token
  })
})


module.exports = router;