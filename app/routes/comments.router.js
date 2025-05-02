const express = require("express");

const { deleteComment, patchCommentVotes } = require("../controllers/controller");

const commentsRouter = express.Router()

commentsRouter.route("/:comment_id").delete(deleteComment).patch(patchCommentVotes)



module.exports = commentsRouter;
