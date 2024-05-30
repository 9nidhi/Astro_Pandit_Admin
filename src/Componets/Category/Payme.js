import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Pagination from '../Pagination';
import "../../../src/all.css";
import html2pdf from 'html2pdf.js';

import moment from 'moment-timezone'; // Ensure you are importing the timezone variant

const Payment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Use a Date object for DatePicker
  const [searchError, setSearchError] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTransactionId, setSearchTransactionId] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  // const totalPages = 10;

  const fetchData = async (page) => {
    try {
      const response = await fetch(`http://localhost:4700/api/data?page=${page}&limit=10`);
      if (response.ok) {
        const { results, totalCount } = await response.json();
        if (results) {
          const formattedData = results.map((item) => {
            const date = new Date(item.payment_time_local);
            const options = {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: true,
              timeZone: 'Asia/Kolkata'
            };

            const transactionDate = new Intl.DateTimeFormat('en-IN', options).format(date);
            const transactionTime = date.toLocaleTimeString('en-IN', { hour12: true, timeZone: 'Asia/Kolkata' });

            return {
              ...item,
              transactionDate,
              transactionTime,
              app_name: item.app_name,
              payer_name: item.payer_name,
              payer_email: item.payer_email,
              payment:item.payment
            };
          });

          setPaymentData(formattedData);
          setTotalPages(Math.ceil(totalCount / 10));
          setFilteredData(formattedData);
          setSearchError('');
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
    fetchData(currentPage);
  }, [currentPage]);


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

  // const handleSearchTransactionId = () => {
  //   if (!searchTransactionId.trim()) {
    
  //     setSearchError('Please enter a transaction ID');
  //     return;
  //   }

  //   const filteredData = paymentData.filter(item => item.payment_txn_id.includes(searchTransactionId));

  //   if (filteredData.length === 0) {
  //     setSearchError('No transactions found for the entered ID');
  //   } else {
  //     setSearchError('');
  //   }

  //   setFilteredData(filteredData);
  // };


  // useEffect(() => {
  //   fetchData(currentPage);
  // }, [currentPage]);



  const handleSearchTransactionId = () => {
    if (!searchTransactionId.trim()) {
      setSearchError('Please enter a transaction ID');
      return;
    }

    const foundTransaction = paymentData.find(item => item.payment_txn_id === searchTransactionId);
    if (!foundTransaction) {
      setSearchError('No transactions found for the entered ID');
      return;
    }

    setSearchError('');
    setSelectedTransaction(foundTransaction); // Set the found transaction as selected
    handleDownloadInvoice(foundTransaction); // Generate and download invoice for the found transaction
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDownloadInvoice = (selectedTransaction) => {
    if (!selectedTransaction) {
      console.error("No transaction selected.");
      return;
    }


    const invoiceContent = `
  <style>
  @import url("https://fonts.googleapis.com/css2?family=Redressed&family=Ubuntu:wght@400;700&display=swap");

:root {
  --bg-clr: #ead376;
  --white: #fff;
  --primary-clr: #2f2929;
  --secondary-clr: #f39c12;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Ubuntu", sans-serif;
}

body {
  background-color: #f5f5f5;
  font-size: 12px;
  line-height: 20px;
  color: var(--primary-clr);
  padding: 0 20px;
}

.invoice {
  width: 600px;
  max-width: 100%;
  height: 600px;
  background: var(--white);
  padding: 50px 60px;
  position: relative;
  margin: 20px auto;
  border: 1px solid #ddd;
}

.w_15 {
  width: 15%;
}

.w_50 {
  width: 50%;
}

.w_55 {
  width: 55%;
}

.p_title {
  font-weight: 700;
  font-size: 14px;
}

.i_row {
  display: flex;
}

.text_right {
  text-align: right;
  font-size: 15px;
  font-weight:bold;
}

.invoice .header .i_row {
  justify-content: space-between;
  margin-bottom: 30px;
}

.invoice .header .i_row:last-child {
  // align-items: flex-end;
}

.invoice .header .i_row .i_logo p {
  
}

.invoice .header .i_row .i_logo p,
.invoice .header .i_row .i_title h2 {
  font-size: 25px;
  line-height: 38px;
  color: var(--secondary-clr);
  font-weight: bold;
}

.invoice .header .i_row .i_address .p_title span {
  font-weight: bold;
  font-size: 13px;
  color:#f39c12;
}

.invoice .body .i_table .i_col p {
  font-weight: 700;
}
.i_table_body{
  font-size: 14px;
}
.invoice .body .i_table .i_row .i_col {
  padding: 12px 5px;
}

.invoice .body .i_table .i_table_head .i_row {
  border: 2px solid;
  border-color: var(--primary-clr) transparent var(--primary-clr) transparent;
}

.invoice .body .i_table .i_table_body .i_row:last-child {
  border-bottom: 2px solid var(--primary-clr);
}

.invoice .body .i_table .i_table_foot .grand_total_wrap {
  margin-top: 20px;
}

.invoice .body .i_table .i_table_foot .grand_total_wrap .grand_total {
  background: var(--secondary-clr);
  font-size: 17px;
  padding: 10px 15px;
  color:black;
}

.invoice .body .i_table .i_table_foot .grand_total_wrap .grand_total p {
  display: flex;
  justify-content: space-between;
}

.invoice .footer {
  margin-top: 63px;
}
.top_line,
.bottom_line {
  width: 25px;
  height: 175px;
  z-index: 1;
  position: absolute;
  background:#f39c12;
}

.top_line {
  top: 0;
  left: 0;
}

.bottom_line {
  bottom: 0;
  right: 0;
}

.top_line:before,
.bottom_line:before {
  content: "";
  position: absolute;
  border: 13px solid;
}

.top_line:before {
  bottom: 0;
  left: 0px;
  border-color: transparent var(--white) var(--white) transparent;
}

.bottom_line:before {
  top: 0;
  left: 0px;
  border-color: var(--white) transparent transparent var(--white);
}
.footer {
  text-align: center;
  font-size: 14px;
  color: #7f8c8d;
}
.border{
  border-bottom: 1px solid;
}
.address{
  margin-top: 5px;
}
  </style>
  <section>
  <div class="invoice">
    <div class="top_line"></div>
    <div class="header">
      <div class="i_row">
        <div class="i_logo">
          <p>VARNITECH INFOSOFT</p>
        </div>
        <div class="i_title">
          <h2>INVOICE</h2>
          <p class="p_title text_right">${moment().format('DD-MM-YYYY')}</p>
        </div>
      </div>
      <div class="i_row">
        <div class="i_number">
          <p class="p_title">Transaction ID : ${selectedTransaction.payment_txn_id}</p>
        </div>
        <div class="i_address text_right">
          <p>BILLING TO</p>
          <p class="p_title">
      
            <span >${selectedTransaction.payer_name}</span><br />
            <span>${selectedTransaction.payer_email}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="i_table">
        <div class="i_table_head">
          <div class="i_row">
            <div class="i_col w_15">
              <p class="p_title">QTY</p>
            </div>
            <div class="i_col w_55">
              <p class="p_title">DESCRIPTION</p>
            </div>
            <div class="i_col w_15">
              <p class="p_title">PRICE</p>
            </div>
            <div class="i_col w_15">
              <p class="p_title">TOTAL</p>
            </div>
          </div>
        </div>
        <div class="i_table_body">
          <div class="i_row">
            <div class="i_col w_15">
              <p>1</p>
            </div>
            <div class="i_col w_55">
              <p>Numerology Gold Record</p>
              
            </div>
            <div class="i_col w_15">
              <p>₹${selectedTransaction.payment_amount}</p>
            </div>
            <div class="i_col w_15">
              <p>₹${selectedTransaction.payment_amount}</p>
            </div>
          </div>
        </div>
        <div class="i_table_foot">
          <div class="i_row">
            <div class="i_col w_15">
              <p></p>
            </div>
            <div class="i_col w_55">
              <p></p>
            </div>
            
          </div>
          <div class="i_row grand_total_wrap">
            <div class="i_col w_50">
            </div>
            <div class="i_col w_50 grand_total text_right">
              <p><span>GRAND TOTAL:</span>
                <span>₹${selectedTransaction.payment_amount}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
    <p class="border">VARNITECH INFOSOFT</p>
    <p class="address">FH-22, SWASTIK PLAZA, SWASTIK PLAZA, SURAT, GUJARAT, INDIA - 395010</p>
    </div>
    <div class="bottom_line"></div>
  </div>
</section>
`;
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice.html'; // Set the filename for the download
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };


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
            </div>

            <div class=" mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                <div class="flex justify-start  rounded-xl mt-4 ml-3">

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
                      className="absolute inset-y-0 right-[-3rem] flex items-center px-3 bgsearch text-white text-sm rounded-r-lg focus:outline-none"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>

                </div>
                <div class="flex justify-center  rounded-xl  "></div>

                <div class="flex justify-center  rounded-xl  ">


                </div>

                <div class="flex justify-start  rounded-xl mt-4 ml-3">

                  {/* <button class="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => handleDownloadInvoice(selectedTransaction)}>
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                    <span>Download</span>
                  </button> */}

                  <div className="relative max-w-[19rem] mt-4">
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-s-lg text-sm block w-full p-2.5 pr-5"
                      placeholder="Search Transaction ID"
                      value={searchTransactionId}
                      onChange={(e) => setSearchTransactionId(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-[-62px] flex items-center px-3 bgsearch text-white text-sm rounded-r-lg focus:outline-none"
                      onClick={handleSearchTransactionId}
                    >
                      Search
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="flex justify-end p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
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
                      Payer Name
                    </p>
                  </th>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                      Payer Email
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
                      Payment Mode
                    </p>
                  </th>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                      Status
                    </p>
                  </th>
                  <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                      App_Name
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
                              {payment.payer_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                              {payment.payer_email}
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
                      {/* <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                              {payment.transactionTime}
                            </p>
                          </div>
                        </div>
                      </td> */}
                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex flex-col">
                          <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold ">
                            Rs.{payment.payment_amount}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex flex-col">
                          <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold ">
                            {payment.payment} 
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
                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="w-max">
                          <p className={`block antialiased font-sans text-sm leading-normal font-bold ${payment.payment_status === 'PAYMENT_SUCCESS' ? 'text-green-900 bg-green-200' : payment.payment_status === 'PAYMENT_PENDING' ? 'text-red-900 bg-red-200' : ''}`}>
                            {payment.app_name}
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
