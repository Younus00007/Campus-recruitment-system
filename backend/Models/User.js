const mongoose = require('mongoose');
const UserSchema = mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password : {
            type: String,
            required: true,
        },
        role: {
            type : String,
            required : true,
        },
        profile:{
            bio : {type: String},
            education : [{type: String}],
            company : {type: String},
        },
        
},
{ timestamps : true}

);
module.exports=mongoose.model('User',UserSchema);