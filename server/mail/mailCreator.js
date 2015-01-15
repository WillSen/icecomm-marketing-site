var messageContent = {
    "html": "<p>Hi</p>",
    "subject": "IceComm Verification",
    "from_email": "icecomm.io@gmail.com",
    "from_name": "IceComm",
    "to": [{
            "email": "azai91@gmail.com",
            "name": "Recipient Name",
            "type": "to"
        }],
    "headers": {
        "Reply-To": "message.reply@example.com"
    },
    "important": false,
    "track_opens": null,
    "track_clicks": null,
    "auto_text": null,
    "auto_html": null,
    "inline_css": null,
    "url_strip_qs": null,
    "preserve_recipients": null,
    "view_content_link": null,
    "bcc_address": "message.bcc_address@example.com",
    "tracking_domain": null,
    "signing_domain": null,
    "return_path_domain": null,
    "merge": true,
    "merge_language": "mailchimp",
    "global_merge_vars": [{
            "name": "merge1",
            "content": "merge1 content"
        }],
    "merge_vars": [{
            "rcpt": "recipient.email@example.com",
            "vars": [{
                    "name": "merge2",
                    "content": "merge2 content"
                }]
        }],
    "tags": [
        "password-resets"
    ],
    "google_analytics_domains": [
        "example.com"
    ],
    "images": []
};

module.exports = function(link) {
    var html = "<p>Hi</p></br><p>" + link + "</p>";
    messageContent.html = html;
    console.log('hello');
    console.log(html);
    return messageContent;
};