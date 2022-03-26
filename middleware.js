const {questionSchema,answerSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Question = require('./models/question');
const Answer = require('./models/answer');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateQuestion = (req,res,next) => {
    const {error} = questionSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const question = await Question.findById(id);
    if(!question.author.equals(req.user._id)) {
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/questions/${id}`);
    }
    next();
}

module.exports.isAnswerAuthor = async(req,res,next) => {
    const {id,answerId} = req.params;
    const answer = await Answer.findById(answerId);
    if(!answer.author.equals(req.user._id)) {
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/questions/${id}`);
    }
    next();
}

module.exports.validateAnswer = (req,res,next) => {
    const {error} = answerSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else {
        next();
    }
}