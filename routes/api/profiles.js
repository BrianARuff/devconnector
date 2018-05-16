const express = require('express');
const router = express.Router();

// @route,       GET request in api/profile/test
// @description, tests profile route
// @access,      Public route
router.get('/test', (req, res) => res.json({msg: "Profile works"}));


module.exports = router;