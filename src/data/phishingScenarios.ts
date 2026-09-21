import { EmailScenario } from "@/types/quiz";

export const phishingScenarios: EmailScenario[] = [
  {
    id: 1,
    category: "Credential Harvester",
    verdict: "phishing",
    difficulty: "medium",
    senderName: "Microsoft 365 Security",
    senderEmail: "no-reply@micros0ft-security-auth.com",
    recipient: "you@company.com",
    date: "Today, 9:14 AM",
    subject: "Action Required: Your Password Expires in 24 Hours",
    bodyHtml: `<p>Dear User,</p><p>We detected unusual sign-in activity on your Microsoft 365 account. Your password will expire within <strong>24 hours</strong>. Failure to update will result in permanent account suspension.</p><p><a href="#">Click here to verify your account immediately</a></p><p>If you do not act now, all your OneDrive files will be deleted permanently.</p><p>Thank you,<br/>Microsoft Security Team</p>`,
    links: [
      { displayText: "Click here to verify your account immediately", actualUrl: "http://micros0ft-security-auth.com/login/verify?user=you@company.com", isSuspicious: true }
    ],
    attachments: [],
    clues: [
      { type: "domain", label: "Lookalike Domain", explanation: "The sender uses micros0ft-security-auth.com with a zero replacing the o in Microsoft. Legitimate Microsoft emails come from microsoft.com or outlook.com.", severity: "critical" },
      { type: "urgency", label: "Artificial Urgency", explanation: "The email pressures you with a 24-hour deadline and threats of permanent account deletion to bypass rational thinking.", severity: "critical" },
      { type: "link", label: "Disguised URL", explanation: "The hyperlink text says verify your account but the actual destination is a fake login page on the spoofed domain.", severity: "critical" },
      { type: "greeting", label: "Generic Greeting", explanation: "Uses Dear User instead of your actual name. Legitimate Microsoft emails typically address you by your account name.", severity: "warning" }
    ],
    rawHeaders: "Received: from mail.micros0ft-security-auth.com (185.234.72.19)\
From: no-reply@micros0ft-security-auth.com\
Return-Path: bounce@micros0ft-security-auth.com\
X-Mailer: PHPMailer 5.2.27\
Authentication-Results: spf=fail, dkim=none",
    explanation: "This is a classic credential harvesting attack. The attacker uses a lookalike domain with character substitution (zero for o), creates artificial urgency, and links to a fake login page designed to steal your Microsoft credentials.",
    tip: "Always check the actual domain in the sender address. Microsoft will never use domains with numbers replacing letters."
  },
  {
    id: 2,
    category: "Legitimate Service",
    verdict: "legitimate",
    difficulty: "easy",
    senderName: "Google Workspace",
    senderEmail: "workspace-alerts-noreply@google.com",
    recipient: "you@company.com",
    date: "Today, 7:30 AM",
    subject: "Your Google Workspace storage is almost full",
    bodyHtml: `<p>Hi Alex,</p><p>Your Google Workspace account is using <strong>94%</strong> of its storage quota (14.1 GB of 15 GB).</p><p>To free up space, you can review items in Gmail, Drive, and Photos.</p><p><a href="#">Manage your storage</a></p><p>You can also purchase additional storage from your Google Workspace admin.</p><p>Thanks,<br/>The Google Workspace Team</p>`,
    links: [
      { displayText: "Manage your storage", actualUrl: "https://one.google.com/storage", isSuspicious: false }
    ],
    attachments: [],
    clues: [
      { type: "domain", label: "Verified Domain", explanation: "Sender uses the legitimate google.com domain. SPF and DKIM authentication pass.", severity: "info" },
      { type: "content", label: "Personalized", explanation: "Addresses the user by name and shows accurate usage statistics specific to their account.", severity: "info" },
      { type: "link", label: "Safe URL", explanation: "The link points to the official one.google.com storage management page.", severity: "info" }
    ],
    rawHeaders: "Received: from mail-sor-f41.google.com (209.85.220.41)\
From: workspace-alerts-noreply@google.com\
Return-Path: bounce@google.com\
Authentication-Results: spf=pass, dkim=pass, dmarc=pass",
    explanation: "This is a legitimate Google Workspace notification. The sender domain is authentic, authentication headers pass, the message is personalized with accurate account data, and links point to official Google properties.",
    tip: "Legitimate service emails pass SPF/DKIM/DMARC checks and use exact official domains without character substitutions."
  },
  {
    id: 3,
    category: "CEO Fraud / BEC",
    verdict: "phishing",
    difficulty: "hard",
    senderName: "Sarah Chen, CEO",
    senderEmail: "sarah.chen@company-secure-mail.com",
    replyToEmail: "urgent.wire2025@gmail.com",
    recipient: "finance@company.com",
    date: "Today, 11:42 PM",
    subject: "URGENT: Confidential Wire Transfer Needed Now",
    bodyHtml: `<p>I am currently in a closed board meeting and cannot use my regular phone. I need you to process a confidential wire transfer of $47,500 to our new acquisition partner immediately.</p><p>This is time-sensitive and must not be discussed with anyone else in the company. The details are attached in the payment instruction sheet.</p><p>Do NOT call me to confirm as I cannot answer. Simply reply to this email once done.</p><p>Regards,<br/>Sarah Chen<br/>Chief Executive Officer</p>`,
    links: [],
    attachments: [
      { name: "Wire_Instructions_FINAL.pdf.exe", size: "2.4 MB", type: "application/x-msdownload", isMalicious: true }
    ],
    clues: [
      { type: "domain", label: "Wrong Domain", explanation: "The sender claims to be the CEO but uses company-secure-mail.com instead of the real corporate domain company.com.", severity: "critical" },
      { type: "header", label: "Mismatched Reply-To", explanation: "The Reply-To address is a Gmail account (urgent.wire2025@gmail.com), not the CEO corporate email. Any reply goes to the attacker.", severity: "critical" },
      { type: "urgency", label: "Pressure + Secrecy", explanation: "Requests action at 11:42 PM, claims unavailability to prevent verification, and demands secrecy to bypass internal controls.", severity: "critical" },
      { type: "attachment", label: "Double Extension", explanation: "The attachment Wire_Instructions_FINAL.pdf.exe is actually an executable disguised as a PDF.", severity: "critical" }
    ],
    rawHeaders: "Received: from smtp-relay.brevo.com (78.138.112.0)\
From: sarah.chen@company-secure-mail.com\
Reply-To: urgent.wire2025@gmail.com\
X-Priority: 1 (Highest)\
Authentication-Results: spf=fail, dkim=none",
    explanation: "This is a Business Email Compromise (BEC) attack targeting finance departments. The attacker spoofs the CEO identity, uses a mismatched reply-to to intercept responses, creates urgency and secrecy to bypass verification protocols, and attaches a malicious executable.",
    tip: "Always verify unusual payment requests through a known phone number. Never trust email-only authorization for wire transfers."
  },
  {
    id: 4,
    category: "Fake Document Request",
    verdict: "phishing",
    difficulty: "medium",
    senderName: "DocuSign Electronic Signature",
    senderEmail: "dse_1234567@docus1gn-cloud-sign.com",
    recipient: "you@company.com",
    date: "Yesterday, 4:55 PM",
    subject: "Completed: Confidential Contract Awaiting Your Signature",
    bodyHtml: `<p>You have 1 document to review and sign.</p><p><strong>Document:</strong> Confidential Employment Agreement - Q1 2025<br/><strong>From:</strong> HR Department<br/><strong>Expires:</strong> 3 days</p><p><a href="#">Review Document</a></p><p>This is a secure electronic signature request. Do not forward this email.</p>`,
    links: [
      { displayText: "Review Document", actualUrl: "http://docus1gn-cloud-sign.com/auth/sign?doc=confidential&id=12345", isSuspicious: true }
    ],
    attachments: [],
    clues: [
      { type: "domain", label: "Spoofed Domain", explanation: "Uses docus1gn-cloud-sign.com with a 1 replacing the i in DocuSign. Real DocuSign emails come from docusign.net.", severity: "critical" },
      { type: "link", label: "Fake Sign Page", explanation: "The Review Document link leads to a fake authentication page designed to harvest credentials.", severity: "critical" },
      { type: "urgency", label: "Expiration Pressure", explanation: "Artificial 3-day deadline pressures quick action without careful inspection.", severity: "warning" },
      { type: "content", label: "Vague Sender", explanation: "Generic sender ID with no specific person or organization identified as the document originator.", severity: "warning" }
    ],
    rawHeaders: "Received: from mail.docus1gn-cloud-sign.com (103.152.220.45)\
From: dse_1234567@docus1gn-cloud-sign.com\
X-Mailer: Custom PHP Mailer\
Authentication-Results: spf=fail, dkim=none",
    explanation: "This is a DocuSign impersonation attack. The attacker uses a lookalike domain with character substitution, creates a fake document signing page to steal credentials, and adds urgency with an expiration date.",
    tip: "Always navigate directly to docusign.net to verify document requests. Never click links in signature request emails."
  },
  {
    id: 5,
    category: "Legitimate Service",
    verdict: "legitimate",
    difficulty: "medium",
    senderName: "GitHub",
    senderEmail: "noreply@github.com",
    recipient: "you@company.com",
    date: "Today, 2:18 PM",
    subject: "[GitHub] A new SSH key was added to your account",
    bodyHtml: `<p>Hey @devuser,</p><p>A new SSH key was added to your account:</p><p><code>ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... dev@workstation</code><br/>Fingerprint: <code>SHA256:xxxxxxxx</code></p><p>If this was you, you can safely ignore this email. If not, please review your SSH keys immediately.</p><p><a href="#">Review your keys</a></p><p>Thanks,<br/>The GitHub Team</p>`,
    links: [
      { displayText: "Review your keys", actualUrl: "https://github.com/settings/keys", isSuspicious: false }
    ],
    attachments: [],
    clues: [
      { type: "domain", label: "Official Domain", explanation: "Sender uses the exact noreply@github.com domain with passing authentication headers.", severity: "info" },
      { type: "content", label: "Specific Details", explanation: "Includes the actual SSH key fingerprint and username, indicating genuine account activity.", severity: "info" },
      { type: "link", label: "Safe URL", explanation: "Links to the official github.com/settings/keys page.", severity: "info" }
    ],
    rawHeaders: "Received: from smtp.github.com (192.30.252.129)\
From: noreply@github.com\
Return-Path: bounce@github.com\
Authentication-Results: spf=pass, dkim=pass, dmarc=pass",
    explanation: "This is a legitimate GitHub security notification. The domain is authentic, authentication passes, and the email contains specific account details (SSH key fingerprint) that only GitHub would know.",
    tip: "Legitimate security alerts from services include specific details about the action taken, not generic warnings."
  },
  {
    id: 6,
    category: "Delivery Scam",
    verdict: "phishing",
    difficulty: "easy",
    senderName: "DHL Express Delivery",
    senderEmail: "tracking@dhl-parcel-reschedule.info",
    recipient: "you@company.com",
    date: "Today, 6:02 AM",
    subject: "Delivery Failed: Customs Fee of $3.99 Due - Package Will Be Returned",
    bodyHtml: `<p>Dear Customer,</p><p>Your package (Tracking: DHL-9847261834) could not be delivered due to an outstanding <strong>customs fee of $3.99</strong>.</p><p>If payment is not received within 48 hours, your package will be returned to sender.</p><p>Please find the invoice attached and complete payment.</p><p><a href="#">Pay Customs Fee</a></p><p>DHL Express International</p>`,
    links: [
      { displayText: "Pay Customs Fee", actualUrl: "http://dhl-parcel-reschedule.info/payment/card-details", isSuspicious: true }
    ],
    attachments: [
      { name: "DHL_Invoice.zip", size: "847 KB", type: "application/zip", isMalicious: true }
    ],
    clues: [
      { type: "domain", label: "Fake Domain", explanation: "Uses dhl-parcel-reschedule.info instead of the real dhl.com domain. The .info TLD is a red flag for corporate communications.", severity: "critical" },
      { type: "attachment", label: "Malicious ZIP", explanation: "The attached ZIP file likely contains malware disguised as an invoice document.", severity: "critical" },
      { type: "urgency", label: "Return Threat", explanation: "Threatens package return within 48 hours to pressure immediate payment without verification.", severity: "warning" },
      { type: "greeting", label: "Generic Greeting", explanation: "Uses Dear Customer instead of your name. DHL would know the recipient name from the shipping label.", severity: "warning" }
    ],
    rawHeaders: "Received: from server.dhl-parcel-reschedule.info (45.155.205.233)\
From: tracking@dhl-parcel-reschedule.info\
X-Mailer: MassMailer Pro v3.1\
Authentication-Results: spf=fail, dkim=none",
    explanation: "This is a classic delivery scam. The attacker uses a fake DHL domain, sends a malicious ZIP attachment, and pressures with a small fee to get credit card details on a fake payment page.",
    tip: "Never open unexpected attachments from delivery companies. Always check tracking directly on the official carrier website."
  },
  {
    id: 7,
    category: "Legitimate Internal",
    verdict: "legitimate",
    difficulty: "hard",
    senderName: "People Operations",
    senderEmail: "people-ops@company.com",
    recipient: "all-staff@company.com",
    date: "Today, 8:00 AM",
    subject: "2025 Benefits Enrollment Now Open - Action by March 15",
    bodyHtml: `<p>Hi Team,</p><p>Open Enrollment for 2025 benefits is now live in the HR Portal. Please review your selections and submit by <strong>March 15</strong>.</p><p>Key changes this year:</p><ul><li>New dental plan option (OrthoPlus)</li><li>Increased 401k match to 5%</li><li>Mental health days increased to 4 per year</li></ul><p><a href="#">Access HR Portal</a></p><p>Questions? Contact people-ops@company.com or ext. 4200.</p><p>Best,<br/>Maria Santos<br/>VP, People Operations</p>`,
    links: [
      { displayText: "Access HR Portal", actualUrl: "https://hr.company.com/benefits/2025-enrollment", isSuspicious: false }
    ],
    attachments: [],
    clues: [
      { type: "domain", label: "Internal Domain", explanation: "Sender uses the exact company.com domain. The link also points to hr.company.com, an internal corporate subdomain.", severity: "info" },
      { type: "content", label: "Specific and Verifiable", explanation: "References specific internal details (extension number, named VP, concrete plan names) that are verifiable.", severity: "info" },
      { type: "header", label: "Proper Distribution", explanation: "Sent to all-staff@company.com, consistent with a company-wide announcement.", severity: "info" }
    ],
    rawHeaders: "Received: from mail.company.com (10.0.1.55)\
From: people-ops@company.com\
Sender: mailer-daemon@company.com\
Authentication-Results: spf=pass, dkim=pass, dmarc=pass",
    explanation: "This is a legitimate internal HR communication. It uses the correct corporate domain, contains specific verifiable details, references known internal systems, and comes from a recognized sender.",
    tip: "Internal emails with verifiable details (specific names, extensions, plan options) and correct domains are typically legitimate."
  },
  {
    id: 8,
    category: "Fake Invoice",
    verdict: "phishing",
    difficulty: "medium",
    senderName: "PayPal Account Services",
    senderEmail: "security-alert@paypal-transaction-verify.com",
    recipient: "you@company.com",
    date: "Today, 10:33 AM",
    subject: "Unauthorized Transaction: $849.00 Charge - Verify Now",
    bodyHtml: `<p>Dear PayPal User,</p><p>We have detected an unauthorized transaction of <strong>$849.00</strong> on your account:</p><p><strong>Merchant:</strong> TechStore International<br/><strong>Date:</strong> Today<br/><strong>Amount:</strong> $849.00 USD</p><p>If this was not you, please dispute immediately. Your account will be frozen in 24 hours if unverified.</p><p><a href="#">Dispute This Transaction</a></p><p>Call our fraud line: 1-800-555-0199<br/>PayPal Fraud Department</p>`,
    links: [
      { displayText: "Dispute This Transaction", actualUrl: "http://paypal-transaction-verify.com/login/dispute?ref=849", isSuspicious: true }
    ],
    attachments: [],
    clues: [
      { type: "domain", label: "Fake PayPal Domain", explanation: "Uses paypal-transaction-verify.com instead of paypal.com. Adding random words to a brand name is a classic spoofing technique.", severity: "critical" },
      { type: "urgency", label: "Account Freeze Threat", explanation: "Threatens to freeze the account in 24 hours to panic the user into acting without thinking.", severity: "critical" },
      { type: "link", label: "Credential Harvest", explanation: "The dispute link leads to a fake PayPal login page designed to capture your credentials.", severity: "critical" },
      { type: "content", label: "Fake Phone Number", explanation: "The 1-800 number is not PayPal real fraud line. Attackers include phone numbers to appear legitimate.", severity: "warning" }
    ],
    rawHeaders: "Received: from mail.paypal-transaction-verify.com (91.219.236.18)\
From: security-alert@paypal-transaction-verify.com\
X-Mailer: SpamIT v4.2\
Authentication-Results: spf=fail, dkim=none",
    explanation: "This is a fake transaction alert designed to steal PayPal credentials. The attacker uses a spoofed domain, creates panic with a large unauthorized charge, threatens account freezing, and provides a fake phone number for added legitimacy.",
    tip: "PayPal will never send emails from domains other than paypal.com. Always go directly to paypal.com to check transactions."
  }
];
