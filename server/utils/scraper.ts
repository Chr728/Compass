import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { Logger } from '../middlewares/logger';

async function scrape() {
    try {
        const pages = 12;
        let data: any = []
        for (let page = 1; page <= pages; page++) {
            const response = await fetch(`https://www.quebec.ca/en/health/health-system-and-services/service-organization/quebec-health-system-and-its-services/situation-in-emergency-rooms-in-quebec?tx_solr%5Bpage%5D=${page}`)
            const html = await response.text()
            const $ = cheerio.load(html)
            const hospital_elements = $('.hospital_element')

            hospital_elements.each((i, el) => {
                const last_updated = Date.now()
                const hospital_name = $(el).find('.font-weight-bold').first().text()
                const hospital_address = $(el).find('.adresse').text().trim();
                const waiting_time = $(el).find('.hopital-item .font-weight-bold').first().text().trim();
                const waiting_people = $(el).find('li.hopital-item').eq(1).text().split(':')[1].trim()
                const total_people = $(el).find('li.hopital-item').eq(2).text().split(':')[1].trim()
                const stretcher_occupancy = $(el).find('li.hopital-item').eq(3).text().split(':')[1].trim()
                data.push({
                    last_updated,
                    hospital_name,
                    hospital_address,
                    waiting_time,
                    waiting_people,
                    total_people,
                    stretcher_occupancy
                })
            })
        }
        fs.writeFileSync(path.join(__dirname, 'scrapeData.json'), JSON.stringify(data, null, 2))
        Logger.info('Data has been scraped and saved to scrapeData.json')
    } catch (err: any) {
        Logger.error(err)
    }
}

export default scrape;
