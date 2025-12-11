// Demo templates with common business reply patterns
// Each template includes a category for organization

export const CATEGORIES = [
    { id: 'hr', name: 'HR / Leave', color: '#10b981' },
    { id: 'finance', name: 'Finance / Billing', color: '#f59e0b' },
    { id: 'scheduling', name: 'Scheduling', color: '#6366f1' },
    { id: 'general', name: 'General', color: '#8b5cf6' },
    { id: 'project', name: 'Project Management', color: '#ec4899' },
];

export const demoTemplates = [
    {
        id: 'leave-approval',
        name: 'Leave Approval',
        category: 'hr',
        triggers: ['leave', 'vacation', 'time off', 'pto', 'annual leave', 'day off', 'sick leave'],
        body: `Hi {{name}},

Thank you for submitting your leave request.

I'm pleased to inform you that your leave from {{startDate}} to {{endDate}} has been approved. Please ensure all your pending tasks are either completed or properly handed over before your leave begins.

If you have any questions or need to make changes to your leave dates, please let me know.

Enjoy your time off!

Best regards`
    },
    {
        id: 'leave-denial',
        name: 'Leave Request - Needs Discussion',
        category: 'hr',
        triggers: ['leave', 'vacation', 'time off', 'pto', 'request denied'],
        body: `Hi {{name}},

Thank you for your leave request for {{dates}}.

Unfortunately, due to {{reason}}, we cannot approve this request at this time. However, I'd like to discuss alternative dates that might work better for both you and the team.

Could we schedule a quick call to discuss this further?

Best regards`
    },
    {
        id: 'payment-info',
        name: 'Payment Information',
        category: 'finance',
        triggers: ['payment', 'invoice', 'billing', 'amount', 'pay', 'wire', 'transfer', 'bank details'],
        body: `Hi {{name}},

Thank you for your inquiry regarding payment.

Please find our payment details below:

Bank Name: {{bankName}}
Account Name: {{accountName}}
Account Number: {{accountNumber}}
Reference: {{reference}}

The amount due is {{amount}}. Please ensure the reference number is included with your payment for proper allocation.

Let me know once the payment has been made, or if you have any questions.

Best regards`
    },
    {
        id: 'meeting-schedule',
        name: 'Meeting Scheduling',
        category: 'scheduling',
        triggers: ['meeting', 'schedule', 'calendar', 'availability', 'slot', 'call', 'discuss', 'sync'],
        body: `Hi {{name}},

Thank you for reaching out regarding scheduling a meeting.

I'm available at the following times:
- {{option1}}
- {{option2}}
- {{option3}}

Please let me know which time works best for you, and I'll send a calendar invite with the meeting details.

Looking forward to our discussion!

Best regards`
    },
    {
        id: 'meeting-confirm',
        name: 'Meeting Confirmation',
        category: 'scheduling',
        triggers: ['meeting', 'confirm', 'scheduled', 'appointment', 'invite'],
        body: `Hi {{name}},

This is to confirm our meeting scheduled for:

Date: {{date}}
Time: {{time}}
Location/Link: {{location}}
Agenda: {{agenda}}

Please let me know if you need to reschedule or have any items to add to the agenda.

See you then!

Best regards`
    },
    {
        id: 'acknowledgment',
        name: 'Acknowledgment',
        category: 'general',
        triggers: ['received', 'confirm', 'acknowledge', 'got it', 'noted', 'thank you'],
        body: `Hi {{name}},

Thank you for your email.

I've received your message regarding {{subject}} and will review it shortly. I'll get back to you with a detailed response by {{responseDate}}.

If this is urgent, please feel free to call me directly.

Best regards`
    },
    {
        id: 'follow-up',
        name: 'Follow-up Request',
        category: 'general',
        triggers: ['update', 'status', 'follow up', 'pending', 'progress', 'checking in', 'any update'],
        body: `Hi {{name}},

I hope this message finds you well.

I wanted to follow up on {{subject}} that we discussed on {{previousDate}}. Could you please provide an update on the current status?

If there's anything you need from my end to move this forward, please let me know.

Thank you for your time.

Best regards`
    },
    {
        id: 'intro-email',
        name: 'Introduction / First Contact',
        category: 'general',
        triggers: ['introduce', 'introduction', 'nice to meet', 'reaching out', 'connect', 'networking'],
        body: `Hi {{name}},

Thank you for connecting with me.

I'm {{yourName}}, and I {{yourRole}}. I came across your profile/work on {{source}} and was impressed by {{specificThing}}.

I'd love to learn more about {{theirWork}} and explore potential opportunities for collaboration.

Would you be open to a brief call sometime this week?

Best regards`
    },
    {
        id: 'project-update',
        name: 'Project Status Update',
        category: 'project',
        triggers: ['project', 'update', 'progress', 'milestone', 'deliverable', 'sprint', 'deadline'],
        body: `Hi {{name}},

Here's the status update for {{projectName}}:

Current Status: {{status}}
Progress: {{progress}}%

Completed:
- {{completed1}}
- {{completed2}}

In Progress:
- {{inProgress1}}

Next Steps:
- {{nextSteps}}

Expected Completion: {{deadline}}

Please let me know if you have any questions or concerns.

Best regards`
    },
    {
        id: 'out-of-office',
        name: 'Out of Office Response',
        category: 'hr',
        triggers: ['out of office', 'away', 'unavailable', 'returning', 'back on'],
        body: `Hi {{name}},

Thank you for your email.

I'm currently out of the office and will return on {{returnDate}}. During this time, I'll have limited access to email.

For urgent matters, please contact {{alternateName}} at {{alternateEmail}}.

I'll respond to your email as soon as possible upon my return.

Thank you for your understanding.

Best regards`
    }
];
