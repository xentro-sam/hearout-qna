const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    body : String,
    likes : Number,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    likedBy : [
        {
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    ]
},
{
    timestamps : true
});

module.exports = mongoose.model("Answer",answerSchema);