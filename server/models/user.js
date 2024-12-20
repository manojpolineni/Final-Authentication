import mongoose from "mongoose";

const AddressSchema = mongoose.Schema({
    city: { type: String, default: "" },
    area: { type: String, default: "" },
    district: { type: String, default: "" },
    pinCode: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
});

const UserSchema= mongoose.Schema({
    userName:{
        type:String,
        lowercase:true,
        required:[true, 'UserName is Required'],
    },
    email:{
        type:String,
        required:[true, 'email is Required'],
        trim:true,
        unique:[true, 'Email must be unique!'],
        lowercase:true,
    },
    phone:{
        type:Number,
        min:10,
    },
    password:{
        type:String,
        required:[true, 'Password is Required'],
        minlength:6,
    },
    gender:{
        type:String,
        enum:['Male', 'Female', 'Other'],
    },
    address:[AddressSchema],
    profilePic:{
        type:String,
        default: '',
    },
    verifyOtp :{
        type:String,
        default: ''
    },
    verifyOtpExpireAt:{
        type: Number,
        default: 0
    },
    isAccountVerified : {
        type : Boolean,
        default: false
    },
    resetOtp:{
        type:String,
        default: '',
    },
    resetOtpExpireAt:{
        type: Number,
        default: 0,
    },
},
{
    timestamps:true
}
);

const User= mongoose.model("User", UserSchema);
export default User;