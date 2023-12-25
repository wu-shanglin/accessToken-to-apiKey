const express = require('express')
const router = express.Router()
const db = require("../db/index")
router.get('/all', (req, res) => {
  let sql = "select * from channel";
  db.query(sql, (err, result) => {
    if (err) {
      res.send({ status: 404, msg: "查询失败" })
    }
    res.send({
      status: 200,
      msg: "查询成功",
      data: result
    })
  })
})



module.exports = router;