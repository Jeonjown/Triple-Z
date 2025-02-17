import { faker } from '@faker-js/faker';
import * as fs from 'fs';

const generateMenuData = (totalItems = 100) => {
    const categories = ['Foods', 'Drinks', 'Desserts', 'Specials']; // Main categories
    const subcategories = ['Hot', 'Cold', 'Combo', 'Snacks']; // Subcategories within each category
    let totalGeneratedItems = 0;

    const menu = { categories: [] };

    categories.forEach((category) => {
        const subcategoriesData = [];

        subcategories.forEach((subcategory) => {
            const items = [];

            for (let i = 0; i < 5; i++) { // Generate 5 items per subcategory
                if (totalGeneratedItems >= totalItems) break; // Stop when totalItems is reached
                totalGeneratedItems++;

                items.push({
                    id: faker.string.uuid(),
                    title: faker.commerce.productName(),
                    image: faker.image.url(),// Generate food image
                    price: parseFloat(faker.commerce.price({ min: 1, max: 50, dec: 2 })),
                    size: faker.helpers.arrayElement(['Small', 'Medium', 'Large']),
                    description: faker.lorem.sentence(),
                    availability: faker.datatype.boolean(),
                    createdAt: faker.date.recent(),
                });
            }

            if (items.length > 0) {
                subcategoriesData.push({
                    subcategory: subcategory,
                    items,
                });
            }
        });

        menu.categories.push({
            category,
            subcategories: subcategoriesData,
        });
    });

    return menu;
};

// Generate the menu with 100 items
const menuData = generateMenuData(100);

// Write to a JSON file
fs.writeFileSync('menuData.json', JSON.stringify(menuData, null, 2));

console.log('Menu data generated and saved to menuData.json');
