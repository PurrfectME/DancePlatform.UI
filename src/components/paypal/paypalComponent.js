import React from "react";
import ReactDOM from "react-dom"
import RegistrationService from '../../services/registrationService';
import storageHelper from '../../helpers/storageHelper';
import { useHistory } from "react-router-dom";

const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

export default function PayPalComponent(props) {
  let history = useHistory();

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: props.workshop.price,
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(resp => {
      const registration = {
        workshopId: props.workshop.id,
        userId: storageHelper.getCurrentUserId(),
        isDesired: false,
        isPaid: true
      };
      RegistrationService.registerOnWorkshop(registration).then(response => {
        history.push('/');
    })
    });
  };

  return (
    <>
      <h1 style={{fontSize: 25, marginBottom: 10}}>Оплатить сейчас</h1>
      <PayPalButton
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
      />
    </>
  );
}
