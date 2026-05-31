const upload = require("../../conf/upload/multer");
const { uploadFiles, getUploads } = require("./controllers");
const Router = require("express").Router();

Router.post("/", upload.array("files"), uploadFiles);
Router.post("/list", getUploads);

module.exports = Router;
