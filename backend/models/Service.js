const  mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    name:{type:String, required:true, message:"Service name is required"},
    description:{type:String},
    price:{type:Number, required:true, message:"Price is required"},
    duration:{type:Number, required:true, message:"Duration is required in minutes"},
    isActive:{
        type:Boolean,
        default:true
    },
    adminId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}
},
{timestamps:true }
);

module.exports=mongoose.model('Service',serviceSchema);