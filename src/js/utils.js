const utils = {
    formatDate: (date) => {
        const dateObj = new Date(date);

        return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    },
    parseImage: (htmlString) => {
        const container = window.document.createElement('div');
        container.innerHTML = htmlString;

        return container.querySelector('img').src;
    }
}

export default utils;
