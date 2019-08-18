import { handleResponse } from "../utils/handleRespnse";
import { authHeader } from "../utils/authHeader";

export const replyServices = {
  post,
  postVote,
  getById
};

function post(reply, postId) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ reply, postId })
  };

  return fetch("http://localhost:8000/api/replies", requestOptions)
    .then(handleResponse)
    .catch(error => {
      throw error;
    });
}

function postVote(replyId, isUp) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ replyId, isUp })
  };

  return fetch("http://localhost:8000/api/replies/votes", requestOptions)
    .then(handleResponse)
    .catch(error => {
      throw error;
    });
}

function getById(replyId) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };

  return fetch("http://localhost:8000/api/replies/" + replyId, requestOptions)
    .then(handleResponse)
    .catch(error => {
      throw error;
    });
}
