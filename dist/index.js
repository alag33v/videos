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
const showError = (message, field) => {
    return {
        errorsMessages: [
            {
                message,
                field,
            },
        ],
    };
};
app.get("/videos", (req, res) => {
    res.status(200).send(videos);
});
app.post("/videos", (req, res) => {
    const errorsMessages = [];
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, } = req.body;
    if (typeof title !== "string" || !(title === null || title === void 0 ? void 0 : title.trim()) || title.length > 40) {
        errorsMessages.push({
            message: "Failed to update new video",
            field: "title",
        });
    }
    if (typeof author !== "string" || !(author === null || author === void 0 ? void 0 : author.trim()) || author.length > 20) {
        errorsMessages.push({
            message: "Failed to update new video",
            field: "author",
        });
    }
    if (availableResolutions.length &&
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
        canBeDownloaded: canBeDownloaded !== null && canBeDownloaded !== void 0 ? canBeDownloaded : false,
        minAgeRestriction: minAgeRestriction !== null && minAgeRestriction !== void 0 ? minAgeRestriction : null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        availableResolutions,
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
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
    const errorsMessages = [];
    const id = parseInt(req.params.videoId);
    const updatedVideo = req.body;
    const videoIndex = videos.findIndex((v) => v.id === id);
    if (videoIndex !== -1) {
        const { title, author, availableResolutions } = req.body;
        if (typeof title !== "string" || !(title === null || title === void 0 ? void 0 : title.trim()) || title.length > 40) {
            errorsMessages.push({
                message: "Failed to update new video",
                field: "title",
            });
        }
        if (typeof author !== "string" || !(author === null || author === void 0 ? void 0 : author.trim()) || author.length > 20) {
            errorsMessages.push({
                message: "Failed to update new video",
                field: "author",
            });
        }
        if (availableResolutions.length &&
            !availableResolutions.every((resolution) => Object.values(types_1.VideoResolution).includes(resolution))) {
            errorsMessages.push({
                message: "Failed to update new video",
                field: "availableResolutions",
            });
        }
        if (errorsMessages.length) {
            return res.status(400).send({ errorsMessages });
        }
        videos[videoIndex] = Object.assign(Object.assign({}, videos[videoIndex]), updatedVideo);
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
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
