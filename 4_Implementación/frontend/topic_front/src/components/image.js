
export const Image = (image) => {
    
    const body = {
        image: image
    }

    // Send data to backend
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }
    fetch('/assets/image', requestOptions)
    .then(response => Promise.all([
        response.json(),
        response.status
    ])) // convert to json
    .then(data => {
        const message = data[0]
        const status = data[1]
        if (status === 200) {
            console.log(message)
        }
        else {
            console.log(message)
        }
    }) // print data to console
    .catch(err => console.log(err)) // print error to console
}