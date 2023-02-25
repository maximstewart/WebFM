const sse_id       = getCookie("sse_id");
const publishURL   = `https://www.webfm.com/sse/${sse_id}/sse`;
const subscribeURL = publishURL;
const eventSource  = new EventSource(subscribeURL);


// ---- Incoming events ---- //

// eventSource.onopen = (eve) => {
//     console.log(eve);
// };

eventSource.onerror = (eve) => {
    console.log(publishURL);
    console.log(eve);
};

eventSource.onmessage = (eve) => {
    try {
        const data    = JSON.parse(eve.data);
        const sse_msg = JSON.parse(data.message);
        if (sse_msg.hasOwnProperty('path') || sse_msg.hasOwnProperty('stream')) {
            const target = (sse_msg.path) ? sse_msg.path : sse_msg.stream;
            handleMedia(target);
            return;
        } else if (sse_msg.hasOwnProperty('message')) {
            displayMessage(sse_msg.message.text, sse_msg.message.type);
        }
    } catch (e) {
        console.log(e);
    }
};
