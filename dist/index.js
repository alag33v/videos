"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const types_1 = require("./types");
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
const videos = [];
app.get("/videos", (req, res) => {
    res.status(200).send(videos);
});
app.post("/videos", (req, res) => {
    const errorsMessages = [];
    const { title, author, availableResolutions } = req.body;
    if (typeof title !== "string" || !(title === null || title === void 0 ? void 0 : title.trim()) || title.length > 40) {
        errorsMessages.push({
            message: "Title is incorrect",
            field: "title",
        });
    }
    if (typeof author !== "string" || !(author === null || author === void 0 ? void 0 : author.trim()) || author.length > 20) {
        errorsMessages.push({
            message: "Author is incorrect",
            field: "author",
        });
    }
    if ((availableResolutions === null || availableResolutions === void 0 ? void 0 : availableResolutions.length) &&
        !availableResolutions.every((resolution) => Object.values(types_1.VideoResolution).includes(resolution))) {
        errorsMessages.push({
            message: "Failed to update new video",
            field: "availableResolutions",
        });
    }
    if (errorsMessages.length) {
        return res.status(400).send({ errorsMessages });
    }
    const newVideo = {
        id: Date.now(),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        availableResolutions,
    };
    videos.push(newVideo);
    return res.status(201).send(newVideo);
});
app.delete("/testing/all-data", (req, res) => {
    videos.splice(0, videos.length);
    res.send(204);
});
app.get("/videos/:videoId", (req, res) => {
    const id = parseInt(req.params.videoId);
    const video = videos.find((v) => v.id === id);
    if (video) {
        res.status(200).send(video);
    }
    else {
        res.send(404);
    }
});
app.put("/videos/:videoId", (req, res) => {
    console.log("req", req);
    console.log("res", res);
    const errorsMessages = [];
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = req.body.publicationDate;
    if (typeof title !== "string" || !title.trim() || title.length > 40) {
        errorsMessages.push({
            message: "Title is incorrect;",
            field: "title",
        });
    }
    if (typeof author !== "string" || !author.trim() || author.length > 20) {
        errorsMessages.push({
            message: "Author is incorrect;",
            field: "author",
        });
    }
    if ((availableResolutions === null || availableResolutions === void 0 ? void 0 : availableResolutions.length) &&
        !availableResolutions.every((r) => Object.keys(types_1.VideoResolution).includes(r))) {
        errorsMessages.push({
            message: "AvailableResolutions is incorrect;",
            field: "availableResolutions",
        });
    }
    if (canBeDownloaded && typeof canBeDownloaded !== "boolean") {
        errorsMessages.push({
            message: "CanBeDownloaded is incorrect;",
            field: "canBeDownloaded",
        });
    }
    if (minAgeRestriction &&
        (typeof minAgeRestriction !== "number" ||
            minAgeRestriction < 1 ||
            minAgeRestriction > 18)) {
        errorsMessages.push({
            message: "MinAgeRestriction is incorrect;",
            field: "minAgeRestriction",
        });
    }
    if (publicationDate && typeof publicationDate !== "string") {
        errorsMessages.push({
            message: "PublicationDate is incorrect;",
            field: "publicationDate",
        });
    }
    if (errorsMessages.length) {
        return res.status(400).send({ errorsMessages: errorsMessages });
    }
    let video = videos.find((p) => p.id === +req.params.videoId);
    if (video) {
        video.title = title;
        video.author = author;
        video.availableResolutions = availableResolutions;
        video.canBeDownloaded = canBeDownloaded;
        video.minAgeRestriction = minAgeRestriction;
        video.publicationDate = publicationDate;
        res.send(204);
    }
    else {
        res.send(404);
    }
});
app.delete("/videos/:videoId", (req, res) => {
    const id = parseInt(req.params.videoId);
    const videoIndex = videos.findIndex((v) => v.id === id);
    if (videoIndex !== -1) {
        videos.splice(videoIndex, 1);
        res.send(204);
    }
    else {
        res.send(404);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
