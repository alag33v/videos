"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const db_1 = require("./db");
var Resolutions;
(function (Resolutions) {
    Resolutions["P144"] = "P144";
    Resolutions["P240"] = "P240";
    Resolutions["P360"] = "P360";
    Resolutions["P480"] = "P480";
    Resolutions["P720"] = "P720";
    Resolutions["P1080"] = "P1080";
    Resolutions["P1440"] = "P1440";
    Resolutions["P2160"] = "P2160";
})(Resolutions || (Resolutions = {}));
exports.videosRouter = (0, express_1.Router)({});
exports.videosRouter.get("/", (req, res) => {
    res.send(db_1.db.videos);
});
exports.videosRouter.post("/", (req, res) => {
    const errorsMessages = [];
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    if (!title ||
        typeof title !== "string" ||
        !title.trim() ||
        title.length > 40) {
        errorsMessages.push({
            message: "Title is incorrect;",
            field: "title",
        });
    }
    if (!author ||
        typeof author !== "string" ||
        !author.trim() ||
        author.length > 20) {
        errorsMessages.push({
            message: "Author is incorrect;",
            field: "author",
        });
    }
    if (!availableResolutions ||
        !availableResolutions.every((r) => Object.keys(Resolutions).includes(r))) {
        errorsMessages.push({
            message: "AvailableResolutions is incorrect;",
            field: "availableResolutions",
        });
    }
    if (errorsMessages.length != 0) {
        res.status(400).send({ errorsMessages: errorsMessages });
    }
    else {
        const createdAt = new Date();
        let publicationDate = new Date();
        publicationDate.setDate(publicationDate.getDate() + 1);
        const newVideo = {
            id: +new Date(),
            title,
            author,
            availableResolutions,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate.toISOString(),
        };
        db_1.db.videos.push(newVideo);
        res.status(201).send(newVideo);
    }
});
exports.videosRouter.get("/:videoId", (req, res) => {
    let video = db_1.db.videos.find((p) => p.id === +req.params.videoId);
    if (video) {
        res.send(video);
    }
    else {
        res.send(404);
    }
});
exports.videosRouter.put("/:videoId", (req, res) => {
    const errorsMessages = [];
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = req.body.publicationDate;
    if (!title ||
        typeof title !== "string" ||
        !title.trim() ||
        title.length > 40) {
        errorsMessages.push({
            message: "Title is incorrect;",
            field: "title",
        });
    }
    if (!author ||
        typeof author !== "string" ||
        !author.trim() ||
        author.length > 20) {
        errorsMessages.push({
            message: "Author is incorrect;",
            field: "author",
        });
    }
    if (!availableResolutions ||
        !availableResolutions.every((r) => Object.keys(Resolutions).includes(r))) {
        errorsMessages.push({
            message: "AvailableResolutions is incorrect;",
            field: "availableResolutions",
        });
    }
    if (!canBeDownloaded || typeof canBeDownloaded !== "boolean") {
        errorsMessages.push({
            message: "CanBeDownloaded is incorrect;",
            field: "canBeDownloaded",
        });
    }
    if (!minAgeRestriction ||
        typeof minAgeRestriction !== "number" ||
        minAgeRestriction < 1 ||
        minAgeRestriction > 18) {
        errorsMessages.push({
            message: "MinAgeRestriction is incorrect;",
            field: "minAgeRestriction",
        });
    }
    if (!publicationDate ||
        typeof publicationDate !== "string" ||
        !publicationDate.trim()) {
        errorsMessages.push({
            message: "PublicationDate is incorrect;",
            field: "publicationDate",
        });
    }
    if (errorsMessages.length != 0) {
        res.status(400).send({ errorsMessages: errorsMessages });
    }
    else {
        let video = db_1.db.videos.find((p) => p.id === +req.params.videoId);
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
    }
});
exports.videosRouter.delete("/:videoId", (req, res) => {
    const id = +req.params.videoId;
    const newVideo = db_1.db.videos.filter((p) => p.id !== id);
    if (newVideo.length < db_1.db.videos.length) {
        db_1.db.videos = newVideo;
        res.send(204);
    }
    else {
        res.send(404);
    }
});
