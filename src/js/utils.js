import debounce from 'lodash.debounce';

const utils = {
    formatDate: (date) => {
        const dateObj = new Date(date);

        return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    },
    parseImage: (htmlString) => {
        const container = window.document.createElement('div');
        container.innerHTML = htmlString;

        return container.querySelector('img').src;
    },
    matchHeight: debounce((resize) => {
        const parents = window.document.querySelectorAll('[data-match-height-container]');

        parents.forEach((parent) => {
            const watches = parent.querySelectorAll('[data-match-height-watch]');
            let maxHeight = 0;

            watches.forEach((watch) => {
                if (resize) {
                    watch.style.height = 'auto';
                }

                const watchHeight = parseInt(window.getComputedStyle(watch).height, 10)
                if (watchHeight > maxHeight) {
                    maxHeight = watchHeight;
                }
            });
            if (window.innerWidth > 767) {
                watches.forEach((watch) => {
                    watch.style.height = `${maxHeight}px`;
                });
            }
        });
    }, 150)
}

export default utils;
