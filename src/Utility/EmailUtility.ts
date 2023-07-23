import {createTransport} from 'nodemailer';

export function send_email(email_title: string, email_body: string, target_email: string) {
    var transporter = createTransport('smtps://yuri_studio.com:cf3Jpll5LGvp2pel@mail.smtp2go.com');

    transporter.sendMail({
        from: "yuri2020@expectstudio.com",
        to: target_email,
        subject: email_title,
        text: email_body
        }, function(error, response){
        if(error){
        console.log(error);
        }else{
        console.log("Message sented");
        }
    });
}

export function send_forget_password_email(email: string, name: string, password:string) {
    let title = "IRIT Title => Forget password";
    let body = `Hi ${name}\nYou new password ${password}`;

    send_email(title, body, email);
}