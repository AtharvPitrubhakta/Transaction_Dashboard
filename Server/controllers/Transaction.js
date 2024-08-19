const axios = require('axios');
const Product = require("../models/Sales_Product");

exports.fetchApi = async (req, res) => {
    try {
        // Fetch the data from the third-party API
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const products = response.data;
    
        // Insert the fetched data into the MongoDB collection
        await Product.insertMany(products);
    
        res.send('Database initialized with seed data');
        // console.log("error");
      } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).send('Error initializing database');
      }
}

//  Combined the API to get  listTransaction, getStatistics, getPriceRangeDistribution & getCategoryDistribution...
exports.getCombinedData = async (req, res) => {
  try {
    const { search, page = 1, perPage = 10, month } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    // Convert month name to month number
    const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;

    // Build the query object for transactions
    const body = {};

    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive regex for string fields
    
      body.$or = [
        { title: regex },
        { description: regex },
        { category: regex }
      ];
    
      // Check if the search query is a valid number and add to query if so
      if (!isNaN(search)) {
        body.$or.push({ price: Number(search) });
      }
    }

    if (month) {
      body.$expr = { $eq: [{ $month: '$dateOfSale' }, monthNumber] }; // Use $expr to filter by month
    }

    // Get total number of transactions that match the query
    const totalTransactions = await Product.countDocuments(body);

    // Fetch transactions data with pagination
    const transactions = await Product.find(body)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    // Fetch statistics data
    const totalSaleAmount = await Product.aggregate([
      {
        $match: {
          sold: true,
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$price' },
        },
      },
    ]);

    const totalSoldItems = await Product.countDocuments({
      sold: true,
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    });

    const totalNotSoldItems = await Product.countDocuments({
      sold: false,
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    });

    // Fetch price range distribution data
    const priceRanges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Infinity },
    ];

    const priceRangeData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Product.countDocuments({
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
          price: { $gte: range.min, $lte: range.max },
        });
        return { range: range.range, count };
      })
    );

    // Fetch category distribution data
    const categoryData = await Product.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
        },
      },
      {
        $group: {
          _id: '$category', // Group by category
          count: { $sum: 1 }, // Count the number of items in each category
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
        },
      },
    ]);

    // Combine all the data
    const combinedData = {
      transactions: {
        total: totalTransactions,
        page: parseInt(page),
        perPage: parseInt(perPage),
        transactions,
      },
      statistics: {
        totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
        totalSoldItems,
        totalNotSoldItems,
      },
      priceRangeDistribution: priceRangeData,
      categoryDistribution: categoryData,
    };

    // Send the response
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
