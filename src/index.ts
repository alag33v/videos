import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { VideoType } from "./types";

const app = express();
const port = 3000;

app.use(bodyParser.json());

const videos: VideoType[] = [];
const showError = (message: string, field: string) => {
  return {
    errorsMessages: [
      {
        message,
        field,
      },
    ],
  };
};

app.get("/videos", (req: Request, res: Response) => {
  res.status(200).send(videos);
});

app.post("/videos", (req: Request, res: Response) => {
  const {
    title,
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
  } = req.body;

  if (!title?.trim() || title.length > 40) {
    res.status(400).send(showError("Failed to create new video", "title"));
  } else if (!author?.trim() || author.length > 20) {
    res.status(400).send(showError("Failed to create new video", "author"));
  } else if (!availableResolutions.length) {
    res
      .status(400)
      .send(showError("Failed to create new video", "availableResolutions"));
  } else {
    const newVideo: VideoType = {
      id: Date.now(),
      title,
      author,
      canBeDownloaded: canBeDownloaded !== undefined ? canBeDownloaded : true,
      minAgeRestriction:
        minAgeRestriction !== undefined ? minAgeRestriction : null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
      availableResolutions,
    };

    videos.push(newVideo);
    res.status(201).send(newVideo);
  }
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
  const id = parseInt(req.params.videoId);
  const updatedVideo = req.body;
  const videoIndex = videos.findIndex((v: VideoType) => v.id === id);

  if (videoIndex !== -1) {
    videos[videoIndex] = {
      ...videos[videoIndex],
      ...updatedVideo,
    };
    res.status(204);
  } else {
    res.status(400).send(showError("video not found", "id"));
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
