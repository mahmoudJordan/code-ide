const express = require('express');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const cors = require('cors');


const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(connectLiveReload());



// Serve static files from the 'src' directory
app.use(express.static('src'));



app.get('/projects/:identifier', async (req, res, next) => {
  const { identifier } = req.params;
  const projectPath = path.join(__dirname, 'projects');
  try {
    const fileInfo = await getFileStructure(projectPath , `/${identifier}`);
    res.json(fileInfo);
  } catch (error) {
    next(createError(404, 'Project not found'));
  }
});

app.get('/projects/:identifier/file/:requiredFilePath', async (req, res, next) => {
  const { identifier, requiredFilePath } = req.params;
  const filePath = path.join(__dirname, 'projects', decodeURI(requiredFilePath));
  try {
    const fileContent = await readFile(filePath, 'utf8');
    res.send(fileContent);
  } catch (error) {
    next(createError(404, 'File not found'));
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json("error");
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



async function getFileStructure(rootDir, dir) {
  const fullPath = path.join(rootDir, dir);
  const files = await readdir(fullPath);
  const fileInfo = [];

  for (const file of files) {
    const filePath = path.join(fullPath, file);
    const stats = await stat(filePath);
    const isDirectory = stats.isDirectory();
    const relativePath = path.relative(rootDir, filePath);
    const info = { name: file, type: isDirectory ? 'folder' : 'file', filePath: relativePath };

    if (isDirectory) {
      info.children = await getFileStructure(rootDir, path.join(dir, file));
    }

    fileInfo.push(info);
  }

  return fileInfo;
}
