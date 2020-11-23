const nodemailer = require("nodemailer");

exports.email = async(filename, filepath) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        service:'office365',
        port: 587,
        // secure: true,  //true for 465 port, false for other ports
        auth: {
        user: process.env.SMTP_USER,
        pass: String.raw``+process.env.SMTP_PASS+``
        },      
        secureConnection: true,
        requireTLS: true,
        tls: {
            maxVersion: 'TLSv1.3',
            minVersion: 'TLSv1.2',
            // ciphers: 'TLS_AES_128_GCM_SHA256',
            ciphers:'SSLv3'
        }
    });

    let test = true

    // console.log(transporter)
    // send mail with defined transport object
    try {

        let info = await transporter.sendMail({
            from: 'mi-team-mailbox@littlefish.co.uk', // sender address
            to: "thomas.cassady@littlefish.co.uk", // list of receivers
            subject: "Service Report", // Subject line
            text: "Please find attached a copy of your Service Report", // plain text body,
            attachments: [
            {   // file on disk as an attachment
                filename: filename,
                path: filepath // stream this file
            }
            ]     
        });
        console.log("email sent")
    }catch(err) {
        console.log(err)
    }


}