const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureAuthenticated = require('./../middlewares/auth.middleware');
const {
    uploadImage, 
    uploadVideo
} = require('./../middlewares/fileupload.middleware');

const {
    getAddBlog,
    postAddBlog,
} = require('./../controllers/blogs.controller');

router.get('/add-blog', ensureAuthenticated, getAddBlog);
router.post('/add-blog', ensureAuthenticated,uploadImage,uploadVideo, postAddBlog);

module.exports = router;