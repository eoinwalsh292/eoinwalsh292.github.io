"use strict";

//required modules
    let express = require("express");
    import { urlencoded } from "body-parser";
    import { createConnection } from "mysql";
    import session from "express-session";
    import fileUpload from "express-fileupload";
    let port=8000;


// Create SQL connection and check
    /*let con = mysql.createConnection({
        host: "mysql.scss.tcd.ie",
        user: "walshe51",
        password: "Kai7chor",
        database: "walshe51_db"
    });*/
    let con = createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "password",
        database: "projectschema"
    });

    con.connect(function(err) {
        if (err) console.log("Error connecting to Database:\n"+ err);
        else console.log("Connected to Database");
    });

    // Check if database has all necessary tables etc., if not they are created
    con.query("SHOW TABLES",function(err,results){
        console.log(results);
    });


//Create our express app object
    let app = express();
//Configure middleware
    app.use(express.static("static"));
    app.set("view-engine", "ejs");
    app.set("views", "templates");
    app.use(urlencoded({extended: true}));
    app.use(session({secret: "randomsequence1231ti.#;,;rgs.h',orun",
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 60000}}));
    app.use(fileUpload());



//##########################################################################//
// Configure App Routes

// Typical landing pages push user to image display
    app.get("/index", function(req,res){
        res.redirect("/imagegrid");
    });
    app.get("/", function(req,res){
        res.redirect("/imagegrid");
    });


// Login page - creates user session when correct pw entered

    // GET rendering the login page
    app.get("/login", function (req, res) {
        res.render("login.ejs");
    });

    // POST taking login info and checking against DB info
    app.post("/login", function(req, res) {
        let user = req.body.username;
        let pass = req.body.password;
        let sql = `SELECT password FROM users WHERE username="${user}"`;

        con.query(sql,function(err,results){
            if(err){
                res.render("error.ejs",{"msg":"Database Error Occurred!"});
            }else{
                if(pass === results[0].password){
                    req.session.user = req.body.username;
                    req.session.login = 1;
                    res.redirect("/profile");
                }else{
                    res.render("error.ejs",{"msg":"Incorrect Login"});
                }
            }
        });
    });


// Upload links - if not signed in, you are brought to register and login

    // GET checks for login status; redirects to login page if not logged in so non-users cannot upload
    app.get("/upload",function(req,res){
        if(req.session.login == 1) res.render("profile.ejs",{"username":req.session.user});
        else res.render("login.ejs");
    });

    // POST takes username, filename, user entered title, and current time for storing with uploaded image
    app.post("/upload",function(req,res){
        let newId, username = req.session.user;
        let file = req.files.myimage; let title = req.body.mytitle; let time = new Date();
        time = time.toUTCString();
        let sqlId = `SELECT MAX(id) AS maxID FROM images`; // Finds latest index in DB table so new image will not overwrite

        con.query(sqlId,function(err,results){
            if(err) res.render("error.ejs",{"msg":"Database Error Occurred!"});

            if(typeof results[0].maxID!='number') newId = 0; // Checks if table is empty; if so it starts from 0

            newId = results[0].maxID + 1; // Ensures no overwrite

            let toggle = 0, fileExt = new Array;

            // For loop scans through filename until '.' is found, then records the characters after to capture the file extension
            // Done to rename images in storage to their index no. while preserving correct extension
            for(let i of file.name) {
                if(toggle!=0) {
                    fileExt[toggle]=file.name[i];
                    toggle++;
                }
                else if(file.name[i] == ".") {
                    fileExt[toggle]=file.name[i];
                    toggle++;
                }
            }
            fileExt=fileExt.join("");
            file.mv("static/images/"+newId+fileExt);

            // Populates DB with relevant info for uploaded file, then takes user to image page
            con.query("INSERT INTO images (id,filename,title,time,username) VALUES ('"+newId+"','"+newId+fileExt+"','"+title+"','"+time+"','"+username+"')",function(err,results){
                if(err) res.render("error.ejs",{"msg":"Database Error Occurred! Code: \n"+err});
                else res.render("uploads.ejs", {"filename": newId+fileExt});
            });
        });
    });


// Registration page - checks are also done on the info entered

    // GET checks if user is logged in; if so the user is taken to their profile, if not user can register
    app.get("/register",function(req,res){
        if(req.session.login==1) res.redirect("/profile");
        else res.render("register.ejs");
    });

    // POST takes entered info and checks if username is not taken; if not the new user is created
    app.post("/register",function(req,res){
        let user = req.body.username, pass = req.body.password, first = req.body.firstname, last = req.body.surname;

        let sql = "INSERT INTO users (username,firstname,surname,password) VALUES ('"+user+"','"+first+"','"+last+"','"+pass+"')";

        let sqlcheck = "SELECT username FROM users";
        con.query(sqlcheck,function(err,results){
            console.log(results);
            if(err) res.render("error.ejs",{"msg":"Database Error Occurred! Code: \n"+err});
            else if(results.username == req.body.username) res.render("error.ejs",{"msg":"That username is taken!"});
            else {
                con.query(sql, function (err, results) {
                    res.redirect("/index");
                });
            }
        });
    });


