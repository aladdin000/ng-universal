import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Message Schema
 */
export const MessageSchema = new Schema({
    title: {
        type: String,
        default: "",
        trim: true
    },
    body: {
        type: String,
        default: "",
        trim: true
    },
    email: {
        type: String,
        default: "",
        trim: true
    },
    sound: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    sites: [String]
 });

/**
 * Statics
 */
MessageSchema.statics.load = (id: any, cb: any) => {
    this.findOne({
        _id: id
    }).exec(cb);
};

export const Message = mongoose.model("Message", MessageSchema);
