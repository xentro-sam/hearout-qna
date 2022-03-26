const mongoose = require('mongoose');
const Answer = require('./answer');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    title : String,
    description : String,
    likes : Number,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    answers : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Answer'
        }
    ],
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

QuestionSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Answer.deleteMany({
            _id : {
                $in : doc.answers
            }
        });
    }
});

module.exports = mongoose.model('Question',QuestionSchema);