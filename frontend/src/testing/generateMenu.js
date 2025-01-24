import { faker } from '@faker-js/faker';
import * as fs from 'fs';

const generateMenuItems = (count = 100) => {
    const menuItems = [];
    const categories = ['Foods', 'Drinks', 'Specials'];

    for (let i = 0; i < count; i++) {
        const menuItem = {
            _id: faker.database.mongodbObjectId(),
            image: faker.image.food(), // Changed to generate food images
            itemName: faker.commerce.productName(), // This already works fine for food names
            description: faker.lorem.paragraph(),
            price: parseFloat(faker.commerce.price({ min: 1, max: 50, dec: 2 })),
            category: categories[Math.floor(Math.random() * categories.length)],
            availability: faker.datatype.boolean(),
        };
        menuItems.push(menuItem);
    }

    return menuItems;
};

// Generate 100 menu items
const menuData = generateMenuItems(100);

// Write to JSON file
fs.writeFileSync('menuItems.json', JSON.stringify(menuData, null, 2));

console.log('Menu items generated and saved to menuItems.json');
