const Blog = require("../models/Blog.model");
const User = require("../models/User.model");


const getAddBlog = (req, res) => {
  res.render("newblog.ejs", { user: req.user });
}
const postAddBlog = async (req, res) => {
    const { title , content } = req.body;
    const errors = [];
    if (!title || !content) {
        errors.push("Title and Content fields are required!");
      }
  
    const author = req.user.email;
    const image = req.file? req.file.filename : null;
    try {
        const newBlog = new Blog({
            title,
            content,
            author,
            image,
        });
        await newBlog.save();
        res.json({ message: 'task Uploaded recently' });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.email });
        res.render("myblogs.ejs", { blogs, user: req.user });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}
const postVideo = async (req, res) => {
    const { id } = req.params;
    const video = req.file? req.file.filename : null;
    try {
        if(!video){
            return res.status(400).json({ msg: "No video uploaded" });
        }
        const blog = await Blog.findOne({ _id:id });
        if(!blog){
            return res.status(400).json({ msg: "Blog not found" });
        }
        if(video){
            blog.video = video;
        }
        await blog.save();
        res.json({ message: 'Video Uploaded successfully' });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

const getUpdateBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findOne({ _id: id });
        res.render("updateblog.ejs", { blog, user: req.user });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}



const fs = require('fs').promises;
const path = require("path");

const postUpdateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content, deleteImages,deleteVideo} = req.body;
    const image = req.file ? req.file.filename : null;
    const deleteImagesArray = Array.isArray(deleteImages) ? deleteImages : [deleteImages];
    console.log(deleteImagesArray);

    try {
        const blog = await Blog.findOne({_id:id});

        if (!blog) {
            return res.status(400).json({ msg: 'Blog not found' });
        }

        if (title) {
            blog.title = title;
        }

        if (content) {
            blog.content = content;
        }

        if (image) {
            if(blog.image && blog.image.length > 0){
            blog.image = blog.image.concat(image);
            }
            else{
                blog.image = image;
            }
        }
        // Handle image deletion
        console.log(deleteImagesArray.length);
        if (deleteImagesArray && deleteImagesArray.length > 1) {
            for (let i = 0; i < deleteImagesArray.length; i++) {
                console.log(deleteImagesArray[i]);
                const imagePath = path.join(__dirname, '../uploads/images', deleteImagesArray[i]);
                console.log(imagePath);
                // Remove the image from the images array
                blog.image = blog.image.filter(img => img !== deleteImagesArray[i]);

                // Remove the image file
                await fs.unlink(imagePath);
            }
        }
        // Handle video deletion
        if (deleteVideo) {
            const videoPath = path.join(__dirname, '../uploads/videos', deleteVideo);
            // Remove the video file
            await fs.unlink(videoPath);
            blog.video = null;
        }

        
        await blog.save();
        res.json({ message: 'Blog Updated successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err.message });
    }
};

const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try{
        const blog = await Blog.findOne({_id:id});
        if (!blog) {
            return res.status(400).json({ msg: 'Blog not found' });
        }
        await blog.deleteOne({_id:id});
        res.json({ message: 'Blog Deleted successfully' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err.message });
    }
}


module.exports = {  
    getAddBlog,
    postAddBlog,
    getMyBlogs,
    postVideo,
    getUpdateBlog,
    postUpdateBlog,
    deleteBlog,
    };