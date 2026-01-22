const mongoose=require('mongoose');

const bookingSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true, message:"User ID is required"},
    serviceId:{type:mongoose.Schema.Types.ObjectId, ref:'Service', required:true, message:"Service ID is required"},
    bookingDate:{type:Date, required:true, message:"Booking date is required"},
    status:{
        type:String,
        enum:['pending','accepted','rejected','completed'],
        default:'pending'
    }
},
{timestamps:true }
)

module.exports=mongoose.model('Booking',bookingSchema);
