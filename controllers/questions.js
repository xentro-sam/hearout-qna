const Question = require('../models/question');

module.exports.index = async(req,res) => {
    const questions = await Question.find({}).populate('author');
    res.render('questions/index',{questions});
};

module.exports.renderNewForm = (req,res) => {
    res.render('questions/new');
};

module.exports.createQuestion = async(req,res,next) => {
    const question = new Question(req.body.question);
    question.likes = 0;
    question.author = req.user._id;
    await question.save();
    req.flash('success','Successfully added a new question!');
    res.redirect(`/questions/${question._id}`);
};

module.exports.showQuestion = async(req,res) => {
    const question = await Question.findById(req.params.id).populate({
        path : 'answers',
        populate : {
            path : 'author'
        }
    }).populate('author');
    if(!question) {
        req.flash('error','Cannot find that question');
        return res.redirect('/questions');
    }
    res.render('questions/show',{question});
};

module.exports.renderEditForm = async(req,res) => {
    const {id} = req.params;
    const question = await Question.findById(req.params.id);
    if(!question) {
        req.flash('error','Cannot find that question');
        return res.redirect('/questions');
    }
    res.render('questions/edit',{question});
};

module.exports.updateQuestion = async (req,res) => {
    const {id} = req.params;
    const question = await Question.findByIdAndUpdate(id,{...req.body.question});
    req.flash('success','Successfully updated question');
    res.redirect(`/questions/${question._id}`);
};

module.exports.deleteQuestion = async (req,res) => {
    const {id} = req.params;
    await Question.findByIdAndDelete(id);
    req.flash('success','Successfully deleted question');
    res.redirect('/questions');
};

module.exports.likeUnlikeLogic = async (req,res) => {
    const {id} = req.params;
    const question = await Question.findById(id);
    if(question.likedBy.includes(req.user._id)) {
        question.likes-=1;
        let index = question.likedBy.indexOf(req.user._id);
        question.likedBy.splice(index,1);
    }
    else {
        question.likes+=1;
        question.likedBy.push(req.user._id);
    }
    await question.save();
    res.send({likeCount : question.likes});
};