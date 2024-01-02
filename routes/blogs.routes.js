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
    getMyBlogs,
    postVideo,
    getUpdateBlog,
    postUpdateBlog,
    deleteBlog,
} = require('./../controllers/blogs.controller');

router.get('/add-blog', ensureAuthenticated, getAddBlog);
router.post('/add-blog', ensureAuthenticated,uploadImage, postAddBlog);
router.post('/upload-video/:id', ensureAuthenticated,uploadVideo, postVideo);
router.get('/myblogs', ensureAuthenticated, getMyBlogs);
router.get('/update-blog/:id', ensureAuthenticated, getUpdateBlog);
router.post('/update-blog/:id', ensureAuthenticated,uploadImage, postUpdateBlog);
router.post('/delete-blog/:id', ensureAuthenticated, deleteBlog);

module.exports = router;