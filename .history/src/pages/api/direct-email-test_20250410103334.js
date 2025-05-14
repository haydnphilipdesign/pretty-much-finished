// Direct Email Test Endpoint
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    console.log('Direct email test initiated');

    try {
        // Email configuration
        const emailConfig = {
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER || '',
                pass: process.env.EMAIL_PASSWORD || ''
            }
        };

        console.log('Email configuration:', {
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            user: emailConfig.auth.user ? 'Set (hidden)' : 'Not set',
            pass: emailConfig.auth.pass ? 'Set (hidden)' : 'Not set'
        });

        // Create transporter
        const transporter = nodemailer.createTransport(emailConfig);

        // Verify connection
        const connectionResult = await transporter.verify().catch(err => {
            console.error('SMTP connection verification failed:', err);
            return false;
        });

        if (!connectionResult) {
            return res.status(500).json({
                success: false,
                message: 'Failed to connect to email server',
                config: {
                    host: emailConfig.host,
                    port: emailConfig.port,
                    secure: emailConfig.secure,
                    user: emailConfig.auth.user ? 'Set (hidden)' : 'Not set',
                    pass: emailConfig.auth.pass ? 'Set (hidden)' : 'Not set'
                }
            });
        }

        // Email data
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@parealestatesupport.com',
            to: 'debbie@parealestatesupport.com',
            subject: 'Direct Email Test - ' + new Date().toLocaleString(),
            html: `
        <h2>This is a direct test email</h2>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>If you're receiving this, the email system is working correctly.</p>
        <p>Host: ${req.headers.host}</p>
      `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Test email sent successfully',
            messageId: info.messageId,
            emailConfig: {
                host: emailConfig.host,
                port: emailConfig.port,
                secure: emailConfig.secure,
                user: emailConfig.auth.user ? 'Set (hidden)' : 'Not set',
                pass: emailConfig.auth.pass ? 'Set (hidden)' : 'Not set'
            },
            environment: {
                nodeEnv: process.env.NODE_ENV,
                emailUser: process.env.EMAIL_USER ? 'Set (hidden)' : 'Not set',
                emailPass: process.env.EMAIL_PASSWORD ? 'Set (hidden)' : 'Not set',
                emailHost: process.env.EMAIL_HOST || 'Default: smtp.gmail.com',
                emailPort: process.env.EMAIL_PORT || 'Default: 587'
            }
        });
    } catch (error) {
        console.error('Error sending test email:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message,
            stack: error.stack,
            envVars: {
                EMAIL_HOST: process.env.EMAIL_HOST ? 'Set' : 'Not set',
                EMAIL_PORT: process.env.EMAIL_PORT ? 'Set' : 'Not set',
                EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
                EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Not set',
                EMAIL_FROM: process.env.EMAIL_FROM ? 'Set' : 'Not set'
            }
        });
    }
}