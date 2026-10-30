export const sendOrderEmail = async (customerEmail, orderDetails) => {
  try {
    const itemsListHTML = orderDetails.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; color: #333;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; color: #333;">₹${Number(item.price).toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; color: #333; font-weight: bold;">₹${(Number(item.price) * Number(item.qty)).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailPayload = {
      sender: { name: "Dinco Store", email: "sakthi09112002@gmail.com" },
      to: [{ email: customerEmail, name: orderDetails.shipping.fullName }],
      subject: '🎉 Dinco - Order Placed Successfully!',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; border-radius: 10px; max-width: 600px; margin: auto;">
          <h2 style="color: #6366f1; text-align: center;">Thank you for shopping with Dinco!</h2>
          <p>Hi <b>${orderDetails.shipping.fullName}</b>,</p>
          <p>Your order has been placed successfully and is currently being processed.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          
          <h3 style="color: #333; margin-bottom: 5px;">Order Summary:</h3>
          <p style="margin: 0 0 15px; color: #666; font-size: 0.9rem;"><b>Order ID:</b> ${orderDetails._id}</p>
          
          <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #6366f1; color: #fff; text-align: left;">
                <th style="padding: 10px;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHTML}
            </tbody>
          </table>

          <h3 style="text-align: right; color: #111; margin-top: 15px;">Grand Total: ₹${Number(orderDetails.total).toFixed(2)}</h3>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

          <h3 style="color: #333; margin-bottom: 5px;">Shipping Address:</h3>
          <p style="margin: 0; color: #555; line-height: 1.5;">
            ${orderDetails.shipping.address}<br/>
            ${orderDetails.shipping.city} - ${orderDetails.shipping.postalCode}<br/>
            ${orderDetails.shipping.country}
          </p>

          <br/>
          <p style="color: #666; text-align: center; font-size: 0.85rem;">We will notify you once your order is shipped.<br/><b>- Team Dinco Store</b></p>
        </div>
      `
    };

    // Using Node.js built-in global fetch
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    if (!response.ok) {
      const errRes = await response.text();
      throw new Error(`Brevo API Error: ${errRes}`);
    }

    console.log('Order confirmation email sent successfully via Brevo API!');
  } catch (error) {
    console.error('Error sending email via Brevo:', error.message);
  }
};