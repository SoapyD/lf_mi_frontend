const nodemailer = require("nodemailer");
const Subscription = require("../models/subscription");

exports.email = async(subscription, filename, filepath) => {

    let promises = [];

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


    // send mail with defined transport object
    try {

        let email_data = {
            from: process.env.EMAIL_SENTFROM, // sender address
            to: subscription.email_to, // list of receivers
            subject: subscription.subject, // Subject line
            html: subscription.body, // plain text body,   
        }

        if (filename){
            email_data['attachments'] = 
            [
                {   // file on disk as an attachment
                    filename: filename,
                    path: filepath // stream this file
                }
            ]             
        }
       

        // let info = await transporter.sendMail(email_data);
        // console.log("email sent")
        promises.push(transporter.sendMail(email_data))

        return Promise.all(promises)
    }catch(err) {
        console.log(err)
    }


}