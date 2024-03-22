import { Response, NextFunction } from "express";
import { Logger } from "../middlewares/logger";
import { ErrorHandler } from "../middlewares/errorMiddleware";

const getNews = async (res: Response, next: NextFunction) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=${apiKey}`);
        if (!response.ok) {
            throw new ErrorHandler(response.status, 'ERROR', `News API responded with status: ${response.status}`);
        }
        const data = await response.json();
        const news = data.articles.filter((article: any) => article.urlToImage !== null);

        return res.status(200).json({
            status: 'SUCCESS',
            data: news,
        });
    } catch (err: any) {
        Logger.error(`Error occurred while fetching news: ${err}`);
        if (!(err instanceof ErrorHandler)) {
            err = new ErrorHandler(500, 'ERROR', `Error fetching news: ${err.message || err}`);
        }
        next(err);
    }
};

export default getNews;
