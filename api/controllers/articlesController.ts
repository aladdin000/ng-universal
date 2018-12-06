import { Request, Response, NextFunction } from 'express';
import { Article } from '../models/Article';
import * as _ from 'underscore';

export interface IRequest extends Request {
    user: any;
    article: any; // or any other type
}

/**
 * Find article by id
 */
exports.article = (req: IRequest, res: Response, next: NextFunction, id: any) => {
    Article.schema.statics.load(id, (err: any, article: any) => {
        if (err) {
            return next(err);
        }
        if (!article) {
            return next(new Error('Failed to load article ' + id));
        }
        req.article = article;
        next();
    });
};

/**
 * Create an article
 */
exports.create = (req: IRequest, res: Response) => {
    const article: any = new Article(req.body);
    article.user = req.user;

    article.save((err: any) => {
        if (err) {
            return res.json({
                errors: err.errors,
                article: article
            });
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Update an article
 */
exports.update = (req: IRequest, res: Response) => {
    let article: any = req.article;

    article = _.extend(article, req.body);

    article.save((err: any) => {
        if (err) {
            return res.json({
                errors: err.errors,
                article: article
            });
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Delete an article
 */
exports.destroy = (req: IRequest, res: Response) => {
    const article = req.article;

    article.remove((err: any) => {
        if (err) {
            return res.json({
                errors: err.errors,
                article: article
            });
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Show an article
 */
exports.show = (req: IRequest, res: Response) => {
    res.jsonp(req.article);
};

/**
 * List of Articles
 */
exports.all = (req: IRequest, res: Response) => {
    Article.find().sort('-created').populate('user', 'name username').exec(function(err, articles) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(articles);
        }
    });
};
