import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CountryModel from '../src/models/country.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, 'country.json');

export async function seedCountry() {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    try {
        const count = await CountryModel.find().countDocuments();
        if (count) throw new Error("Country collection already exists. Please contact the super admin for further changes.");
        await CountryModel.insertMany(jsonData);
        console.log("Countries have been seeded successfully.");
    } catch (error) {
        console.error("Error seeding countries:", error);
    }
}
