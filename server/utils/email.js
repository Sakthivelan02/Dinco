import nodemailer from 'nodemailer';

// 1. Transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Email sending function with full product details
export const sendOrderEmail = async (customerEmail, orderDetails) => {
  try {
    // Generate HTML rows for each ordered product (Fixed multiplication issue)
    const itemsListHTML = orderDetails.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; color: #333;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; color: #333;">₹${Number(item.price).toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; color: #333; font-weight: bold;">₹${(Number(item.price) * Number(item.qty)).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: '"Dinco Store" <no-reply@dinco.com>',
      to: customerEmail,
      subject: '🎉 Dinco - Order Placed Successfully!',
      html: `
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
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email with full product details sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};