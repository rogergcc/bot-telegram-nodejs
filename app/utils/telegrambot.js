// const request = require('request-promise');
const fetch = require('node-fetch');

const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN || ''
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`
module.exports = (
    {
        text,
        conversationId
    }

) => {
    // request({
    //     url: `${TELEGRAM_API_URL}/sendMessage`,
    //     qs: {
    //         text,
    //         chat_id: conversationId
    //     }
    // }).then(res => JSON.parse(res))

    fetch(`${TELEGRAM_API_URL}/sendMessage`,
        {
            method: "post",
            body: JSON.stringify({text,chat_id:conversationId}),
            headers: { "Content-Type": "application/json" }
        }
    )
        .then(res => res.json())
        .then(json => console.log(json));

}