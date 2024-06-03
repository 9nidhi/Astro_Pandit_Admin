import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import "../../../src/select.css";
import phonepe from "../../../src/phonepe.png";
import rozerpay from "../../../src/razorpay-logo.png";
import both from "../../../src/both-removebg-preview.png";
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import "../../../src/modal.css";
import upi from "../../../src/free-upi-2085056-1747946.png";
import qrcode from "../../../src/istockphoto-1347277582-612x612.jpg";

Modal.setAppElement('#root');

const SelectModePayment = () => {
    const [selectedMode, setSelectedMode] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUpiId, setCurrentUpiId] = useState('');
    const [paymentOptions, setPaymentOptions] = useState({
        RozerPay: false,
        PhonePe: false,
        "Phonepe App": false,
        "QR Code": false,
        bothMode: '',
        upiId: '',
    });
    const [upiIds, setUpiIds] = useState([]);
    const [upiIsOpen, setUpiIsOpen] = useState(false);

    useEffect(() => {
        if (paymentOptions["QR Code"]) {
            fetchUPIIds();
        }
    }, [paymentOptions["QR Code"]]);

    useEffect(() => {
        // if (paymentOptions["Phonepe App"]) {
            fetchCurrentUpiId();
        // }
    });


    // Function to fetch the current UPI ID from the backend
    const fetchCurrentUpiId = () => {
        // Replace ':id' with the appropriate ID you want to fetch
        const id = 1; // Example ID, replace with your actual ID
        fetch(`https://tronixpayment.axispay.cloud/api/upi/${id}`)
            .then(response => response.json())
            .then(data => {
                setCurrentUpiId(data.upi_id);
            })
            .catch(error => {
                console.error('Error fetching current UPI ID:', error);
                toast.error('An error occurred while fetching current UPI ID.');
            });
    };


    const fetchUPIIds = () => {
        fetch('https://tronixpayment.axispay.cloud/api/qrcode_payment')
            .then(response => response.json())
            .then(data => {
                const { upiIds } = data;
                setUpiIds(upiIds);
            })
            .catch(error => {
                console.error('Error fetching UPI IDs:', error);
                toast.error('An error occurred while fetching UPI IDs.');
            });
    };

    const handlePaymentModeSelect = (mode) => {
        if (mode === 'Both') {
            setIsModalOpen(true);
        }else if (mode === 'Phonepe App') {
            setUpiIsOpen(true); // Open the modal for UPI ID entry
        } else {
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
        fetch(`https://tronixpayment.axispay.cloud/api/paymentsingle/${mode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setSelectedMode((prevModes) => [...prevModes, mode]);
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

        const selectedPayments = {};
        let bothModeSelected = false; // Flag to check if both modes are selected

        if (paymentOptions.PhonePe) selectedPayments.PhonePe = 0;
        if (paymentOptions.RozerPay) selectedPayments.RozerPay = 0;
        if (paymentOptions["Phonepe App"]) selectedPayments["Phonepe App"] = 0;
        if (paymentOptions["QR Code"]) {
            selectedPayments["QR Code"] = 0;
            bothModeSelected = true; // Set flag if QR Code is selected
        }

        if (paymentOptions.bothMode) {
            bothModeSelected = true;
            selectedPayments[paymentOptions.bothMode] = 1;
        }

        // Update bothMode value based on bothModeSelected flag
        const bothModeValue = bothModeSelected ? 1 : 0;

        fetch(`https://tronixpayment.axispay.cloud/api/payments/Both?selected_payment=${JSON.stringify(selectedPayments)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedPayments, bothMode: bothModeValue }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setSelectedMode(Object.keys(selectedPayments));
                setPaymentOptions({
                    RozerPay: false,
                    PhonePe: false,
                    "Phonepe App": false,
                    "QR Code": false,
                    bothMode: '',
                    upiId: '',
                });
                setIsModalOpen(false);
                toast.success('Your payment methods are successfully selected!', {
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
                toast.error('An error occurred while selecting the payment methods.');
            });
    };


    const handleOptionChange = (e) => {
        const { name, checked } = e.target;
        setPaymentOptions((prevOptions) => ({
            ...prevOptions,
            [name]: checked,
        }));
    };

    const handleBothModeChange = (e) => {
        setPaymentOptions((prevOptions) => ({
            ...prevOptions,
            bothMode: e.target.value,
        }));
    };

    const handleUpiSubmit = (e) => {
        e.preventDefault();
        const confirmation = window.confirm('Are you sure you want to submit the UPI ID?');
        if (confirmation) {
            fetch(`https://tronixpayment.axispay.cloud/api/upi_payment/1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ upi_id: paymentOptions.upiId })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setUpiIds([...upiIds, paymentOptions.upiId]);
                setPaymentOptions((prevOptions) => ({
                    ...prevOptions,
                    upiId: '',
                }));
                setUpiIsOpen(false);
                toast.success('UPI ID updated successfully');
            })
            .catch(error => {
                console.error('Error updating UPI ID:', error);
                toast.error('An error occurred while updating UPI ID');
            });
        }
    };
    
    
    const handleUpiIdChange = (e) => {
        setPaymentOptions((prevOptions) => ({
            ...prevOptions,
            upiId: e.target.value,
        }));
    };

    console.log('currentUpiId =>',currentUpiId);
    

    return (
        <main className="main-container">
            <div className="p-5">
                <article className="card">
                    <div className="card-title">
                        <h2 className='text-[#44023d] text-center text-2xl font-bold'>Select Your Payment Method Below</h2>
                    </div>
                    <div className="card-body">
                        <div className="payment-type">
                       
                            <div className="types"  style={{ display: 'flex', justifyContent: 'space-between',gap:'20px' }}>
                                {['PhonePe', 'RozerPay', 'Phonepe App', 'QR Code', 'Both'].map((mode, index) => (
                                    <div
                                        key={index}
                                        className={`type ${selectedMode.includes(mode) ? 'active' : ''}`}
                                        onClick={() => handlePaymentModeSelect(mode)}
                                        style={{ flex: '2' }} 
                                    >
                                        <div className="logo">
                                            <img
                                                src={
                                                    mode === 'PhonePe' ? phonepe :
                                                        mode === 'RozerPay' ? rozerpay :
                                                            mode === 'Phonepe App' ? upi :
                                                                mode === 'QR Code' ? qrcode : both
                                                }
                                                alt={`${mode} Logo`}
                                                style={{ height: mode === 'UpiID' ? '90px' : '80px' }}
                                            />
                                        </div>
                                        <div className="text-[#44023d] font-bold">
                                            <p className='text-lg'> {mode}</p>
                                        </div>
                                    </div>
                                ))}
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
                        <h2 className="text-2xl font-bold mb-4 text-[black]">Select Mode for Both</h2>
                        <form onSubmit={handleModalSubmit}>
                            {[
                                { id: "PhonePe", name: "PhonePe", label: "PhonePe" },
                                { id: "RozerPay", name: "RozerPay", label: "RozerPay" },
                                { id: "Phonepe App", name: "Phonepe App", label: "Phonepe App" },
                                { id: "QR Code", name: "QR Code", label: "QR Code" }
                            ].map((option) => (
                                <div key={option.id} className="modal-row selectox">
                                    <input
                                        type="checkbox"
                                        id={option.id}
                                        name={option.name}
                                        checked={paymentOptions[option.name]}
                                        onChange={handleOptionChange}
                                        className='text-gray-900 '
                                    />
                                    <label htmlFor={option.id} className="text-[#44023d] px-3 font-bold">{option.label}</label>
                                </div>
                            ))}
                            <div className="modal-row">
                                <label className="text-[#44023d] font-bold">Select the active mode for Both:</label>
                                {['PhonePe', 'RozerPay', 'Phonepe App', 'QR Code'].map((mode) => (
                                    paymentOptions[mode] && (
                                        <div key={mode} className="modal-row selectox mt-3">
                                            <input
                                                type="radio"
                                                id={`both-mode-${mode}`}
                                                name="bothMode"
                                                value={mode}
                                                checked={paymentOptions.bothMode === mode}
                                                onChange={handleBothModeChange}
                                                className='text-gray-900'
                                            />
                                            <label htmlFor={`both-mode-${mode}`} className="text-[#44023d] px-2 font-bold">{mode}</label>
                                        </div>
                                    )
                                ))}
                            </div>
                            <button type="submit" className="text-[#44023d]">Submit</button>
                        </form>
                    </div>
                </div>
            )}

            {upiIsOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setUpiIsOpen(false)}>&times;</span>
                        <h2 className="text-2xl font-bold mb-4 text-[black]">Submit Your UPI ID</h2>
                        <form onSubmit={handleUpiSubmit}>
                            <div className="modal-row selectox">
                                <label htmlFor="upi-id" className="text-[#44023d]">Enter UPI ID:</label>
                                <input
                                    type="text"
                                    id="upi-id"
                                    value={paymentOptions.upiId || currentUpiId} // Display the current UPI ID if available
                                    onChange={handleUpiIdChange} // Handle changes in the UPI ID input field
                                    className='text-gray-900'
                                />
                            </div>
                            <button type="submit" className="text-[#44023d]">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default SelectModePayment;


