import { faker } from '@faker-js/faker';
import fs from 'fs';

// Function to generate random user data
function generateUsers(numUsers) {
    const users = [];

    for (let i = 1; i <= numUsers; i++) {
        const user = {
            _id: String(i), // Unique user ID
            username: faker.internet.username(), // Random username
            email: faker.internet.email(), // Random email
            role: faker.helpers.arrayElement(['admin', 'user']), // Random role
            createdAt: faker.date.past(), // Random createdAt
            updatedAt: faker.date.recent(), // Random updatedAt
            __v: 0, // Version key
        };
        users.push(user);
    }

    return users;
}

// Generate 100 users
const users = generateUsers(100);

// Write to JSON file
fs.writeFileSync('users.json', JSON.stringify(users, null, 2));


