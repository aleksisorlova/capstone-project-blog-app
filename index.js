import express from "express";
import bodyParser from "body-parser";
import _ from 'lodash';
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;

const uploadFolder = './public/images/';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '_' + file.originalname)
    }
});

const upload = multer({storage: storage});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const homeStartingContent = "Welcome to our simple food blog! Here you can create, edit, and delete your posts.";

const aboutContent = "Hello! This is a foodie blog. Here you can write down your recipes and share them with other users. " +
    "You can also look for inspiration among other people's recipes. We hope you can find something unusual for yourself.";

const contactContent = "We're open for any suggestion or just to have a chat";

const lasagnaContent = "Start by making a sauce of ground beef, celery, onion and a tomato sauce or juice, you can also add 100 ml of dry red wine and evaporate it." +
    "Leave this to simmer over low heat. In the meantime, you can make a béchamel sauce with flour, butter and milk. Add a little salt, pepper and a pinch of nutmeg at the end. We use grated mozzarella and parmesan - as well as the tomato mixture, this combination of cheeses gives the lasagna a wonderful taste!" +
    "Then you just need to assemble the dish. A cup of meat sauce, a layer of lasagna sheets, more sauce, béchamel sauce and then a layer of cheese. Repeat until you have three layers and have used up all the ingredients." +
    "Place the dish in the oven at 180 degrees for 40-50 minutes until you have a delicious golden crust.";

const pilafContent = "Cut the onion into half rings, put it to fry. After it becomes golden brown, add the meat to it (it is best to use lamb or beef). " +
    "Fry well and add the carrots cut into strips. The ideal seasoning for pilaf is zira, add it, pour water and leave to simmer for one hour, or better one and a half. When that time has passed, add the washed rice, a head of garlic and spices. " +
    "Cook until the rice absorbs all the liquid and becomes soft. Turn off the stove and leave to infuse for another half an hour, and then enjoy.";

const wingsContent = "Preheat the oven to 200 degrees, place a deep baking tray underneath, and a wire rack above it. Cut off the outer phalanges of the wings and transfer them to a large bowl." +
    "Pour 2 tbsp. of oil over the wings, season with 1 tsp. of salt and 1 tsp. of dried garlic. Mix and place on the wire rack. Place the wings in the oven and bake for 50 minutes, turning them occasionally." +
    "In a small saucepan, mix 3 tbsp. of hot ketchup and 2 tbsp. of honey, bring to the boil and add 100 g of butter to the mixture. Cook for about 2 minutes, until the butter has completely melted and the amount of sauce has reduced slightly." +
    "Remove the wings from the oven, transfer to a bowl and pour over the sauce. Stir to evenly coat all the pieces.\n" +
    "Return the wings to the rack and cook for another 3-5 minutes, until the sauce caramelizes. Be careful not to burn the wings. Serve the wings hot with the vegetables and ranch dressing."

let posts = [
    {
        title: "Lasagna",
        name : "Aleksa",
        content: lasagnaContent,
        imagePath: uploadFolder + 'lasagna.jpg',
    },
    {
        title: "Pilaf",
        name : "Aleksa",
        content: pilafContent,
        imagePath: uploadFolder + 'pilaf.jpg',
    },
    {
        title: "Baked Buffalo Chicken Wings",
        name : "Aleksa",
        content: wingsContent,
        imagePath: uploadFolder + 'wings.jpg',
    }
];

app.get("/", (req, res) => {
    res.render("home.ejs", {
        homeStartingContent: homeStartingContent,
        posts: posts
    });
    // console.log(posts);
})

app.get("/about", (req, res) => {
    res.render("about.ejs", {
        aboutContent: aboutContent
    });
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs", {
        contactContent: contactContent
    });
});

app.get("/compose", (req, res) => {
    res.render("compose.ejs");
})

app.get("/edit", (req, res) => {
    res.render("edit.ejs");
})

app.post("/compose", upload.single('imagePost'), (req, res) => {
    let fileName = "";
    console.log(req.file);
    if (req.file) {
        console.log(`File uploaded successfully!`);
        fileName = req.file.filename;
    } else {
        console.log('File upload failed.');
    }
    const inputText = {
        title: req.body.titleText,
        name: req.body.nameText,
        content: req.body.postText,
        imagePath: uploadFolder + fileName
    };
    posts.push(inputText);
    res.redirect("/");
})

app.get("/posts/:postId", (req, res) => {
    const requestedTitle = _.lowerCase(req.params.postId);

    posts.forEach((post) => {
        const storedTitle = _.lowerCase(post.title);

        if (storedTitle === requestedTitle) {
            res.render("post.ejs", {
                title: post.title,
                name: post.name,
                imagePath: post.imagePath,
                content: post.content
            });
        }
    })
})

app.get(["/posts/public/images/:imageName", "/public/images/:imageName", "/edit/public/images/:imageName"], (req, res) => {
    const streamReadFile = fs.createReadStream(uploadFolder + req.params.imageName);
    streamReadFile.pipe(res);
});

app.get("/edit/:postId", (req, res) => {
    const reqTitle = req.params.postId;
    let index = posts.findIndex(item => item.title === reqTitle);
    res.render("edit.ejs", {
        editTitle: posts[index].title,
        editName: posts[index].name,
        editContent: posts[index].content,
        editImage: posts[index].imagePath,
    });
});

app.post("/edit/:postId", upload.single("editedImage"), (req, res) => {
    const reqTitle = req.params.postId;
    let index = posts.findIndex(item => item.title === reqTitle);
    let oldImagePath = posts[index].imagePath;
    let fileName = "";
    if (req.file) {
        console.log(`File uploaded successfully!`);
        fileName = uploadFolder + req.file.filename;
    } else {
        console.log('File upload failed.');
    }
    if (oldImagePath !== fileName && fileName.length !== 0) {
        fs.unlinkSync(oldImagePath);
        oldImagePath = fileName;
    }
    const editedPost = {
        title: req.body.editedTitle,
        name: req.body.editedName,
        content: req.body.editedText,
        imagePath: oldImagePath
    };
    posts.splice(index, 1, editedPost);
    res.render("post.ejs", {
        title: editedPost.title,
        name: editedPost.name,
        content: editedPost.content,
        imagePath: editedPost.imagePath
    });
});

app.post("/delete/:postId", (req, res) => {
    const reqTitle = req.params.postId;
    let index = posts.findIndex(item => item.title === reqTitle);
    fs.unlinkSync(posts[index].imagePath);
    posts.splice(index, 1);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
