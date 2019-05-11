var express = require('express');
var router = express.Router();
const joins = require("../public/javascripts/joins.com/joinsCom")

/* GET home page. */
router.get('/', function(req, res, next) {
  joins.doCrawling("가금류", "병", "")
    .then(result => {
      res.status(200).send(result)
    })
    .catch(e => {
      console.log(e)
      res.status(500).send(e)
    })
});

module.exports = router;
