import nodemailer from 'nodemailer'

//Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'aymenrch37@gmail.com',
    pass: 'wcdh gqeh bpda cnrd', 
  },
});

export default transporter;