const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  // console.log(title, url, techs);
  repositories.push(repository);

  // return response.send();
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs, likes} = request.body;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found"})
  }

  const repositoryLikes = repositories[repositoryIndex].likes;


  // Acho que deveria receber um erro aqui, dizendo que não era possível enviar likes.
  if(likes){
    return response.status(400).json({
      likes: repositoryLikes
    });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositoryLikes,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found"})
  }

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  //console.log(id);

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found"})
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return response.json({
    likes: repositories[repositoryIndex].likes
  });
});

module.exports = app;
