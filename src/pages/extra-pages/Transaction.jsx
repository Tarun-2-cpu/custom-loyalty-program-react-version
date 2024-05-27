import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import MainCard from 'components/MainCard';
import './MemberDashboard.css';

const apiUrl = "https://cl-backend.kryptocoder.com/api/";

export default function Transaction() {
  const [memberData, setMemberData] = useState(null);
  const [activeTab, setActiveTab] = useState('allocated');

  useEffect(() => {
    const sessionMemberData = sessionStorage.getItem('memberData');
    if (sessionMemberData) {
      const data = JSON.parse(sessionMemberData);
      setMemberData(data);
    } else {
      window.location.href = 'index.html';
    }
  }, []);


  const renderTable = (data) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Time Stamp</th>
            <th>Partner</th>
            <th>Member</th>
            <th>Points</th>
            <th>Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.timestamp}</td>
              <td>{transaction.partner}</td>
              <td>{transaction.member}</td>
              <td>{transaction.points}</td>
              <td>{transaction.transactionId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
                          <p className="card-text mb-0 card-title">Account ID:</p>
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
                          <p className="card-text mb-0 card-title">Points:</p>
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
          <Col>
            <div id="smartWizardClickable">
              <ul className="card-header transactions">
                <li><Button variant="link" onClick={() => setActiveTab('allocated')}>Points Allocated</Button></li>
                <li><Button variant="link" onClick={() => setActiveTab('redeemed')}>Points Redeemed</Button></li>
              </ul>
              <div className="card-body">
                {activeTab === 'allocated' ? (
                  <div id="clickable1">
                    <h4>Points Allocated</h4><br />
                    <div className="points-allocated-transactions">
                      {memberData && memberData.earnPointsResult.length > 0 ? (
                        renderTable(memberData.earnPointsResult)
                      ) : (
                        <p>No points allocated</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div id="clickable2">
                    <h4 className="pb-2">Points Redeemed</h4><br />
                    <div className="points-redeemed-transactions">
                      {memberData && memberData.usePointsResults.length > 0 ? (
                        renderTable(memberData.usePointsResults)
                      ) : (
                        <p>No points redeemed</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </MainCard>
  );
}