const YOUTUBE_API_KEY = 'AIzaSyCFfVxRwk95cN5QjXHraaY8vIoE61m1qtQ';
const CHANNEL_ID = 'UCwEo1ScsPEF6sJuwaYGto8w';

async function fetchLatestVideo() {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            const videoTitle = data.items[0].snippet.title;
            
            // Update the iframe and title
            document.querySelector('.Youtube iframe').src = `https://www.youtube.com/embed/${videoId}`;
            document.querySelector('.Youtube h3').textContent = videoTitle;
        }
    } catch (error) {
        console.error('Error fetching latest video:', error);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchLatestVideo); 