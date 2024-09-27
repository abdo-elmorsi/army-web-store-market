// lib/prisma.js
import { PrismaClient } from '@prisma/client';

// Declare a variable to hold the Prisma client instance
let prisma;

// Check if the environment is development or production
if (process.env.NODE_ENV === 'development') {
	// In development mode, we can instantiate a new Prisma client instance for each request
	// This helps with hot reloading in development environments
	prisma = new PrismaClient({
		log: ['query', 'info', 'warn', 'error'], // Enable logging in development
	});
} else {
	// In production mode, we want to reuse the same Prisma client instance
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

// Handle Prisma client errors
prisma.$on('error', (error) => {
	console.error('Prisma Client Error:', error);
});

// Export the Prisma client instance
export default prisma;