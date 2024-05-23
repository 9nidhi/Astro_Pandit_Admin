import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import moment from 'moment-timezone'; // Ensure you are importing the timezone variant

const Payment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Use a Date object for DatePicker
  const [searchError, setSearchError] = useState('');
  const [filteredData, setFilteredData] = useState([]);

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
  


  const handleSearch = () => {
    if (!selectedDate) {
      setSearchError('Please select a date');
      return;
    }

    const searchDateStr = format(selectedDate, 'd/M/yyyy');
    console.log('searchDateStr =>', searchDateStr);

    const filteredData = paymentData.filter(item => {
      const itemDateStr = format(new Date(item.payment_time), 'd/M/yyyy');
      return itemDateStr === searchDateStr;
    });

    if (filteredData.length === 0) {
      setSearchError('No transactions found for the selected date');
    } else {
      setSearchError('');
    }

    setFilteredData(filteredData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col main-container px-4 text-sm">
      <div className="">
        <div className="mt-5">
          <div className="">
            <nav className="flex bg-gray-50 text-gray-700 border border-gray-200 py-3 px-5 rounded-lg" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href='/dashboard' className="text-sm text-gray-700 hover:text-gray-900 inline-flex items-center dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    <a href="#" className="text-gray-700 hover:text-gray-900 ml-1 md:ml-2 text-sm font-medium dark:text-gray-400">Payment</a>
                  </div>
                </li>
              </ol>
            </nav>

            <div style={{ borderBottom: '1px solid #44023d', padding: '12px 0' }}>
              {/* Content here */}
            </div>

            <div className="relative max-w-[19rem] mt-4">
              <DatePicker
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-s-lg text-sm block w-full p-2.5 pr-5"
                placeholderText="Select date"
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="d/M/yyyy"
              />

              <button
                type="button"
                className="absolute inset-y-0 right-12 flex items-center px-3 bgsearch text-white text-sm rounded-r-lg focus:outline-none"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          <div className="p-6 overflow-x-auto px-0">
            <table className="mt-4 w-full min-w-max table-auto text-left text-black">
              <thead>
                <tr>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                      Id
                    </p>
                  </th>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                      Transaction ID
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
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((payment, index) => (
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
                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                              {payment.payment_txn_id}
                            </p>
                          </div>
                        </div>
                      </td>
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
                            Rs.{payment.payment_amount}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="w-max">
                          <p className={`block antialiased font-sans text-sm leading-normal font-bold ${payment.payment_status === 'PAYMENT_SUCCESS' ? 'text-green-900 bg-green-200' : payment.payment_status === 'PAYMENT_PENDING' ? 'text-red-900 bg-red-200' : ''}`}>
                            {payment.payment_status}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                        {searchError || 'No records found.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {searchError && (
              <p className="mt-4 text-sm text-red-500">{searchError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
