import React, { useState, useEffect } from 'react';
import { getTransactions } from '../api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const TransactionTable = () => {
  const [month, setMonth] = useState('March');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [priceRangeData, setPriceRangeData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions(month, search, currentPage);
        // console.log(response);

          const data = response?.data?.transactions;
          console.log(data);
          // Extract transactions and pagination details
          const transactionsData = data?.transactions || [];
         
          const totalPages = Math.ceil((data?.total || 0) / (data?.perPage || 10));
          // const totalPages = data?.total 
          // console.log(totalPages);
  
          // Update state with the fetched data
          setTransactions(transactionsData);
          setTotalPages(totalPages);

          const statisticsResponse = await getTransactions(month);
          // console.log(statisticsResponse);
          const staticData = statisticsResponse?.data?.statistics;
          setStatistics(staticData);

          const priceRangeResponse = await getTransactions(month, search, currentPage); // Assuming this API also returns price range data
          const priceRangeDistribution = priceRangeResponse.data.priceRangeDistribution;
          // console.log(priceRangeDistribution)
          setPriceRangeData(priceRangeDistribution);

      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    };
  
    fetchTransactions();
  }, [month, search, currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setCurrentPage(1); // Reset to first page on month change
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Prepare data for the bar chart
  const chartData = {
    labels: priceRangeData.map(range => range.range),
    datasets: [
      {
        label: 'Number of Items',
        data: priceRangeData.map(range => range.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

return (
  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen font-serif">
    <h1 className="text-4xl font-bold mb-12 text-center font-serif text-[#0A21C0]">
      Comprehensive Transaction Dashboard
      <br />
      <h3 className="text-2xl text-center pt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] via-[#0ea5e9] to-[#10b981]">
        Seamlessly track and analyze your financial transactions with real-time insights
      </h3>
    </h1>

    {/* Search and Filter Section */}
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by title/description/price"
          className="w-full p-3 border border-gray-300 rounded-3xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gradient-to-r  from-blue-200 via-green-200 to-teal-200 text-gray-700 placeholder-gray-500" 
        />
      </div>

      <div className="w-full sm:w-1/2 lg:w-1/3">
        <select
          value={month}
          onChange={handleMonthChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gradient-to-r from-blue-200 via-green-200 to-teal-200 text-gray-700"
        >
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Transaction Statistics Section */}
    <div className="mb-6 p-6 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 shadow-lg rounded-xl text-center">
      <h2 className="text-2xl font-semibold text-[#0A21C0] mb-4">
        Transaction Statistics for {month}
      </h2>
      <div className="text-gray-700 mb-2">
        Total Sale Amount: <span className="font-bold text-green-700">${statistics.totalSaleAmount.toFixed(2)}</span>
      </div>
      <div className="text-gray-700 mb-2">
        Total Sold Items: <span className="font-bold text-blue-700">{statistics.totalSoldItems}</span>
      </div>
      <div className="text-gray-700">
        Total Not Sold Items: <span className="font-bold text-red-700">{statistics.totalNotSoldItems}</span>
      </div>
    </div>

    {/* Transactions Table */}
    <div className="mb-6 bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 border border-gray-200 rounded-lg shadow-lg overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-blue-200">
          <tr>
            <th className="py-2 px-4 border-b text-left text-blue-700">Title</th>
            <th className="py-2 px-4 border-b text-left text-blue-700">Description</th>
            <th className="py-2 px-4 border-b text-left text-blue-700">Price</th>
            <th className="py-2 px-4 border-b text-left text-blue-700">Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length ? (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-blue-50 transition-colors">
                <td className="py-2 px-4 border-b text-gray-700">{transaction.title}</td>
                <td className="py-2 px-4 border-b text-gray-700">{transaction.description}</td>
                <td className="py-2 px-4 border-b text-gray-700">${transaction.price.toFixed(2)}</td>
                <td className="py-2 px-4 border-b text-gray-700">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 border-b text-center text-gray-500">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination Controls */}
    <div className="flex justify-between items-center bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 p-4 rounded-lg shadow-lg">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition"
      >
        Previous
      </button>
      <span className="text-gray-700 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition"
      >
        Next
      </button>
    </div>

    {/* Price Range Distribution Chart */}
    {/* <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-lg rounded-xl flex flex-col justify-center items-center h-[600px]">
      
      <h2 className="text-3xl mt-16 font-semibold text-[#0A21C0] mb-2 text-center">
        Price Range Distribution for {month}
      </h2>
       <h3 className="text-2xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] via-[#0ea5e9] to-[#10b981] font-semibold">
          Discover detailed insights into item distribution across varied price ranges.
       </h3>



      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#374151', // text-gray-700
                font: {
                  weight: 'bold',
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.raw} items`,
              },
              backgroundColor: '#374151', // text-gray-700
              titleColor: '#FFFFFF', // white text
              bodyColor: '#FFFFFF', // white text
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Price Range',
                color: '#4B5563', // text-gray-700
                font: {
                  weight: 'bold',
                },
              },
              ticks: {
                color: '#4B5563', // text-gray-700
              },
            },
            y: {
              title: {
                display: true,
                text: 'Number of Items',
                color: '#4B5563', // text-gray-700
                font: {
                  weight: 'bold',
                },
                beginAtZero: true,
              },
              ticks: {
                color: '#4B5563', // text-gray-700
              },
            },
          },
        }}
      />
    </div> */}
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-lg rounded-xl flex flex-col justify-center items-center h-auto md:h-[600px]">
      <h2 className="text-2xl sm:text-3xl mt-8 sm:mt-16 font-semibold text-[#0A21C0] mb-2 text-center">
        Price Range Distribution for {month}
      </h2>
      <h3 className="text-lg sm:text-2xl text-center mb-4 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] via-[#0ea5e9] to-[#10b981] font-semibold">
        Discover detailed insights into item distribution across varied price ranges.
      </h3>

      <div className="w-full max-w-4xl mx-auto">
        <div className="w-full max-w-full overflow-x-auto h-[400px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: '#374151', // text-gray-700
                    font: {
                      weight: 'bold',
                    },
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.raw} items`,
                  },
                  backgroundColor: '#374151', // text-gray-700
                  titleColor: '#FFFFFF', // white text
                  bodyColor: '#FFFFFF', // white text
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Price Range',
                    color: '#4B5563', // text-gray-700
                    font: {
                      weight: 'bold',
                    },
                  },
                  ticks: {
                    color: '#4B5563', // text-gray-700
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Number of Items',
                    color: '#4B5563', // text-gray-700
                    font: {
                      weight: 'bold',
                    },
                    beginAtZero: true,
                  },
                  ticks: {
                    color: '#4B5563', // text-gray-700
                  },
                },
              },
            }}
          />
        </div>
      </div>

    </div>

  </div>
);




}


export default TransactionTable;
