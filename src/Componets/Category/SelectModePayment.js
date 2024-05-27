// import React, { useState } from 'react';
// import "../../../src/select.css";
// import phonepe from "../../../src/phonepe.png";
// import rozerpay from "../../../src/razorpay-logo.png";
// import both from "../../../src/both-removebg-preview.png"
// import Swal from 'sweetalert2';
// import toast, { Toaster } from 'react-hot-toast';

// const SelectModePayment = () => {
//     const [selectedMode, setSelectedMode] = useState('');

//     const handlePaymentModeSelect = (mode) => {
//         setSelectedMode(mode);

//         // Trigger SweetAlert pop-up
//         const style = `font-weight: bold; color: blue;`;

//         // Trigger SweetAlert pop-up
//         Swal.fire({
//             title: 'Are you sure?',
//             html: `You want to select <span style="${style}">${mode}</span> payment method?`,
//             icon: 'info',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Yes',
//             cancelButtonText: 'No'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 handleConfirmation(mode);
//             } else {
//                 setSelectedMode('');
//             }
//         });
//     };

//     const handleConfirmation = (mode) => {
//         // Make API call based on the selected payment mode abbreviation
//         fetch(`https://tronixpayment.axispay.cloud/api/payments/${mode}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({}),
//         })
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data);
//                 // Handle response as needed
//                 setSelectedMode('');
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
//                 // Handle error
//                 toast.error('An error occurred while selecting the payment method.');
//             });
//     };

//     return (
//         <main className="main-container">
//             <div className="p-5">
//                 <article className="card">
//                     <div className="card-title">
//                         <h2 className='text-[#44023d] text-center text-2xl font-bold'>Select Your Payment Mode</h2>
//                     </div>
//                     <div className="card-body">
//                         <div className="payment-type">
//                             <h4>Choose payment method below</h4>
//                             <div className="types">
//                                 <div className={`type ${selectedMode === 'PhonePe' ? 'active' : ''}`} onClick={() => handlePaymentModeSelect('PhonePe')}>
//                                     <div className="logo">
//                                         <img src={phonepe} alt="PhonePe Logo" style={{ height: '80px' }} />
//                                     </div>
//                                     <div className="text-[#44023d] font-bold">
//                                         <p className='text-lg'>Select PhonePe</p>
//                                     </div>
//                                 </div>
//                                 <div className={`type ${selectedMode === 'RozerPay' ? 'active' : ''}`} onClick={() => handlePaymentModeSelect('RozerPay')}>
//                                     <div className="logo">
//                                         <img src={rozerpay} alt="Razorpay Logo" style={{ height: '80px' }} />
//                                     </div>
//                                     <div className="text-[#44023d] font-bold">
//                                         <p>Select RozerPay</p>
//                                     </div>
//                                 </div>
//                                 <div className={`type ${selectedMode === 'Both' ? 'active' : ''}`} onClick={() => handlePaymentModeSelect('Both')}>
//                                     <div className="logo">
//                                         <img src={both} alt="Razorpay Logo" style={{ height: '65px' }} />
//                                     </div>
//                                     <div className="text-[#44023d] font-bold">
//                                         <p>Select Both</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <Toaster />
//                     </div>
//                 </article>
//             </div>
//         </main>
//     );
// };

// export default SelectModePayment;


import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import "../../../src/select.css";
import phonepe from "../../../src/phonepe.png";
import rozerpay from "../../../src/razorpay-logo.png";
import both from "../../../src/both-removebg-preview.png"
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import "../../../src/modal.css"

Modal.setAppElement('#root');

const SelectModePayment = () => {
    const [selectedMode, setSelectedMode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhonePe, setSelectedPhonePe] = useState(false);
    const [selectedRozerPay, setSelectedRozerPay] = useState(false);


    useEffect(() => {
        if (isModalOpen) {
            // Ensure PhonePe is selected when the modal opens
            setSelectedPhonePe(true);
            setSelectedRozerPay(true)
            
        }
    }, [isModalOpen]);

    const handlePaymentModeSelect = (mode) => {
        if (mode === 'Both') {
            setIsModalOpen(true);
        } else {
            setSelectedMode(mode);
            showConfirmationDialog(mode);
        }
    };

    const showConfirmationDialog = (mode) => {
        const style = `font-weight: bold; color: blue;`;

        Swal.fire({
            title: 'Are you sure?',
            html: `You want to select <span style="${style}">${mode}</span> payment method?`,
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
        fetch(`https://tronixpayment.axispay.cloud/api/payments/${mode}`, {
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
        e.preventDefault(); // Prevent the default form submission behavior
    
        // Determine which payment options are selected
        const phonePeSelected = selectedPhonePe;
        const rozerPaySelected = selectedRozerPay;
    
        // Check if any payment option is selected
        if (phonePeSelected || rozerPaySelected) {
            // Make the API call
            fetch(`https://tronixpayment.axispay.cloud/api/payments/${phonePeSelected && rozerPaySelected ? 'Both' : phonePeSelected ? 'phonepe' : 'rozerpay'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phonePeSelected,
                    rozerPaySelected
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // Reset selected options
                    setSelectedPhonePe(false);
                    setSelectedRozerPay(false);
                    setIsModalOpen(false)
                    toast.success('Your payment method is successfully selected!', {
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
            // Handle case when no payment option is selected
            toast.error('Please select a payment method.');
        }
    };
    

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
                            <div className="types">
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
                            <div style={{ display: 'flex', alignItems: 'center' }} className='selectox' onClick={() => setSelectedPhonePe(!selectedPhonePe)}>
                                <input
                                    type="radio"
                                    id="phonepe"
                                    name="phonepe"
                                    className="w-4 h-4 text-indigo-600"
                                    checked={selectedPhonePe}
                                    onChange={() => { }}
                                />
                                <label className='font-bold px-3' style={{ color: "#44023d" }}>PhonePe</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }} className='selectox' onClick={() => setSelectedRozerPay(!selectedRozerPay)}>
                                <input
                                    type="radio"
                                    id="rozerpay"
                                    name="rozerpay"
                                    className="w-4 h-4 text-indigo-600"
                                    checked={selectedRozerPay}
                                    onChange={() => { }}
                                />
                                <label className='font-bold px-3' style={{ color: "#44023d" }}>RozerPay</label>
                            </div>

                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default SelectModePayment;
