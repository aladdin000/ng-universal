import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * User Security Schema
 */

export const userSecuritySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    securityData: {
        accessToken: {
            type: String,
            required: true
        },
        instanceUrl: {
            type: String,
            required: true
        }
    }
});


userSecuritySchema.statics.load = (userId: string, cb: any) => {
    this.findOne({
        userId: userId
    }).exec(cb);
};

userSecuritySchema.statics.save = (userId: string, userSecurityData: any, cb: any) => {
    this.findOneAndUpdate({userId: userId}, {securityData: userSecurityData}, {new: true, upsert: true}, cb);
};

export const UserSecurity = mongoose.model("UserSecurity", userSecuritySchema);
