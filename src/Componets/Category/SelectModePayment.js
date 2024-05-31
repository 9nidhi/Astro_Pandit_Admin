



import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import "../../../src/select.css";
import phonepe from "../../../src/phonepe.png";
import rozerpay from "../../../src/razorpay-logo.png";
import both from "../../../src/both-removebg-preview.png";
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import "../../../src/modal.css";
import upi from "../../../src/free-upi-2085056-1747946.png"
import qrcode from "../../../src/istockphoto-1347277582-612x612.jpg"

Modal.setAppElement('#root');

const SelectModePayment = () => {
    const [selectedMode, setSelectedMode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhonePe, setSelectedPhonePe] = useState(false);
    const [selectedRozerPay, setSelectedRozerPay] = useState(false);
    const [selectUpi, setSelectUpi] = useState(false);
    const [selectedModes, setSelectedModes] = useState([]);
    const [activeMode, setActiveMode] = useState('');
    const [upiId, setUpiId] = useState('');
    const [upiOpen, setUpiIsOpen] = useState(false)
    const [qrcodeOpen, setQrCodeOpen] = useState(false)
    const [upiIds, setUpiIds] = useState([]); //qr code


    useEffect(() => {
        if (qrcodeOpen) {
            // Fetch UPI IDs when the QR code modal is opened
            fetchUPIIds();
        }
    }, [qrcodeOpen]);

    const fetchUPIIds = () => {
        fetch('http://localhost:4700/api/qrcode_payment')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Extract UPI IDs from the response data
                const { upiIds } = data;
                setUpiIds(upiIds);
            })
            .catch(error => {
                console.error('Error fetching UPI IDs:', error);
                toast.error('An error occurred while fetching UPI IDs.');
            });
    };



    useEffect(() => {
        if (isModalOpen) {
            setSelectedPhonePe(true);
            setSelectedRozerPay(false);
        }
    }, [isModalOpen]);

    const handlePaymentModeSelect = (mode) => {
        if (mode === 'Both') {
            setIsModalOpen(true);
        } else if (mode === 'Phonepe App') {
            setUpiIsOpen(true);
        }
        else {
            setSelectedMode(mode);
            showConfirmationDialog(mode);
        }
    };

    const showConfirmationDialog = (mode) => {
        const style = `font-weight: bold; color: blue;`;
        let confirmationHtml = `You want to select <span style="${style}">${mode}</span> payment method?`;

        if (mode === 'QR Code') {
            confirmationHtml += '<br /><br />Available UPI IDs:<br />';
            if (upiIds.length > 0) {
                upiIds.forEach(upiId => {
                    confirmationHtml += `<span>${upiId}</span><br />`;
                });
            } else {
                confirmationHtml += 'No UPI IDs available';
            }
        }

        Swal.fire({
            title: 'Are you sure?',
            html: confirmationHtml,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirmation(mode);
            } else {
                setSelectedMode('');
            }
        });
    };



    const handleConfirmation = (mode) => {
        fetch(`http://localhost:4700/api/payments/${mode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setSelectedMode('');
                toast.success(`Your payment method ${mode} is successfully selected!`, {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('An error occurred while selecting the payment method.');
            });
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();

        const selectedOptions = [];
        let activeOption = '';

        if (selectedPhonePe) {
            selectedOptions.push('PhonePe');
            activeOption = 'PhonePe';
        }
        if (selectedRozerPay) {
            selectedOptions.push('RozerPay');
            activeOption = 'RozerPay';
        }
        if (selectUpi) {
            selectedOptions.push('Phonepe App');
            activeOption = 'Phonepe App';
        }
        if (qrcodeOpen) {
            selectedOptions.push('QR Code');
            activeOption = 'QR Code';
        }

        if (selectedOptions.length > 0) {
            fetch(`http://localhost:4700/api/payments/Both?selected_payment=${selectedOptions.join(',')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setSelectedPhonePe(false);
                    setSelectedRozerPay(false);
                    setSelectUpi(false);
                    setQrCodeOpen(false);
                    setIsModalOpen(false);
                    toast.success(`Your payment method ${activeOption} is successfully selected!`, {
                        duration: 4000,
                        position: 'top-center',
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    toast.error('An error occurred while selecting the payment method.');
                });
        } else {
            toast.error('Please select at least one payment method.');
        }
    };

    // const handleModalSubmit = (e) => {
    //     e.preventDefault();

    //     const mode = selectedPhonePe ? 'PhonePe' : selectedRozerPay ? 'RozerPay' : selectUpi ? 'Phonepe App' : qrcodeOpen ? 'QR Code' : '';

    //     if (mode) {
    //         fetch(`http://localhost:4700/api/payments/Both?selected_payment=${mode}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({}),
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 console.log(data);
    //                 setSelectedPhonePe(false);
    //                 setSelectedRozerPay(false);
    //                 setSelectUpi(false)
    //                 setQrCodeOpen(false);
    //                 setIsModalOpen(false);
    //                 toast.success(`Your payment method ${mode} is successfully selected!`, {
    //                     duration: 4000,
    //                     position: 'top-center',
    //                     style: {
    //                         fontSize: '16px',
    //                         fontWeight: 'bold',
    //                     }
    //                 });
    //             })
    //             .catch(error => {
    //                 console.error('Error:', error);
    //                 toast.error('An error occurred while selecting the payment method.');
    //             });
    //     } else {
    //         toast.error('Please select a payment method.');
    //     }
    // };






    const handlePhonePeSelect = () => {
        setSelectedPhonePe(true);
        setSelectedRozerPay(false);
        setSelectUpi(false)
        setQrCodeOpen(false);
    };

    const handleRozerPaySelect = () => {
        setSelectedPhonePe(false);
        setSelectedRozerPay(true);
        setSelectUpi(false)
        setQrCodeOpen(false);
    };

    const handleUpiSelect = () => {

        setSelectedPhonePe(false);
        setSelectedRozerPay(false);
        setSelectUpi(true)
        setQrCodeOpen(false);


    };



    const handleQRSelect = () => {
        setQrCodeOpen(true);
        setSelectedPhonePe(false);
        setSelectedRozerPay(false);
        setSelectUpi(false);
    };

    const handleUpiSubmit = (e) => {
        e.preventDefault();

        if (upiId) {
            fetch('http://localhost:4700/api/upi_payment/1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ upi_id: upiId }), // Include payment_type as QR Code
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    setUpiId('');
                    setUpiIsOpen(false);
                    toast.success(`Your UPI ID ${upiId} is successfully submitted!`, {
                        duration: 4000,
                        position: 'top-center',
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }
                    });
                    // After successful submission, fetch the updated QR Code data
                    // fetchQRCodeData();
                })
                .catch(error => {
                    console.error('Error:', error);
                    toast.error('An error occurred while submitting the UPI ID.');
                });
        } else {
            toast.error('Please enter a UPI ID.');
        }
    };


    // const handleUpiSubmit = (e) => {
    //     e.preventDefault();

    //     if (upiId) {
    //         fetch(`https://tronixpayment.axispay.cloud/api/upi_payment/1`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ upi_id: upiId }),
    //         })
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error('Network response was not ok');
    //                 }
    //                 return response.json();
    //             })
    //             .then(data => {
    //                 console.log(data);
    //                 setUpiId('');
    //                 setUpiIsOpen(false);
    //                 toast.success(`Your UPI ID ${upiId} is successfully submitted!`, {
    //                     duration: 4000,
    //                     position: 'top-center',
    //                     style: {
    //                         fontSize: '16px',
    //                         fontWeight: 'bold',
    //                     }
    //                 });
    //             })
    //             .catch(error => {
    //                 console.error('Error:', error);
    //                 toast.error('An error occurred while submitting the UPI ID.');
    //             });
    //     } else {
    //         toast.error('Please enter a UPI ID.');
    //     }
    // };





    return (
        <main className="main-container">
            <div className="p-5">
                <article className="card">
                    <div className="card-title">
                        <h2 className='text-[#44023d] text-center text-2xl font-bold'>Select Your Payment Mode</h2>
                    </div>
                    <div className="card-body">
                        <div className="payment-type">
                            <h4>Choose payment method below</h4>
                            <div className="types" style={{ display: 'flex' }}>
                                <div className={`type ${selectedMode === 'PhonePe' ? 'active' : ''}`} onClick={() => handlePaymentModeSelect('PhonePe')}>
                                    <div className="logo">
                                        <img src={phonepe} alt="PhonePe Logo" style={{ height: '80px' }} />
                                    </div>
                                    <div className="text-[#44023d] font-bold">
                                        <p className='text-lg'>Select PhonePe</p>
                                    </div>
                                </div>
                                <div className={`type ${selectedMode === 'RozerPay' ? 'active' : ''}`} onClick={() => handlePaymentModeSelect('RozerPay')}>
                                    <div className="logo">
                                        <img src={rozerpay} alt="Razorpay Logo" style={{ height: '80px' }} />
                                    </div>
                                    <div className="text-[#44023d] font-bold">
                                        <p>Select RozerPay</p>
                                    </div>
                                </div>
                                <div className={`type ${selectedMode === 'UpiID' ? 'active' : ''}`} onClick={() => handlePaymentModeSelect('Phonepe App')}>
                                    <div className="logo">
                                        <img src={upi} alt="Razorpay Logo" style={{ height: '90px' }} />
                                    </div>
                                    <div className="text-[#44023d] font-bold">
                                        <p>Select Upi ID</p>
                                    </div>
                                </div>
                                <div className={`type ${selectedMode === 'QR Code' ? 'active' : ''}`} onClick={() => handlePaymentModeSelect('QR Code')}>
                                    <div className="logo">
                                        <img src={qrcode} alt="Both Logo" style={{ height: '65px' }} />
                                    </div>
                                    <div className="text-[#44023d] font-bold">
                                        <p>Select QR Code</p>
                                    </div>
                                </div>
                                <div className={`type ${selectedMode === 'Both' ? 'active' : ''}`} onClick={() => handlePaymentModeSelect('Both')}>
                                    <div className="logo">
                                        <img src={both} alt="Both Logo" style={{ height: '65px' }} />
                                    </div>
                                    <div className="text-[#44023d] font-bold">
                                        <p>Select Both</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Toaster />
                    </div>


                </article>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2 className="text-2xl font-bold mb-4 text-[black]">Select Payment Options</h2>
                        <form onSubmit={handleModalSubmit}>
                            <div style={{ display: 'flex', alignItems: 'center' }} className='selectox' onClick={handlePhonePeSelect}>
                                <input
                                    type="radio"
                                    id="phonepe"
                                    name="payment"
                                    className="w-4 h-4 text-indigo-600"
                                    checked={selectedPhonePe}
                                    onChange={() => { }}
                                />
                                <label className='font-bold px-3' style={{ color: "#44023d" }}>PhonePe</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }} className='selectox' onClick={handleRozerPaySelect}>
                                <input
                                    type="radio"
                                    id="rozerpay"
                                    name="payment"
                                    className="w-4 h-4 text-indigo-600"
                                    checked={selectedRozerPay}
                                    onChange={() => { }}
                                />
                                <label className='font-bold px-3' style={{ color: "#44023d" }}>RozerPay</label>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }} className='selectox' onClick={handleUpiSelect}>
                                <input
                                    type="radio"
                                    id="phonepeapp"
                                    name="payment"
                                    className="w-4 h-4 text-indigo-600"
                                    checked={selectUpi}
                                    onChange={() => { }}
                                />
                                <label className='font-bold px-3' style={{ color: "#44023d" }}>Phonepe App</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }} className='selectox' onClick={handleQRSelect}>
                                <input
                                    type="radio"
                                    id="qrCode"
                                    name="payment"
                                    className="w-4 h-4 text-indigo-600"
                                    checked={qrcodeOpen}
                                    onChange={() => { }}
                                />
                                <label className='font-bold px-3' style={{ color: "#44023d" }}>QR Code</label>
                            </div>



                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}

            {/* upi id */}

            {upiOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setUpiIsOpen(false)}>&times;</span>
                        <h2 className="text-2xl font-bold mb-4 text-[black]">Enter Your Upi :</h2>
                        <form onSubmit={handleUpiSubmit}>
                            <div style={{ display: 'flex', alignItems: 'center' }} className='selectox'>
                                <input
                                    type="text"
                                    id="upi"
                                    name="upi"
                                    className="text-gray-900"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="Enter your UPI ID"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="btn-select">Submit</button>
                                {/* <button type="button bg-red-500" className="btn-close ml-5" onClick={() => setUpiIsOpen(false)}>Close</button> */}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* QR CODE */}
            {/* {qrcodeOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setQrCodeOpen(false)}>&times;</span>
                        <h2 className="text-2xl font-bold mb-4 text-[black]">Select Your Upi :</h2>
                        <form onSubmit={fetchUPIIds}>

                            <div style={{ display: 'flex', alignItems: 'center' }} className='selectox'>
                                <div className="upi-ids">
                                    {upiIds.length > 0 ? (
                                        upiIds.map((upiId, index) => (
                                            <div key={index} className="upi-id text-gray-900 font-bold">
                                                {upiId}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No UPI IDs available.</p>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="btn btn-primary" onClick={() => handleConfirmation('QR Code')}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}


        </main>
    );
};

export default SelectModePayment;
