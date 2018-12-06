import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Registration Schema
 */

export const registrationSchema = new Schema({
    exam: String,
    examCost: String,
    examDate: String,
    examsite: String,
    purchaseDate: String,
    enrollFee: String,
    chinaFee: String,
    fname: String,
    lname: String,
    email: String,
    company: String,
    addr1: String,
    addr2: String,
    addr3: String,
    country: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    payment: String,
    regType: String,
    totalCost: String,
    RESULT: String,
    PNREF: String,
    RESPMSG: String,
    AUTHCODE: String,
    PREFPSMSG: String,
    POSTFPSMSG: String,
    idname: String,
    idnum: String,
    idtype: String,
    idexpr: String,
    isworking: String,
    inschool: String,
    school: String,
    degree: String,
    chinesename: String,
    gender: String,
    birthdate: String
});

export const Registration = mongoose.model("Registration", registrationSchema);
