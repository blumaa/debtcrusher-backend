const express = require("express");
const stripe = require("stripe")("sk_test_VWuc865tNM4QUuKRmZB4HDQ1008MqUEdsZ");
const router = express.Router();
const uuid = require("uuid/v4");



router.get("/", (req, res) => {
  res.send("Add your Stripe Secret Key to the .require('stripe') statement!");
});

router.post("/token", async (req, res) => {
  console.log('>>><><><><><>><><><><><><><><><><><><><><><><<<<<<')
  console.log(req.body)
  try {
    stripe.oauth.token({
      grant_type: 'authorization_code',
      code: req.body.code,
    }).then(resp => {
      // asynchronously called
      const connected_account_id = resp.stripe_user_id;
      console.log(resp)
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
      console.log(connected_account_id)
      res.json({ resp });
    });

  } catch (err) {
    return err
  }
  // const reqObj = {
  //       method: 'POST',
  //       headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //       }
  //   };
  //   try {
  //       const fetchResponse = await fetch(`http://`, reqObj);
  //       const data = await fetchResponse.json();
  //       return data;
  //   } catch (e) {
  //       return e;
  //   }

})

router.post("/checkout", async (req, res) => {
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  console.log('req body', req.body)
  console.log('req body amount', req.body.amount)
  console.log('stripe user id', req.body.stripeId)
  console.log('payment method', req.body.paymentMethod)
  console.log('@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

  const userPoolAmount = (10 / 100) * req.body.amount; //amount to go into the user's proejct

  const userProjectAmount = (90 / 100) * req.body.amount; //amount to go into the user's proejct

  const projPennyAmount = userProjectAmount * 100
  const userPennyAmount = userPoolAmount * 100

  try {
    stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: 'usd',
      payment_method: req.body.paymentMethod.id,
      confirm: true,
      payment_method_types: ['card']
    }).then(function(charge) {
      // asynchronously called
      console.log(charge)
      stripe.transfers.create({
        amount: projPennyAmount,
        currency: 'usd',
        destination: req.body.stripeId
      }).then(function(transfer) {
        // asynchronously called
        console.log(transfer)
        res.json(transfer);
      });

    });
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }
});

router.post("/secondaryCheckout", async (req, res) => {
  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
  console.log('req body', req.body)
  console.log('stripe user id', req.body.stripeId)

  const pennyAmount = req.body.amount * 100

  try {
    stripe.transfers.create({
      amount: req.body.amount * 100,
      currency: 'usd',
      destination: req.body.stripeId
    }).then(function(transfer) {
      // asynchronously called
      console.log(transfer)
      res.json(transfer);
    });

    // stripe.charges.create({
    //   amount: pennyAmount,
    //   currency: "usd",
    //   source: "tok_visa",
    //   transfer_data: {
    //     destination: req.body.stripeId,
    //   },
    // }).then(charge => {
    //   // asynchronously called
    //   console.log(charge)
    //   res.json(charge);
    // });

  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }
});

module.exports = router;
