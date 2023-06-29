import { Request, Response, Router } from "express";
import { db } from "./db";
import { log } from "console";

enum Resolutions {
  P144 = "P144",
  P240 = "P240",
  P360 = "P360",
  P480 = "P480",
  P720 = "P720",
  P1080 = "P1080",
  P1440 = "P1440",
  P2160 = "P2160",
}
export const videosRouter = Router({});

videosRouter.get("/", (req: Request, res: Response) => {
  res.send(db.videos);
});

videosRouter.post("/", (req: Request, res: Response) => {
  const errorsMessages: Object[] = [];
  const title = req.body.title;
  const author = req.body.author;
  const availableResolutions = req.body.availableResolutions;
  if (
    !title ||
    typeof title !== "string" ||
    !title.trim() ||
    title.length > 40
  ) {
    errorsMessages.push({
      message: "Title is incorrect;",
      field: "title",
    });
  }
  if (
    !author ||
    typeof author !== "string" ||
    !author.trim() ||
    author.length > 20
  ) {
    errorsMessages.push({
      message: "Author is incorrect;",
      field: "author",
    });
  }
  if (
    !availableResolutions ||
    !availableResolutions.every((r: any) =>
      Object.keys(Resolutions).includes(r)
    )
  ) {
    errorsMessages.push({
      message: "AvailableResolutions is incorrect;",
      field: "availableResolutions",
    });
  }

  if (errorsMessages.length != 0) {
    res.status(400).send({ errorsMessages: errorsMessages });
  } else {
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

    db.videos.push(newVideo);
    res.status(201).send(newVideo);
  }
});
videosRouter.get("/:videoId", (req: Request, res: Response) => {
  let video = db.videos.find((p) => p.id === +req.params.videoId);
  if (video) {
    res.send(video);
  } else {
    res.send(404);
  }
});
videosRouter.put("/:videoId", (req: Request, res: Response) => {
  const errorsMessages: Object[] = [];
  const title = req.body.title;
  const author = req.body.author;
  const availableResolutions = req.body.availableResolutions;
  const canBeDownloaded = req.body.canBeDownloaded;
  const minAgeRestriction = req.body.minAgeRestriction;
  const publicationDate = req.body.publicationDate;
  if (
    !title ||
    typeof title !== "string" ||
    !title.trim() ||
    title.length > 40
  ) {
    errorsMessages.push({
      message: "Title is incorrect;",
      field: "title",
    });
  }
  if (
    !author ||
    typeof author !== "string" ||
    !author.trim() ||
    author.length > 20
  ) {
    errorsMessages.push({
      message: "Author is incorrect;",
      field: "author",
    });
  }
  if (
    !availableResolutions ||
    !availableResolutions.every((r: any) =>
      Object.keys(Resolutions).includes(r)
    )
  ) {
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
  if (
    !minAgeRestriction ||
    typeof minAgeRestriction !== "number" ||
    minAgeRestriction < 1 ||
    minAgeRestriction > 18
  ) {
    errorsMessages.push({
      message: "MinAgeRestriction is incorrect;",
      field: "minAgeRestriction",
    });
  }
  if (
    !publicationDate ||
    typeof publicationDate !== "string" ||
    !publicationDate.trim()
  ) {
    errorsMessages.push({
      message: "PublicationDate is incorrect;",
      field: "publicationDate",
    });
  }
  if (errorsMessages.length != 0) {
    res.status(400).send({ errorsMessages: errorsMessages });
  } else {
    let video = db.videos.find((p) => p.id === +req.params.videoId);
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
  }
});

videosRouter.delete("/:videoId", (req: Request, res: Response) => {
  const id = +req.params.videoId;
  const newVideo = db.videos.filter((p) => p.id !== id);
  if (newVideo.length < db.videos.length) {
    db.videos = newVideo;
    res.send(204);
  } else {
    res.send(404);
  }
});
