import nodeMailer from 'nodemailer';

const transport = nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        pass:process.env.NODE_CODE_SENDING_EMAIL_PASSWORD
    }
});
export default transport;