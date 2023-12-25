const express = require('express');
const router = express.Router();
const config = require('../config')
const db = require("../db/index")
const nanoid = require('nanoid')
router.post("/add", (req, res) => {
  if (!(req.body.access && req.body.name)) return res.send({ status: 400, msg: "Invalid Data" });
  let sql = "select access from channel where access = ?"
  db.query(sql, [req.body.access], function (err, result) {
    if (err) {
      console.log(err);
      return res.send({ status: 500, msg: "Internal Server Error" });
    };
    if (result.length != 0) return res.send({
      status: 405,
      msg: "请勿填写重复access token"
    })
    if (result.length == 0) {
      const addData = {
        access: req.body.access,
        name: req.body.name,
        key: 'sk-' + nanoid.nanoid(100)
      }
      sql = `INSERT INTO channel set ?`;

      db.query(sql, addData, function (err, result) {
        if (err) {
          return res.send({ status: 400, msg: "添加失败" })
        };
        if (result.affectedRows == 1) {
          res.send({
            status: 200,
            msg: "添加成功"
          })
        }
      })
    }
  })

})

router.post("/update", (req, res) => {
  if (!req.body.id) return res.send({ status: 400, msg: "Invalid Data" });
  let sql = 'UPDATE channel SET ? WHERE id = ?'
  const addData = {
    access: req.body.access,
    name: req.body.name,
  }
  db.query(sql, [addData, req.body.id], function (err, result) {
    if (err) {
      return res.send({ status: 400, msg: "更新失败" })
    };
    if (result.affectedRows == 1) {
      res.send({
        status: 200,
        msg: "更新成功"
      })
    }
  })

})
router.post('/delete', (req, res) => {
  if (!req.body.id) return res.send({ status: 400, msg: "Invalid Data" })
  let sql = "delete from channel where id = ?"
  db.query(sql, [req.body.id], function (err, result) {
    if (err) {
      return res.send({ status: 500, msg: "Internal Server Error" })
    }
    if (result.affectedRows == 1) {
      res.send({ status: 200, msg: "删除成功" })
    } else if (result.affectedRows == 0) {
      res.send({ status: 200, msg: "请勿重复删除" })
    }
  })
})
module.exports = router;