import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
/**
 * Article Schema
 */
export const ArticleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: "",
        trim: true
    },
    content: {
        type: String,
        default: "",
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

/**
 * Validations
 */
ArticleSchema.path("title").validate((title: string) => {
    return title.length;
}, "Title cannot be blank");

/**
 * Statics
 */
ArticleSchema.statics.load = (id: any, cb: any) => {
    this.findOne({
        _id: id
    }).populate("user", "name username").exec(cb);
};

export const Article = mongoose.model("Article", ArticleSchema);
