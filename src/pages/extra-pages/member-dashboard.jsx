import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Form as BootstrapForm } from 'react-bootstrap';
import MainCard from 'components/MainCard';
import axios from 'axios';
import './MemberDashboard.css';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    dropdown: Yup.string().required('Please select an option'),
    points: Yup.string().required('Please enter points'),
});

const apiUrl = "https://cl-backend.kryptocoder.com/api/";

export default function MemberDashboard() {
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

    const updateMember = async (accountNumber, cardId) => {
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
                navigate('/member-dashboard');
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

    const earnPoints = async (formPoints, formPartnerId) => {
        try {
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
                updateMember(accountNumber, cardId);
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

    const handleEarnPointsTransaction = async (values) => {
        const formPoints = values.points;
        await earnPoints(formPoints, values.dropdown);
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
        <MainCard title="">
            <Container fluid>
                <Row>
                    <Col>
                        <h1>Member Dashboard</h1>
                        <div className="separator mb-5"></div>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <Card className="member-card">
                            <Card.Body>
                                <Row className="icon-cards-row">
                                    <Col md={4} lg={4} sm={4} xs={12} className="mb-2">
                                        <Card className="text-center">
                                            <Card.Body>
                                                <i className="iconsminds-user"></i>
                                                <div className='card-row'>
                                                    <p className="card-text font-weight-semibold mt-10 mb-10 card-title">User:</p>
                                                    <p className="lead text-center heading-1" id="heading-1">
                                                        {memberData ? `${memberData.firstName} ${memberData.lastName}` : ''}
                                                    </p>
                                                </div>
                                            </Card.Body>
                                          </Card>
                                            </Col>
                                    <Col md={4} lg={4} sm={4} xs={12} className="mb-2">
                                        <Card className="text-center">
                                            <Card.Body>
                                                <i className="iconsminds-id-card"></i>
                                                <div className='card-row'>
                                                    <p className="card-text mb-0  card-title">Account ID:</p>
                                                    <p className="lead text-center heading-2" id="heading-2">
                                                        {memberData ? memberData.accountNumber : ''}
                                                    </p>
                                                </div> 
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} lg={4} sm={4} xs={12} className="mb-2">
                                        <Card className="text-center">
                                            <Card.Body>
                                                <i className="iconsminds-diamond"></i>
                                                <div className="card-row">
                                                    <p className="card-text mb-0  card-title">Points:</p>
                                                    <p className="lead text-center heading-3" id="heading-3">
                                                        {memberData ? memberData.points : ''}
                                                    </p>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col md={9}>
                        <Card className="purchase-card mb-4">
                            <Card.Body>
                                <h2 className="mb-4">Purchase and Earn</h2>
                                <div className="separator mb-5"></div>
                                <div className="form-side d-flex justify-content-center mb-4">
                                    <Col md={7}>
                                        <Formik
                                            initialValues={{ dropdown: '', loyalty: '', points: '' }}
                                            validationSchema={validationSchema}
                                            onSubmit={handleEarnPointsTransaction}
                                        >
                                            {({ handleSubmit, setFieldValue }) => (
                                                <Form id="exampleFormTopLabels" className="tooltip-right-bottom" noValidate onSubmit={handleSubmit}>
                                                    <BootstrapForm.Group controlId="formDropdown" className="form-group has-float-label earn-partner">
                                                        <BootstrapForm.Label>Choose Partner to Purchase</BootstrapForm.Label><br />
                                                        <Field
                                                            as="select"
                                                            name="dropdown"
                                                            className="form-control select2-single input-field"
                                                            required
                                                            data-width="100%"
                                                            onChange={(event) => { handlePartnerChange(event); setFieldValue('dropdown', event.target.value); }}
                                                        >
                                                            <option value="">Select an option</option>
                                                            {partnersData.map(partner => (
                                                                <option key={partner.id} value={partner.id}>{partner.name}</option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage name="dropdown" component="div" className="text-danger" />
                                                    </BootstrapForm.Group>

                                                    <BootstrapForm.Group className="form-group has-float-label" id="earnloyalty">
                                                        <BootstrapForm.Label>Select Loyalty Option</BootstrapForm.Label><br/>
                                                        <Field as="select" name="loyalty" onChange={(event) => { handleLoyaltyOptionChange(event); setFieldValue('dropdown', event.target.value); }}
                                                          className="form-control input-field"  required>
                                                            <option value="">Select a loyalty option</option>
                                                            {loyaltyOptions.map(option => (
                                                                <option key={option.points} value={option.points}>{option.text}</option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage name="loyalty" component="div" className="text-danger" />
                                                    </BootstrapForm.Group>

                                                    <BootstrapForm.Group controlId="formPoints" className="form-group has-float-label earnPoints">
                                                        <BootstrapForm.Label>Earn 1 dollar for every 1 dollar spent</BootstrapForm.Label> <br />
                                                        <Field
                                                            name="points"
                                                            className="form-control input-field"
                                                            placeholder="Enter points"
                                                            required
                                                        />
                                                        <ErrorMessage name="points" component="div" className="text-danger" />
                                                    </BootstrapForm.Group>

                                                    <Button type="submit" variant="primary" className="btn btn-primary earn-points-transaction">
                                                        Purchase and Earn
                                                    </Button>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Col>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </MainCard>
    );
}
