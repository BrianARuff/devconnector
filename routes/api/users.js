const express = require('express');
const router = express.Router();

// @route,       GET request in api/users/test
// @description, tests users route
// @access,      Public route
router.get('/test', (req, res) => res.json({msg: "Users works"}));


module.exports = router;
