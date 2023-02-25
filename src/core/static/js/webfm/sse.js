const publishURL   = `https://www.webfm.com/sse/1234/sse`;
const subscribeURL = `https://www.webfm.com/sse/1234/sse`;
const eventSource  = new EventSource(subscribeURL);

// Publish button
// document.getElementById("publishButton").onclick = () => {
//     fetch(publishURL, {
//         method: 'POST', // works with PUT as well, though that sends an OPTIONS request too!
//         body: `It is ${new Date().toString()}. This is a test.`
//     })
// };

// ---- Incoming events ---- //

// eventSource.onopen = () => {
//     console.log(e);
// };

eventSource.onerror = (e) => {
    console.log(e);
};

eventSource.onmessage = (e) => {
    console.log(e.data);
};
