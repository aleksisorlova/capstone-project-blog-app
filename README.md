# Foodie Blog App
Simple blog using using Node.js, Express.js, and EJS. The application will allow users to create and view blog posts. 
Posts will not persist between sessions as no database will be used in this version of the application.

## Features
+ Create new posts with title, your name, content and your photo
+ Users can view their posts on homepage
+ Edit or delete posts

## Installation
1. Clone the repository:
``` 
https://github.com/aleksisorlova/foodie-blog-app.git
```
2. Install dependencies:
``` 
npm install
```
3. Run the server:
``` 
node index.js
```
4. Open browser and visit:
``` 
http://localhost:3000
```

## Project Structure
```
foodie-blog-app/
│
├── public/
│ ├── css/
│ │ └── styles.css
│ └── images/
│   └── color-modes.js
│
├── views/
│ ├── partials/
│ │ ├── footer.ejs
│ │ └── header.ejs
│ ├── about.ejs
│ ├── compose.ejs
│ ├── contact.ejs
│ ├── edit.ejs
│ ├── home.ejs
│ └── post.ejs
│
├── README.md
├── index.js
└── package.json
```
## Technologies
+ Node.js
+ Express
+ EJS(Embedded JavaScript templates)
+ Bootstrap

## Notes
All posts are stored in memory(not database yet). If restart server they will be lost.