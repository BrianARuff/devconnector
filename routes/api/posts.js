const express = require('express');
const router = express.Router();

// @route,       GET request in api/post/test
// @description, tests post route
// @access,      Public route
router.get('/test', (req, res) => res.json({msg: "Posts works"}));


module.exports = router;