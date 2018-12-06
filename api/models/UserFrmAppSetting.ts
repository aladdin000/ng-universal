import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Define Schemas
 */
export const settingsSchema = new Schema({

});

export const UserFRMAppSettingsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    settings: {
        organizeBy: {
            type: String,
            default: "topic",
            trim: true
        },
        gcmId: {
            type: String,
            trim: true
        },
        apnId: {
            type: String,
            trim: true
        },
        examId: {
            type: String,
            trim: true
        },
        reminders: []
    }
});

/**
 * Validations
 */
// UserFRMAppSettingsSchema.path('organizeBy').validate(function(organizeBy) {
//     if(organizeBy != 'topic' && organizeBy != 'week') {
//         return false
//     } else {
//         return true;
//     }
// }, 'organizeBy can be either topic or week only');

/**
 * Statics
 */

UserFRMAppSettingsSchema.statics.load = (userId: string, cb: any) => {
    this.findOne({
        userId: userId
    }).exec(cb);
};

UserFRMAppSettingsSchema.statics.set = (userId: string, cb: any) => {
    this.findOne({
        userId: userId
    }).exec(cb);
};

export const UserFRMAppSettings = mongoose.model("UserFRMAppSettings", UserFRMAppSettingsSchema);
