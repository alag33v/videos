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
    return res
      .status(400)
      .send(showError("Failed to create new video", "title"));
  }
  if (!author?.trim() || author.length > 20) {
    return res
      .status(400)
      .send(showError("Failed to create new video", "author"));
  }
  if (!availableResolutions.length) {
    return res
      .status(400)
      .send(showError("Failed to create new video", "availableResolutions"));
  }

  const newVideo: VideoType = {
    id: Date.now(),
    title,
    author,
    canBeDownloaded: canBeDownloaded ?? false,
    minAgeRestriction: minAgeRestriction ?? null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(
      new Date().setDate(new Date().getDate() + 1)
    ).toISOString(),
    availableResolutions,
  };

  videos.push(newVideo);
  res.status(201).send(newVideo);
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
    const { title, author, availableResolutions } = req.body;

    if (!title?.trim() || title.length > 40) {
      return res
        .status(400)
        .send(showError("Failed to update new video", "title"));
    }
    if (!author?.trim() || author.length > 20) {
      return res
        .status(400)
        .send(showError("Failed to update new video", "author"));
    }
    if (!availableResolutions.length) {
      return res
        .status(400)
        .send(showError("Failed to update new video", "availableResolutions"));
    }

    videos[videoIndex] = {
      ...videos[videoIndex],
      ...updatedVideo,
    };
    res.status(204);
  } else {
    res.status(404);
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
