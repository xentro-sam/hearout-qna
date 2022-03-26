const Question = require('../models/question');
const Answer = require('../models/answer');

module.exports.createAnswer = async (req,res) => {
    const question = await Question.findById(req.params.id);
    const answer = new Answer(req.body.answer);
    answer.likes = 0;
    answer.author = req.user._id;
    question.answers.push(answer);
    await answer.save();
    await question.save();
    req.flash('success','Added a new answer');
    res.redirect(`/questions/${question._id}`);
};

module.exports.deleteAnswer = async (req,res) =>{
    const {id,answerId} = req.params;
    await Question.findByIdAndUpdate(id,{$pull : {answers : answerId}});
    await Answer.findByIdAndDelete(answerId);
    req.flash('success','Successfully deleted answer');
    res.redirect(`/questions/${id}`);
};

module.exports.renderEditForm = async(req,res) => {
    const {id,answerId} = req.params;
    const question = await Question.findById(id);
    const answer = await Answer.findById(answerId);
    if(!answer) {
        req.flash('error','Cannot find that answer!');
        return res.redirect(`/questions/${id}`);
    }
    res.render('answers/edit',{question,answer});
}

module.exports.updateAnswer = async(req,res) => {
    const {id,answerId} = req.params;
    const question = await Question.findById(id);
    const answer = await Answer.findByIdAndUpdate(answerId,{...req.body.answer});
    req.flash('success','Successfully updated answer');
    res.redirect(`/questions/${id}`);
}

module.exports.likeUnlikeLogic = async (req,res) => {
    const {answerId} = req.params;
    const answer = await Answer.findById(answerId);
    if(answer.likedBy.includes(req.user._id)) {
        answer.likes-=1;
        let index = answer.likedBy.indexOf(req.user._id);
        answer.likedBy.splice(index,1);
    }
    else {
        answer.likes+=1;
        answer.likedBy.push(req.user._id);
    }
    await answer.save();
    res.send({likeCount : answer.likes});
};