const express = require('express');
const cors = require('cors')
const expressJwt = require("express-jwt")
const config = require('./config')
const app = express();
const proxy = require('http-proxy-middleware');
const db = require("./db/index")
app.use(cors())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('./public'))

function updateHeader(req, res, next) {
  const target = req.headers.authorization.split(' ')
  let sql = "SELECT access FROM channel WHERE `key` = ?"
  db.query(sql, [target[1]], (err, result) => {
    if (err) {
      return res.send({
        status: 400,
        msg: err.message
      })
    }

    if (result.length === 0) return res.send({
      status: 404,
      msg: "该access token不存在"
    })
    req.headers['authorization'] = "Bearer " + result[0].access;
    // console.log(req.headers);
    next()
  })
}

const proxy_handle = proxy.createProxyMiddleware({
  target: config.openai_url,
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/api': ''
  },
  onProxyReq: proxy.fixRequestBody,
  onError: (err, proxyRes, req, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 500,
      msg: "代理错误"
    }))
  }
})

app.use('/api', [updateHeader, proxy_handle])


app.use(expressJwt.expressjwt({ secret: config.jwtSecret, algorithms: ['HS256'] }).unless({ path: [/^\/user/, /^\/api/] }))
app.use('/user', require('./router/user'));
app.use('/edit', require('./router/edit'))
app.use('/info', require('./router/info'))


app.use((err, req, res, next) => {
  // 身份认证失败的错误
  if (err.name === "UnauthorizedError") {
    return res.send({
      status: 401,
      msg: "身份认证失败,请重新登录"
    })
  }
  // 未知错误
  res.cc(err);
  // next()
});
app.listen(80)