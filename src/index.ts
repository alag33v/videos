import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { VideoResolution, VideoType } from "./types";

const app = express();
const port = 3000;

app.use(bodyParser.json());

const videos: VideoType[] = [];

app.get("/videos", (req: Request, res: Response) => {
  res.status(200).send(videos);
});

app.post("/videos", (req: Request, res: Response) => {
  const errorsMessages: Object[] = [];
  const { title, author, availableResolutions } = req.body;

  if (typeof title !== "string" || !title?.trim() || title.length > 40) {
    errorsMessages.push({
      message: "Title is incorrect",
      field: "title",
    });
  }
  if (typeof author !== "string" || !author?.trim() || author.length > 20) {
    errorsMessages.push({
      message: "Author is incorrect",
      field: "author",
    });
  }
  if (
    availableResolutions?.length &&
    !availableResolutions.every((resolution: any) =>
      Object.values(VideoResolution).includes(resolution)
    )
  ) {
    errorsMessages.push({
      message: "Failed to update new video",
      field: "availableResolutions",
    });
  }

  if (errorsMessages.length) {
    return res.status(400).send({ errorsMessages });
  }

  const newVideo: VideoType = {
    id: Date.now(),
    title,
    author,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(
      new Date().setDate(new Date().getDate() + 1)
    ).toISOString(),
    availableResolutions,
  };

  videos.push(newVideo);
  return res.status(201).send(newVideo);
});

app.delete("/testing/all-data", (req: Request, res: Response) => {
  videos.splice(0, videos.length);
  res.send(204);
});

app.get("/videos/:videoId", (req: Request, res: Response) => {
  const id = parseInt(req.params.videoId);
  const video = videos.find((v: VideoType) => v.id === id);

  if (video) {
    res.status(200).send(video);
  } else {
    res.send(404);
  }
});

app.put("/videos/:videoId", (req: Request, res: Response) => {
  console.log("req", req);
  console.log("res", res);
  const errorsMessages: Object[] = [];
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
  if (
    availableResolutions?.length &&
    !availableResolutions.every((r: any) =>
      Object.keys(VideoResolution).includes(r)
    )
  ) {
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
  if (
    minAgeRestriction &&
    (typeof minAgeRestriction !== "number" ||
      minAgeRestriction < 1 ||
      minAgeRestriction > 18)
  ) {
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
  } else {
    res.send(404);
  }
});

app.delete("/videos/:videoId", (req: Request, res: Response) => {
  const id = parseInt(req.params.videoId);
  const videoIndex = videos.findIndex((v: VideoType) => v.id === id);

  if (videoIndex !== -1) {
    videos.splice(videoIndex, 1);
    res.send(204);
  } else {
    res.send(404);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
