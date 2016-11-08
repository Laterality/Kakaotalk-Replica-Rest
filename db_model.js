var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: { type: String },
    salt: { type: String },
    username: { type: String },
    validity: { type: Boolean },
    phone_number: {
        country: String,
        _number: String
    },
    devices: [
        {
            type: Schema.Types.ObjectId,
            ref: "Device"
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});
var DeviceSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    token: { type: String, unique: true },
    type: {
        type: String,
        enum: ["android", "ios", "windows"]
    }
});
var ChatroomSchema = new Schema({
    title: { type: String },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});
module.exports.UserSchema = UserSchema;
module.exports.DeviceSchema = DeviceSchema;
module.exports.ChatroomSchema = ChatroomSchema;
//# sourceMappingURL=db_model.js.map