const bodyParser        = require('body-parser');
const ejs               = require('ejs');
const mongoose          = require('mongoose');
const express           = require('express');
const app               = express();
const methodOverride    = require('method-override');
const { json } = require('body-parser');


//Connection string 
const url=process.env.MONGO_URL || "mongodb://localhost:27017/taskvayuz";




//Db connection
mongoose.connect('mongodb+srv://kapil123:kapil123@cluster0.wjkqg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}
) 
  .then(() => console.log('Connected to MongoDB successfully....'))
  .catch(err => console.error('Could not connect to MongoDB....'));


    app.set("view engine", "ejs");
    app.use(json());
    app.use(express.static("public"));
    app.use(express.static(__dirname + "/public"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOverride("_method"));
  

    const userSchema = new mongoose.Schema({
        name: {type:String,minLength:2,maxLength:32},
        email: {type:String,minLength:2,maxLength:64},
        password: {type:String,minLength:2,maxLength:64},
        date:Date,
        image:String
    });
    const User = mongoose.model("User", userSchema);
    
    app.get("/", (req, res) => {
        res.render("form")
    })
    app.get("/users", (req, res) => {
        User.find({}, (err, foundUsers)=> {
            if(err) {
                console.log(err);
            }
            else {
                res.render("list", {User:foundUsers});
            }
        });
    });    

    app.post("/signup", (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const userdata = {name:name, email:email, password:password};
      
        User.create(userdata, function(err,newuser) {
            if(err) {
                res.send(err);
            }
            else {
                res.render("date", {user:newuser});
            }
        });
    });

    
    app.put("/date/:id", (req, res) => {
        const id = req.params.id;
        console.log(id);
        const date = req.body.date;
        console.log(date);
        User.findByIdAndUpdate(id,{$set:{date:date}},  (err, user) => {
            if (err) {
                res.send(err);
            }
            else {
                console.log(user)
                res.render("image", {user:user});
            }
        })
    })

    app.put("/image/:id", (req, res) => {
        const id = req.params.id;
        console.log(id)
        const image = req.body.image;
        console.log(image);
        User.findByIdAndUpdate(id,{$set:{image:image}},  (err, user) => {
            if(err) {
                res.send(err);
            }
            else {
              User.findById(id,(err,user)=>{
                  if(err){
                      res.send(err)
                  }
                  else
                  {
                      res.render("profile", {user:user});
                  }
              })               
            }
        })
    })

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Express server started at port  : ${port}`);
});