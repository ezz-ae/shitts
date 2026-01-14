import axios from 'axios';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE;

const ZIINA_API_KEY = process.env.ZIINA_API_KEY;
const ZIINA_BASE_URL = process.env.ZIINA_BASE_URL;

export async function createPayPalOrder(amount: number) {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await axios({
      url: `${PAYPAL_API_BASE}/v1/oauth2/token`,
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: 'grant_type=client_credentials',
    });

    const accessToken = tokenResponse.data.access_token;

    const orderResponse = await axios({
      url: `${PAYPAL_API_BASE}/v2/checkout/orders`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
        }],
      },
    });

    return orderResponse.data;
  } catch (error) {
    console.error('PayPal Order Error:', error);
    throw error;
  }
}

export async function createZiinaPayment(amount: number, orderId: string) {
  try {
    const response = await axios({
      url: `${ZIINA_BASE_URL}/v1/payment_intent`,
      method: 'post',
      headers: {
        'Authorization': `Bearer ${ZIINA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        amount: Math.round(amount * 100), // Ziina often uses minor units (cents/fils)
        currency: 'AED',
        external_id: orderId,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ziina Payment Error:', error);
    throw error;
  }
}
