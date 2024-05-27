import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = "https://cl-backend.kryptocoder.com/api/";

const MemberDashboard = () => {
    const [memberData, setMemberData] = useState(null);
    const [partnersData, setPartnersData] = useState([]);
    const [loyaltyOptions, setLoyaltyOptions] = useState([]);
    const [accountNumber, setAccountNumber] = useState(null);
    const [cardId, setCardId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const sessionMemberData = sessionStorage.getItem('memberData');
        if (sessionMemberData) {
            const data = JSON.parse(sessionMemberData);
            setMemberData(data);
            setPartnersData(data.partnersData);
            setAccountNumber(JSON.parse(localStorage.getItem('accountNumber')));
            setCardId(JSON.parse(localStorage.getItem('cardId')));
        } else {
            navigate('/index.html');
        }
    }, [navigate]);

    const updateMember = async () => {
        try {
            const inputData = JSON.stringify({
                accountnumber: accountNumber,
                cardid: cardId,
            });

            const response = await axios.post(`${apiUrl}memberData`, inputData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data.error) {
                alert(response.data.error);
            } else {
                localStorage.setItem('accountNumber', JSON.stringify(accountNumber));
                localStorage.setItem('cardId', JSON.stringify(cardId));
                sessionStorage.setItem('memberData', JSON.stringify(response.data));
                updatePoints(response.data.points);
                navigate('/sample-page');
            }
        } catch (error) {
            alert("Error: Try again");
            console.error(error);
        }
    };

    const updatePoints = async (points) => {
        if (memberData) {
            try {
                const updatedMemberData = { ...memberData, points };
                sessionStorage.setItem('memberData', JSON.stringify(updatedMemberData));
                setMemberData(updatedMemberData);

                const inputData = JSON.stringify({
                    accountnumber: memberData.accountNumber,
                    cardid: cardId,
                    points: points,
                });

                await axios.post(`${apiUrl}updatePoints`, inputData, {
                    headers: { 'Content-Type': 'application/json' },
                });

                console.log("Points updated in the database");
            } catch (error) {
                console.error("Error updating points in the database:", error);
            }
        }
    };

    const earnPoints = async (formPoints) => {
        try {
            const formPartnerId = document.querySelector('.earn-partner select').value;
            if (!formPartnerId) {
                alert("Select a partner first");
                return;
            }

            formPoints = parseFloat(formPoints);
            if (isNaN(formPoints) || formPoints <= 0) {
                alert("Enter a valid number of points");
                return;
            }

            const getISTString = (date) => date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            const timestamp = getISTString(new Date());
            const transactionID = generateTransactionID();

            const transactionData = {
                timestamp,
                partner: formPartnerId,
                member: accountNumber,
                points: formPoints,
                transactionID,
            };

            const inputData = JSON.stringify({
                accountnumber: accountNumber,
                cardid: cardId,
                points: formPoints,
                partnerid: formPartnerId,
            });

            console.log(inputData);

            const response = await axios.post(`${apiUrl}earnPoints`, inputData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data.error) {
                let error = response.data.error;
                if (error.includes("Error")) {
                    error = error.slice(error.indexOf("Error"));
                }
                alert(error);
            } else {
                updateMember();
                alert('Transaction successful');
                const pointsElement = document.querySelector('.heading-3');
                const currentPoints = parseInt(pointsElement.innerHTML);
                const newPoints = currentPoints + parseInt(formPoints);
                updatePoints(newPoints);
                document.querySelector('.earn-partner select').value = '';
                document.querySelector('.earnPoints input').value = '';
                document.getElementById('earnloyalty').innerHTML = '';
            }
        } catch (error) {
            alert("Error: Try again");
            console.error(error);
        }
    };

    const handlePartnerChange = async (event) => {
        try {
            const partnerId = event.target.value;
            const inputData = JSON.stringify({
                partnerId: partnerId,
                cardId: cardId,
            });

            const response = await axios.post(`${apiUrl}addOfferTransactions`, inputData, {
                headers: { 'Content-Type': 'application/json' },
            });

            const transactionData = response.data.success;
            setLoyaltyOptions(transactionData.map(option => ({
                points: option.points,
                text: `Purchase ${option.product} for $${option.price} and earn ${option.points} points`,
            })));
        } catch (error) {
            console.error("Error fetching loyalty options:", error);
        }
    };

    const handleEarnPointsTransaction = async (event) => {
        event.preventDefault();
        const formPoints = document.querySelector('.earnPoints input').value;
        await earnPoints(formPoints);
    };

    const handleLoyaltyOptionChange = async (event) => {
        event.preventDefault();
        const formPoints = event.target.value;
        await earnPoints(formPoints);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('memberData');
        navigate('/index.html');
    };

    const generateTransactionID = () => {
        const characters = 'abcdef0123456789';
        let transactionId = '';
        for (let i = 0; i < 64; i++) {
            transactionId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return transactionId;
    };

    if (!memberData) return null;

    return (
        <div className="member-dashboard">
            <h1 className="heading-1">{memberData.firstName} {memberData.lastName}</h1>
            <h2 className="heading-2">{memberData.accountNumber}</h2>
            <h3 className="heading-3">{memberData.points}</h3>
            <button onClick={handleLogout}>Logout</button>
            <div className="earn-points">
                <div className="earn-partner">
                    <select onChange={handlePartnerChange}>
                        <option value="" disabled selected>Select a partner</option>
                        {partnersData.map(partner => (
                            <option key={partner.id} value={partner.id}>{partner.name}</option>
                        ))}
                    </select>
                </div>
                <div id="earnloyalty">
                    <select onChange={handleLoyaltyOptionChange}>
                        <option value="" disabled selected>Select a transaction</option>
                        {loyaltyOptions.map((option, index) => (
                            <option key={index} value={option.points}>{option.text}</option>
                        ))}
                    </select>
                </div>
                <div className="earnPoints">
                    <input type="number" placeholder="Enter points" />
                    <button onClick={handleEarnPointsTransaction}>Earn Points</button>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
