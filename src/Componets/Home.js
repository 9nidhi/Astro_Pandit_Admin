import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar, Line } from 'react-chartjs-2'; // Import Line from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'; // Import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns';
import { Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TotalTransaction = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [paymentSearchData, setPaymentSearchData] = useState([]);
  const [successData, setSuccessData] = useState([]);
  const [successTotalData, setTotalSuccessData] = useState(0);
  const [dailySuccessData, setDailySuccessData] = useState([]);
  const [webUrlData, setWebUrlData] = useState([]); // State to hold data for pie chart
  const [filterData,setFilteredData]=useState('');

  const fetchData = async () => {
    try {
        const response = await fetch('https://tronixpayment.axispay.cloud/api/data');
        if (response.ok) {
            const data = await response.json();
            if (data) {
                const formattedData = data.map(item => {
                    const date = new Date(item.payment_time_local);
                    const options = {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      hour12: true,
                      timeZone: 'Asia/Kolkata' // Ensure the timezone is set to Kolkata
                    };

                    // Format the date and time
                    const transactionDate = new Intl.DateTimeFormat('en-IN', options).format(date);
                    const transactionTime = date.toLocaleTimeString('en-IN', { hour12: true, timeZone: 'Asia/Kolkata' });


                    return {
                        ...item,
                        transactionDate,
                        transactionTime,
                    };
                }).reverse();
                setPaymentData(formattedData);
                setFilteredData(formattedData); // Initialize filteredData with all data
                setSearchError(''); // Clear search error when new data is fetched
            } else {
                console.error('Data format is not as expected');
            }
        } else {
            console.error('Failed to fetch data:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateTotalAmount();
    calculatePendingTotalAmount();
    calculateTotalTransactions();
    calculateDailySuccessData();
    calculateWebUrlData(); // Calculate data for pie chart
  }, [paymentData]);

  const calculateTotalAmount = () => {
    const successfulPayments = paymentData.filter(payment => payment.payment_status === 'PAYMENT_SUCCESS');
    const totalAmount = successfulPayments.reduce((acc, payment) => acc + parseFloat(payment.payment_amount), 0);
    setTotalAmount(totalAmount);
  };

  const calculatePendingTotalAmount = () => {
    const pendingPayments = paymentData.filter(payment => payment.payment_status === 'PAYMENT_PENDING');
    const totalPending = pendingPayments.reduce((acc, payment) => acc + parseFloat(payment.payment_amount), 0);
    setTotalPending(totalPending);
  };

  const calculateTotalTransactions = () => {
    setTotalTransactions(paymentData.length);
  };

  const calculateDailySuccessData = () => {
    const successfulPayments = paymentData.filter(payment => payment.payment_status === 'PAYMENT_SUCCESS');

    const dailySuccessMap = successfulPayments.reduce((acc, payment) => {
      const date = new Date(payment.payment_time).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});

    const dailySuccessData = Object.keys(dailySuccessMap).map(date => ({
      date,
      count: dailySuccessMap[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    setDailySuccessData(dailySuccessData);
  };


  // const handleSearch = () => {
  //   if (!selectedDate) {
  //     setSearchError('Please select a date.');
  //     return;
  //   }
  
  //   const formattedDate = format(selectedDate, 'dd/M/yyyy');
  
  //   fetch(`http://localhost:4700/api/search?date=${formattedDate}`)
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json();
  //       } else {
  //         throw new Error('Data not found');
  //       }
  //     })
  //     .then(data => {
  //       if (data.length === 0) {
  //         setSearchError('No records found.');
  //         setSuccessData([]);
  //         setSuccessCount(0);
  //         setTotalSuccessData(0);
  //       } else {
  //         const options = {
  //           year: 'numeric',
  //           month: 'numeric',
  //           day: 'numeric',
  //           hour: 'numeric',
  //           minute: 'numeric',
  //           second: 'numeric',
  //           hour12: true,
  //           timeZone: 'Asia/Kolkata' // Set the timezone to Kolkata (UTC+05:30)
  //         };
  
  //         const successTransactions = data.filter(payment => payment.payment_status === 'PAYMENT_SUCCESS');
  //         const successData = successTransactions.map(payment => {
  //           const paymentTime = new Date(payment.payment_time);
  //           const formatter = new Intl.DateTimeFormat('en-IN', options);
  //           const formattedDateTime = formatter.format(paymentTime);
  //           const [transactionDate, transactionTime] = formattedDateTime.split(', ');
  
  //           return {
  //             status: payment.payment_status,
  //             amount: payment.payment_amount,
  //             payment_weburl:payment.payment_weburl,
  //             transactionDate,
  //             transactionTime
  //           };
  //         }).reverse();
  
  //         const successCount = successTransactions.length;
  //         const totalAmount = successData.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
  
  //         setSearchError('');
  //         setSuccessData(successData);
  //         setSuccessCount(successCount);
  //         setTotalSuccessData(totalAmount);
  //       }
  //     })
  //     .catch(error => {
  //       setSearchError('Error fetching data.');
  //       console.error('Error:', error);
  //     });
  // };
  
  const handleSearch = () => {
    if (!selectedDate) {
      setSearchError('Please select a date.');
      return;
    }
  
    const formattedDate = format(selectedDate, 'dd/M/yyyy');
  
    fetch(`https://tronixpayment.axispay.cloud/api/search?date=${formattedDate}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Data not found');
        }
      })
      .then(data => {
        if (data.length === 0) {
          setSearchError('No records found.');
          setSuccessData([]);
          setSuccessCount(0);
          setTotalSuccessData(0);
        } else {
          const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: 'Asia/Kolkata' // Set the timezone to Kolkata (UTC+05:30)
          };
  
          const successTransactions = data.filter(payment => payment.payment_status === 'PAYMENT_SUCCESS');
          const successData = successTransactions.map(payment => {
            const paymentTime = new Date(payment.payment_time);
            const formatter = new Intl.DateTimeFormat('en-IN', options);
            const formattedDateTime = formatter.format(paymentTime);
            const [transactionDate, transactionTime] = formattedDateTime.split(', ');
  
            return {
              status: payment.payment_status,
              amount: payment.payment_amount,
              payment_weburl: payment.payment_weburl,
              transactionDate,
              transactionTime
            };
          }).reverse();
  
          const successCount = successTransactions.length;
          const totalAmount = successData.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
  
          setSearchError('');
          setSuccessData(successData);
          setSuccessCount(successCount);
          setTotalSuccessData(totalAmount);
        }
      })
      .catch(error => {
        setSearchError('Error fetching data.');
        console.error('Error:', error);
      });
  };
  
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const chartData = {
    labels: dailySuccessData.map(data => data.date),
    datasets: [
      {
        label: 'Daily Successful Transactions',
        data: dailySuccessData.map(data => data.count),
        backgroundColor: '#5c3f60', // Light Orange
        borderColor: '#692172', // Orange
        borderWidth: 2,
        barThickness: 20,
        maxBarThickness: 20
      }
    ]
  };

  const calculateWebUrlData = () => {
    const webUrlMap = paymentData.reduce((acc, payment) => {
      const webUrl = payment.payment_weburl;
      if (!acc[webUrl]) acc[webUrl] = 0;
      acc[webUrl]++;
      return acc;
    }, {});

    const webUrlData = Object.keys(webUrlMap).map(webUrl => ({
      webUrl,
      count: webUrlMap[webUrl]
    }));

    setWebUrlData(webUrlData);
  };

  const lineChartData = {
    labels: webUrlData.map(data => data.webUrl),
    datasets: [
      {
        label: 'Transactions by Web URL',
        data: webUrlData.map(data => data.count),
        fill: false,
        borderColor: '#cb22e0d4',
        tension: 0.1
      }
    ]
  };



  return (
    <main className="main-container">
      <div className="p-5">
        <div className="main-cards">
          <div className="relative p-5 bg-gradient-to-r from-[#581c87] to-[#a78bfa] rounded-md overflow-hidden">
            <div className="relative z-10 mb-4 text-white text-4xl leading-none font-semibold">{totalTransactions}</div>
            <div className="relative z-10 text-white leading-none font-semibold">Total Transaction</div>
          </div>

          <div className="relative p-5 bg-gradient-to-r from-pink-400 to-pink-950 rounded-md overflow-hidden">
            <div className="relative z-10 mb-4 text-white text-4xl leading-none font-semibold">Rs.{totalAmount}</div>
            <div className="relative z-10 text-white leading-none font-semibold">Total Amount of SUCCESS</div>
          </div>

          <div className="relative p-5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-md overflow-hidden">
            <div className="relative z-10 mb-4 text-white text-4xl leading-none font-semibold">Rs.{totalPending}</div>
            <div className="relative z-10 text-white leading-none font-semibold">Total Amount of PENDING</div>
          </div>
        </div>

        <div className="flex">
          <div className="p-6 overflow-x-auto flex-grow">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
          </div>
          <div className="p-6 overflow-x-auto flex-grow">
            <Line data={lineChartData} />
          </div>
        </div>

        <div style={{ borderBottom: '1px solid #44023d', padding: '12px 0' }}></div>

        <div className="relative max-w-[19rem] mt-4">
          <DatePicker
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-s-lg text-sm block w-full  p-2.5 pr-5"
            placeholderText="Select date"
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="dd/M/yyyy"
          // onSelect={handleSearch}
          />

          <button
            type="button"
            className="absolute inset-y-0 right-5 flex items-center px-3 bgsearch text-white text-sm rounded-r-lg focus:outline-none"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <div className="mt-3">
          <section className="grid sm:grid-cols-2 gap-1 w-full max-w-6xl">
            <div className=" border border-gray-300 rounded-lg p-3 mt-3 flex">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-black">Total Successful Transactions</h3>
                <p className="text-white font-bold mt-1">
                  <span className='bgsearch px-3 py-1 rounded text-white'>Count&nbsp;:&nbsp;{successCount}</span>
                </p>
              </div>
              <div className="border-l border-gray-300 pl-3">
                <h3 className="text-lg font-semibold text-black">Total Amount</h3>
                <p className="text-white font-bold mt-1">
                  <span className='bgsearch px-3 py-1 rounded text-white'>Rs.{successTotalData.toLocaleString()}</span>
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="mt-4 w-full min-w-max table-auto text-left text-black">
            <thead>
              <tr className='text-black'>
                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Id
                  </p>
                </th>

                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Transaction Date
                  </p>
                </th>

                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Transaction Time
                  </p>
                </th>

                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Amount
                  </p>
                </th>
                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Status
                  </p>
                </th>
                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    WebURL
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {successData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-black py-4">
                    No records found.
                  </td>
                </tr>
              ) : (
                successData.length > 0 ? (
                  successData.map((payment, index) => (
                    <tr key={index}>

                    <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                                    {index + 1}
                                </p>
                            </div>
                        </div>
                    </td>
                    {/* <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                                    {payment.payment_txn_id}
                                </p>
                            </div>
                        </div>
                    </td> */}
                    <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                                    {payment.transactionDate}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                                    {payment.transactionTime}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex flex-col">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold ">
                                Rs.{payment.amount}
                            </p>
                        </div>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                        <div className="w-max">
                            <p className={`block antialiased font-sans text-sm leading-normal font-bold ${payment.status === 'PAYMENT_SUCCESS' ? 'text-green-900 bg-green-200' : payment.status === 'PAYMENT_PENDING' ? 'text-red-900 bg-red-200' : ''}`}>
                                {payment.status}
                            </p>
                        </div>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <p className="block antialiased font-sans text-sm text-[#831843] leading-normal text-blue-gray-900 font-bold">
                                {payment.payment_weburl}
                                </p>
                            </div>
                        </div>
                    </td>
                </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                        {searchError || 'No records found.'}
                      </p>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default TotalTransaction;
