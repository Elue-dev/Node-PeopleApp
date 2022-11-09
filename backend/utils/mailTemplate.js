exports.resetPasswordTemplate = (email, resetToken, userId, username) => {
  return `
        <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
  
          <style>
            .container {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
              background: #333;
              padding: 1.2rem 1.5rem;
              color: #fff;
            }
            a {
              text-decoration: none;
              background-color: #ae8625;
              color: #fff;
              border: 1px solid #333;
              width: 50%;
              margin-top: 1rem 0;
              font-size: 1rem;
              font-weight: 700;
              padding: 4px 6px;
              margin: 0 5px 0 0;
              padding: 0.5rem;
              border: 1px solid transparent;
              border-radius: 0.3rem;
              cursor: pointer;
              transition: all 0.3s;
              font-family: "Lato", sans-serif;
            }
            p {
              margin: 2rem 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h3>Hi, ${username}</h3>
            <p>
              You requested to reset your password for your email: <b>${email}</b> . Please reset it using the call to
              action below
            </p>
  
            <a
              href=http://localhost:3000/reset-password/${resetToken}/${userId} target='_blank'
              >Reset Password
            </a>
            <p>If you didn't ask to reset your password, please ignore this email.</p>
          </div>
        </body>
      </html>
  
    `;
};

exports.WelcomeMail = (username) => {
  return `
        <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
  
          <style>
            .container {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
              background: #333;
              padding: 1.2rem 1.5rem;
              color: #fff;
            }
            a {
              text-decoration: none;
              background-color: #ae8625;
              color: #fff;
              border: 1px solid #333;
              width: 50%;
              margin-top: 1rem 0;
              font-size: 1rem;
              font-weight: 700;
              padding: 4px 6px;
              margin: 0 5px 0 0;
              padding: 0.5rem;
              border: 1px solid transparent;
              border-radius: 0.3rem;
              cursor: pointer;
              transition: all 0.3s;
              font-family: "Lato", sans-serif;
            }
            p {
              margin: 2rem 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h3>Welcome on board, ${username}!</h3>
            <p>
             We are glad to have you as part of our community. Ennsure to exolore our website thoroughly to find products and services that best suite your needs.
            </p>
  
            <p>Best Regards,</p>
            <p>The People's Team</p>
          </div>
        </body>
      </html>
  
    `;
};
