//jshint esversion:6
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");  //lodash liberary is used to convert the srting present in url to other formats (in this we used it to conver in lowercase)

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

mongoose.connect("mongodb://localhost:27017/blogDB");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const posts ={};

const blogSchema = new mongoose.Schema([{
  title: {
    type: String,
    require: [true, "Please provide the title of your blog !"]
  },
  post: {
    type: String,
    required: [true, "Post must not be empty !"]
  }
}]);

const Blog = mongoose. model("Blog", blogSchema);


app.get("/", function(req, res){

  Blog.find({}, function(err, foundItem){
    if(err){
      console.log(err);
    }
    else{
      res.render("home" ,{para: homeStartingContent, posts: foundItem});
      console.log(foundItem);
    }
  });
  
})

app.get("/about", function(req, res){

  res.render("about", {about: aboutContent});
})

app.get("/contact", function(req, res){

  res.render("contact", {contact: contactContent});
})

app.get("/compose", function(req, res){

  res.render("compose");
})

app.post("/compose", function(req, res){

  const i = [{title: req.body.postTitle, post: req.body.postBody}];
  Blog.insertMany(i, function(err, foundItem){
    if(err){
      console.log(err);
    }
    else{
      console.log(foundItem);
    }
  });
  res.redirect("/");  
});

app.get("/posts/:heading", function(req, res){   //":heading" is a temporary url that stores the values of url after posts(it can be single or multiple)
  let Title = req.params.heading;  //"params" property is used to get hold of that values. (example : "http:localhost:3000/posts/<topic-name> "

  Blog.find({title:Title}, function(err, foundItem){
    if(err){
      console.log(err);
    }
    else{
      foundItem.forEach(function(e){
        if (_.lowerCase(e.title) === _.lowerCase(Title)){
          res.render("post", {BlogTitle: e.title, BlogContent: e.post});
        }
        else{
          console.log(foundItem);
          res.send("<h1>Error 404 !</h1>");
        }
      });}
    });
    })
  


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
