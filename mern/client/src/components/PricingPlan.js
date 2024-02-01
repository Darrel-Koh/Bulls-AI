import React from 'react';
import { Typography, Button, List, ListItem, ListItemText, Card, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

const PricingPlan = ({ name, price, features, onSelect, image }) => {
  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent style={{ textAlign: 'center' }}>
        {image && (
          <img src={image} alt={name} style={{ width: '150px', borderRadius: '50%', marginBottom: '10px' }} />
        )}
        <Typography variant="h5" component="h2" style={{ marginBottom: '10px' }}>
          {name}
        </Typography>
        <Typography variant="h4" color="textSecondary" style={{ marginBottom: '10px' }}>
          {price}
        </Typography>
        <List>
          {features.map((feature, index) => (
            <ListItem key={index}>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={onSelect}>
          Select Plan
        </Button>
      
      </CardActions>
    </Card>
  );
};

export default PricingPlan;