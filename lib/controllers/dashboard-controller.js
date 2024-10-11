import prisma from "lib/prisma";
import moment from 'moment-timezone';
import { calculatePercentageChange, getDateRange } from "utils/utils";

// Get report with user count, product count, transaction count (sales/purchases), and percentage change
export const getCounts = async (req, res) => {
	try {
		const { startDate, endDate } = req.query;
		const timezone = req.headers['timezone'] || 'UTC'; // Default to UTC if no timezone is provided

		if (!startDate || !endDate) {
			return res.status(400).json({ message: "Please provide both startDate and endDate." });
		}

		// Get date range for the current period
		const { start, end } = getDateRange(startDate, endDate, timezone);

		// Get date range for the previous period (for percentage comparison)
		const previousStart = moment.tz(startDate, timezone).subtract(end - start, 'milliseconds').toDate();
		const previousEnd = moment.tz(startDate, timezone).subtract(1, 'days').endOf("day").toDate();

		// Count users in the current and previous periods
		const userCount = await prisma.user.count({
			where: {
				createdAt: {
					gte: start,
					lte: end,
				},
			},
		});

		const prevUserCount = await prisma.user.count({
			where: {
				createdAt: {
					gte: previousStart,
					lte: previousEnd,
				},
			},
		});

		// Count products in the current and previous periods
		const productCount = await prisma.product.count({
			where: {
				createdAt: {
					gte: start,
					lte: end,
				},
			},
		});

		const prevProductCount = await prisma.product.count({
			where: {
				createdAt: {
					gte: previousStart,
					lte: previousEnd,
				},
			},
		});

		// Count sales (marketOut) transactions in the current and previous periods
		const salesCount = await prisma.transaction.count({
			where: {
				type: 'marketOut',
				createdAt: {
					gte: start,
					lte: end,
				},
			},
		});

		const prevSalesCount = await prisma.transaction.count({
			where: {
				type: 'marketOut',
				createdAt: {
					gte: previousStart,
					lte: previousEnd,
				},
			},
		});

		// Count purchase (storeIn) transactions in the current and previous periods
		const purchaseCount = await prisma.transaction.count({
			where: {
				type: 'storeIn',
				createdAt: {
					gte: start,
					lte: end,
				},
			},
		});

		const prevPurchaseCount = await prisma.transaction.count({
			where: {
				type: 'storeIn',
				createdAt: {
					gte: previousStart,
					lte: previousEnd,
				},
			},
		});

		// Calculate percentage change for users, products, sales, and purchases
		const userPercentChange = calculatePercentageChange(prevUserCount, userCount);
		const productPercentChange = calculatePercentageChange(prevProductCount, productCount);
		const salesPercentChange = calculatePercentageChange(prevSalesCount, salesCount);
		const purchasePercentChange = calculatePercentageChange(prevPurchaseCount, purchaseCount);

		// Return report data
		res.status(200).json({
			userCount,
			productCount,
			salesCount,                // Include sales count
			purchaseCount,             // Include purchase count
			userPercentChange,
			productPercentChange,
			salesPercentChange,        // Include sales percentage change
			purchasePercentChange,     // Include purchase percentage change
		});

	} catch (error) {
		return res.status(500).json({ message: "An error occurred while generating the report" });
	}
};



// Get sales and purchase data grouped by day for charts
export const getSalesAndPurchaseData = async (req, res) => {
	try {
		const { startDate, endDate } = req.query;
		const timezone = req.headers['timezone'] || 'UTC'; // Default to UTC if no timezone is provided

		// Validate the provided dates
		if (!startDate || !endDate) {
			return res.status(400).json({ message: "Please provide both startDate and endDate." });
		}

		// Get date range for the current period
		const { start, end } = getDateRange(startDate, endDate, timezone);

		// Get sales (marketOut) transactions, grouped by date
		const salesData = await prisma.transaction.groupBy({
			by: ['createdAt'],
			where: {
				type: 'marketOut',
				createdAt: {
					gte: start,
					lte: end,
				},
			},
			_count: {
				_all: true,
			},
			_sum: {
				quantity: true, // Sum of the quantity field
			},
		});

		// Get purchase (storeIn) transactions, grouped by date
		const purchaseData = await prisma.transaction.groupBy({
			by: ['createdAt'],
			where: {
				type: 'storeIn',
				createdAt: {
					gte: start,
					lte: end,
				},
			},
			_count: {
				_all: true,
			},
			_sum: {
				quantity: true, // Sum of the quantity field
			},
		});

		// Function to group data by date and aggregate counts and quantities
		const groupByDate = (data, timezone) => {
			return data.reduce((acc, curr) => {
				const date = moment(curr.createdAt).tz(timezone).format("YYYY-MM-DD");

				// Find if the date already exists in the accumulator
				const existingDate = acc.find(item => item.date === date);
				if (existingDate) {
					// If date exists, add the count and quantity
					existingDate.count += curr._count._all || 0; // Ensure default value if undefined
					existingDate.quantity += curr._sum?.quantity || 0; // Use optional chaining for safety
				} else {
					// Otherwise, create a new entry for the date
					acc.push({
						date: date,
						count: curr._count._all || 0, // Default to 0 if undefined
						quantity: curr._sum?.quantity || 0, // Use optional chaining for safety
					});
				}

				return acc;
			}, []);
		};

		// Group sales and purchase data by date and sum counts
		let formattedSalesData = groupByDate(salesData, timezone);
		let formattedPurchaseData = groupByDate(purchaseData, timezone);

		// Sort the sales and purchase data by date in ascending order
		formattedSalesData = formattedSalesData.sort((a, b) => new Date(a.date) - new Date(b.date));
		formattedPurchaseData = formattedPurchaseData.sort((a, b) => new Date(a.date) - new Date(b.date));

		// Return the sales and purchase data for the chart
		res.status(200).json({
			salesData: formattedSalesData,
			purchaseData: formattedPurchaseData,
		});

	} catch (error) {
		return res.status(500).json({ message: "An error occurred while fetching the chart data" });
	}
};

