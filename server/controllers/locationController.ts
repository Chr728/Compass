import { Request, Response, NextFunction } from "express";
import { Logger } from "../middlewares/logger";

const getLocations = async (req: Request, rez: Response, next: NextFunction) => {
    try {
        const latitude = req.query.latitude as string;
        const longitude = req.query.longitude as string;
        const type = req.query.type as string;
        const radius = 10000;
        const apiKey = process.env.GOOGLE_MAPS_API_KEY as string;

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`
        const res = await fetch(url);
        const data = await res.json();
        const places = data.results
            .filter((place: any) => place.business_status === "OPERATIONAL")
            .sort((a: any, b: any) => a.rating - b.rating);

        return rez.status(200).json({
            status: 'SUCCESS',
            data: places
        });

    } catch (error) {
        Logger.error(`Error occurred while fetching locations: ${error}`);
        next(error);
    }
}

export default getLocations;
