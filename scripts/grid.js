const aircraftData = [
    {
        imgSrc: "img/kodiak_100.png",
        imgAlt: "Kodiak 100",
        caption: "Kodiak 100",
        largeImgSrc: "img/kodiak_100_large.png"
    },
    {
        imgSrc: "img/southwest_airlines_freedom.png",
        imgAlt: "Southwest Airlines Freedom One",
        caption: "Southwest Airlines Freedom One",
        largeImgSrc: "img/southwest_airlines_freedom_large.png"
    },
    {
        imgSrc: "img/alaska_airlines_honoring.png",
        imgAlt: "Alaska Airlines Honoring Those Who Served",
        caption: "Alaska Airlines Honoring Those Who Served",
        largeImgSrc: "img/alaska_airlines_honoring_large.png"
    }
];

const galleryGrid = document.querySelector('.gallery-grid');

// Dynamically populate the gallery
aircraftData.forEach(aircraft => {
    const figure = document.createElement('figure');
    const anchor = document.createElement('a');
    anchor.href = aircraft.largeImgSrc;
    anchor.setAttribute('data-lightbox', 'aircraft-gallery');

    const img = document.createElement('img');
    img.src = aircraft.imgSrc;
    img.alt = aircraft.imgAlt;

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = aircraft.caption;

    anchor.appendChild(img);
    figure.appendChild(anchor);
    figure.appendChild(figcaption);

    galleryGrid.appendChild(figure);
});