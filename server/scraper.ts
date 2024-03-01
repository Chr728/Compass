// for 12 times, for all "hospital_element" tags, get the following data:
// Last updated
// Hospital Name
// Hospital Address
// Estimated waiting time for non-priority cases to see a doctor
// Number of people waiting to see a doctor in the emergency room
// Total number of people in the emergency room
// Occupancy rate of stretchers

import cheerio from 'cheerio';
import fs from 'fs';
import cron from 'node-cron';
import path from 'path';

async function scrape() {
    try {
        const filePath = path.join(__dirname, 'scrapeData.json');
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
        const response = await fetch('https://www.quebec.ca/en/health/health-system-and-services/service-organization/quebec-health-system-and-its-services/situation-in-emergency-rooms-in-quebec?tx_solr%5Bpage%5D=3')
        const html = await response.text()
        const $ = cheerio.load(html)
        const hospital_elements = $('.hospital_element')
        const data: any = []
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

        fs.writeFileSync(path.join(__dirname, 'scrapeData.json'), JSON.stringify(data, null, 2))
        console.log('Data has been scraped and saved to data.json')
        return data
    } catch (err: any) {
        console.log(err)
    }
}

scrape().then((data) => {
    console.log('Scraping completed: ', data)
})
