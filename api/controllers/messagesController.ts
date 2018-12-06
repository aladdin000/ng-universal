import * as _ from 'lodash';
import * as util from 'util';
import { Request, Response, NextFunction } from 'express';

import { Message } from '../models/Message';

export interface IRequest extends Request {
    message: any; // or any other type
    user: any;
}

exports.getAllMessages = (req: Request, res: Response) => {
    Message.find().sort('-created').exec(function(err, messages) {
        if (err) {
            return res.status(500)
                .json({error: err});
        } else {
            console.log('Found Messages:' + util.inspect(messages, {showHidden: false, depth: null}));
            return res.json(messages);
        }
    });
};

exports.getMessageByExamId = (req: Request, res: Response) => {
    Message.find({sites: req.params.id}).sort('-created').exec(function(err, messages) {
        if (err) {
            return res.status(500)
                .json({error: err});
        } else {
            console.log('Found Messages:' + util.inspect(messages, {showHidden: false, depth: null}));
            return res.json(messages);
        }
    });
};

/**
 * Find message by id
 */
exports.message = (req: IRequest, res: Response, next: NextFunction, id: any) => {
    Message.schema.statics.load(id, (err: any, message: any) => {
        if (err) {
            return next(err);
        }
        if (!message) {
            return next(new Error('Failed to load message ' + id));
        }
        req.message = message;
        next();
    });
};

/**
 * Create an message
 */
exports.create = (req: IRequest, res: Response) => {
    const message: any = new Message(req.body);
    message.user = req.user;

    message.save((err: any) => {
        if (err) {
            return res.json({
                errors: err.errors,
                message: message
            });
        } else {
            return res.jsonp(message);
        }
    });
};

/**
 * Update an message
 */
exports.update = (req: IRequest, res: Response) => {
    let message: any = req.message;

    message = _.extend(message, req.body);

    message.save((err: any) => {
        if (err) {
            return res.json({
                errors: err.errors,
                message: message
            });
        } else {
            return res.jsonp(message);
        }
    });
};

/**
 * Delete an message
 */
exports.destroy = (req: IRequest, res: Response) => {
    const message = req.message;

    message.remove((err: any) => {
        if (err) {
            return res.json({
                errors: err.errors,
                message: message
            });
        } else {
            return res.jsonp(message);
        }
    });
};

/**
 * Show an message
 */
exports.show = (req: IRequest, res: Response) => {
    res.jsonp(req.message);
};

/**
 * List of Messages
 */
exports.all = (req: Request, res: Response) => {
    Message.find().sort('-created').populate('user', 'name username').exec(function(err, messages) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(messages);
        }
    });
};
