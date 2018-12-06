import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * UserFrmMeta Schema
 */
export const metaSchema = new Schema({
    readingId: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    flagged: {
        type: Boolean,
        default: false
    },
    notes: []
});

export const UserFRMAppMetaSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    metaData: [metaSchema]
});

UserFRMAppMetaSchema.statics.load = (userId: any, cb: any) => {
    this.findOne({
        userId: userId
    }).exec(cb);
};

export const UserFRMAppMeta = mongoose.model("UserFRMAppMeta", UserFRMAppMetaSchema);
