const express = require('express');
const router = express.Router({mergeParams : true});

const {validateAnswer,isLoggedIn,isAnswerAuthor} = require('../middleware');
const Question = require('../models/question');
const Answer = require('../models/answer');
const answers = require('../controllers/answers');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateAnswer, catchAsync (answers.createAnswer));

router.route('/:answerId')
    .put(isLoggedIn, isAnswerAuthor, catchAsync(answers.updateAnswer))
    .delete(isLoggedIn, isAnswerAuthor, catchAsync(answers.deleteAnswer));

router.get('/:answerId/edit', isLoggedIn, isAnswerAuthor, catchAsync(answers.renderEditForm));

router.post('/:answerId/likeUnlike', isLoggedIn, catchAsync (answers.likeUnlikeLogic));

module.exports = router;