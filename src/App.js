// import React, { useState, useEffect } from 'react';
// import { getCombinedData } from './api';
// import DataTable from './components/DataTable';
// import Charts from './components/Charts';

// function App() {
//   const [data, setData] = useState(null);
//   const [month, setMonth] = useState('March'); // Default month

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await getCombinedData(month);
//         setData(result);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [month]);

//   return (
//     <div className="App">
//       <h1>Data Visualization</h1>
//       <select value={month} onChange={(e) => setMonth(e.target.value)}>
//         <option value="January">January</option>
//         <option value="February">February</option>
//         <option value="March">March</option>
//         <option value="April">April</option>
//         <option value="May">May</option>
//         <option value="June">June</option>
//         <option value="July">July</option>
//         <option value="August">August</option>
//         <option value="September">September</option>
//         <option value="October">October</option>
//         <option value="November">November</option>
//         <option value="December">December</option>
//       </select>

//       {data ? (
//         <div>
//           <DataTable
//             statistics={data.statistics}
//             priceRangeDistribution={data.priceRangeDistribution}
//             categoryDistribution={data.categoryDistribution}
//           />
//           <Charts
//             priceRangeDistribution={data.priceRangeDistribution}
//             categoryDistribution={data.categoryDistribution}
//           />
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }

// export default App;

// src/App.js

import React from 'react';
import TransactionTable from './components/TransactionTable';
import './index.css';

function App() {
  return (
    <div className="App">
      <TransactionTable />
    </div>
  );
}

export default App;