// Page for personal user and uploading photos

    // GET takes user to their profile page if logged in, if not they must log in
    app.get("/profile", function(req,res){
        if(req.session.login == 1) res.render("profile.ejs", {"username": req.session.user});
        else res.redirect("/login");
    });


// Main page for all images

    //Page for displaying all images (up to 10 per page)
    app.get("/images",function(req,res){
        res.redirect("/imagegrid");
        let limit = 10;
        let sql1 = "SELECT id FROM images LIMIT "+limit;

        if(req.session.login == 1){
            // Render comment INPUTS

        }
        let username = req.session.username, comment = req.body.comment, imageid=req.body.imageid;
        let sql2 = "INSERT INTO social (commentid,id,username,comment) VALUES ('"+commentid+"','"+imageid+"','"+username+"','"+comment+"')";

        let sqlname = "SELECT username FROM social WHERE id="+imageid;
    });

// Logout button on each page

    // GET simple routing to destroy session and redirect to main
    app.get("/logout", function(req,res){
        req.session.destroy();
        res.redirect("/");
    });


// Single image page

    // GET displays single image based on ID no. in URL
    app.get("/images/:id",function(req,res){
        //Checks user status to see if user is allowed to comment
        let id=req.params.id, social;
        if(req.session.login == 1){
            social = `<p>Leave a comment below:</p>\n<form action="`+id+`/comment" method="post" enctype="multipart/form-data">\n<input type="text" name="comment" value="Comment here...">\n<input type="submit" value="Send comment">\n</form>`;
        }else{
            social = `<p>Please <a href="../login">login</a> or <a href="../register">register</a> to comment!</p>`;
        }

        // First gathers image info then comments for that image
        let sql1 = `SELECT filename,title,time,username FROM images WHERE id=`+id;
        let sql2 = `SELECT username,comment FROM social WHERE id=`+id;

        // Gathering image info (and replacing title if left empty)
        con.query(sql1,function(err,imageRes){
            if(err) res.render("error.ejs",{"msg":"Database Error Occurred! Code: \n"+err});
            else{
                if(imageRes.title == null) imageRes.title = "No Title";
                
                // Gathering comments for particular image
                con.query(sql2,function(err,socialRes){
                    if(err) res.render("error.ejs",{"msg":"Database Error Occurred! Code: \n"+err});

                    else{
                        // For loop scans through comment DB and populates variable with necessary HTML and content to pass through
                        let commentContent = "User Comments";
                        for(let i of socialRes){
                            if(typeof(socialRes[i].comment) == 'string') commentContent += "<p>"+socialRes[i].comment+",\n by "+socialRes[i].username+"</p>";
                        }

                        // Once comments are populated, page is populated and displayed
                        res.render("singleimage.ejs",{
                            "id":id,
                            "imagetitle":imageRes[0].title,
                            "filename":imageRes[0].filename,
                            "time":imageRes[0].time,
                            "username":imageRes[0].username,
                            "socialfeatures":social,
                            "comment":commentContent});
                    }
                });

            }
        });
    });

    // POST route for comments to be passed to DB with username attached
    app.post("/images/:id/comment",function(req,res){
        // First check is for creating unique comment ID
        let newId=0, comment = req.body.comment, id = req.params.id;
        let sqlId = `SELECT MAX(commentid) AS maxID FROM social`; // Finds latest index in DB table so new comment will not overwrite
        
        con.query(sqlId,function(err,results){
            if(err) res.render("error.ejs",{"msg":"Database Error Occurred!"});

            if(typeof results[0].maxID!='number'){ console.log(newId);newId = 0;console.log(newId);} // Checks if table is empty; if so it starts from 0
            
            newId = results[0].maxID + 1; // Ensures no overwrite

            // Once comment ID is created, DB entry is populated with imageID, username of commenter, and the comment
            con.query("INSERT INTO social (commentid,id,username,comment) VALUES ('"+newId+"',"+id+",'"+req.session.user+"','"+comment+"')",function(err,results){
                if(err) res.render("error.ejs",{"msg":"Database Error Occurred! Code: \n"+err});
                else{
                    res.redirect("/images/"+id);
                }
            });
        });
        
    });

// ImageGrid page (like explore page on Instagram)

    // GET 
    app.get("/imagegrid",function(req,res){
        let grid = "<h2>User Uploaded Images</h2>";
        let sql = `SELECT id,filename FROM images LIMIT 20`;
        con.query(sql,function(err,results){
            if(err) res.render("error.ejs",{"msg":"Database Error Occurred! Code: \n"+err});
            else {
                for(let i of results) {
                    grid += '<a href="/images/'+results[i].id+'"><img class="gridImg" src="/images/' + results[i].filename + '"></a>';
                }
                res.render("images.ejs",{"grid":grid});
            }
        });

    });

//##########################################################################//

app.listen(port);

console.log("Server running on http://localhost:"+port);