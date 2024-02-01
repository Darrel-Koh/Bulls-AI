import React, { useState } from 'react';
import { Typography, Button, Container, Paper } from '@mui/material';
import PricingPlan from './PricingPlan';
import "../components/style.css";
import { useNavigate } from 'react-router-dom'; // Import useHistory hook for navigation

const PricingPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();
    const handlePlanSelect = (planName) => {
      setSelectedPlan(planName);
    };
  
    const handleChangePlan = () => {
        // Navigate to PaymentPage when "Change Plan" button is clicked
        navigate("/PaymentPage", { state: { selectedPlan } });
    };
    return (
      <Container maxWidth="md" className="pricing-page">
        <Typography variant="h3" align="center" gutterBottom>
          Choose Your Plan
        </Typography>
        
        <Typography variant="body1" align="center" paragraph>
          In the competitive market landscape, we are dedicated to meeting our objectives while prioritising user accessibility and feature availability, especially for our 'Basic' tier users. We've designed our 'Basic' tier to encompass essential features that are readily accessible to all users. For our ‘Professional’ tier, we've amplified these features to enrich the user experience, ensuring a comprehensive and advanced toolset for those seeking an enhanced and more in-depth investment platform.
        </Typography>
        
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <div className="pricing-plans">
            <PricingPlan
              name="Basic Plan"
              price="FREE"
              features={[
                "AI/ML Predictions ✅",
                "Financial Literacy ✅",
                "Model Reliability and Availability: Up to date",
                "Accurate Stock Recommendations: 3",
                "Favourite Ticker list: 1"
              ]}
              onSelect={() => handlePlanSelect("Basic Plan")}
            />
            <PricingPlan
              name="Professional Plan"
              price="$5/month"
              features={[
                "AI/ML Predictions ✅",
                "Financial Literacy ✅",
                "Model Reliability and Availability: Real-time",
                "Accurate Stock Recommendations: 30",
                "Favourite Ticker list: Unlimited"
              ]}
              onSelect={() => handlePlanSelect("Professional Plan")}
            />
          </div>
        </Paper>

        {selectedPlan && (
          <div className="selected-plan" style={{ textAlign: 'center' }}>
            <Typography variant="h6" style={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>
            Selected Plan: {selectedPlan}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleChangePlan}>
              Change Plan
            </Button>
          </div>
        )}

        <footer style={{ marginTop: '50px', padding: '20px', backgroundColor: '#f4f4f4', textAlign: 'center' }}>
          <Typography variant="body2">&copy; 2023 Bulls Ai. All rights reserved.</Typography>
        </footer>
      </Container>
    );
};

export default PricingPage;