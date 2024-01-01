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
    const image = req.files['image'][0].filename;
    const video = req.files['video'][0].filename;
    try {
        const newBlog = new Blog({
            title,
            content,
            author,
            image,
            video
        });
        await newBlog.save();
        res.json({ message: 'task Uploaded recently' });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}
module.exports = {  
    getAddBlog,
    postAddBlog,
    };