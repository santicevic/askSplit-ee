const Router = require("express").Router;
const Reply = require("../models").Reply;
const UserReplyVote = require("../models").UserReplyVote;
const authorizationHelper = require("../helpers/authorizationHelper");

const router = Router();

router.get("/", (req, res) => {
  Reply.findAll().then(replies => {
    res.status(200).send(replies);
    res.end();
  });
});

router.post("/", authorizationHelper.verifyUser, (req, res) => {
  Reply.create({
    body: req.body.reply,
    postId: req.body.postId,
    userId: req.data.id
  })
    .then(reply => {
      res.status(201).send(reply);
      res.end();
    })
    .catch(error => {
      res.status(400).send();
    });
});

router.post("/reaction", authorizationHelper.verifyUser, (req, res) => {
  UserReplyVote.findOne({
    where: {
      replyId: req.body.replyId,
      userId: req.data.id
    }
  }).then(userReply => {
    if (userReply) {
      if (userReply.isUp === req.body.isUp) {
        userReply.destroy().then(() => {
          res.status(204);
          res.end();
        });
      } else {
        userReply.isUp = !userReply.isUp;
        userReply.save().then(editedUserReply => {
          res.status(202).send(editedUserReply);
          res.end();
        });
      }
    } else {
      UserReplyVote.create({
        ...req.body
      }).then(userReplyVote => {
        res.status(201).send(userReplyVote);
        res.end();
      });
    }
  });
});

router.get("/votes/:replyId", authorizationHelper.verifyUser, (req, res) => {
  UserReplyVote.findOne({
    where: { userId: req.data.id, replyId: req.params.replyId }
  })
    .then(vote => {
      res.status(200).send(vote);
    })
    .catch(error => res.status(400).send());
});

router.get("/scores/:replyId", async (req, res) => {
  Promise.all([
    UserReplyVote.count({
      where: {
        replyId: req.params.replyId,
        isUp: true
      }
    }),
    UserReplyVote.count({
      where: {
        replyId: req.params.replyId,
        isUp: false
      }
    })
  ])
    .then(votes => {
      res.status(200).send({ upVote: votes[0], downVote: votes[1] });
    })
    .catch(error => {
      res.status(400).send();
    });
});

module.exports = router;
