const express = require('express');
const router = express.Router();
const questions = require('../controllers/questions');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateQuestion} = require('../middleware');

const Question = require('../models/question');

router.route('/')
    .get(catchAsync (questions.index))
    .post(isLoggedIn, validateQuestion, catchAsync (questions.createQuestion));

router.get('/new', isLoggedIn, questions.renderNewForm);

router.route('/:id')
    .get(catchAsync(questions.showQuestion))
    .put(isLoggedIn, isAuthor, catchAsync (questions.updateQuestion))
    .delete(isLoggedIn, isAuthor, catchAsync (questions.deleteQuestion));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (questions.renderEditForm));

router.post('/:id/likeUnlike', isLoggedIn, catchAsync (questions.likeUnlikeLogic));

module.exports = router;