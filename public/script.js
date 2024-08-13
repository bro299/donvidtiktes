document.getElementById('downloadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const videoUrl = document.getElementById('videoUrl').value;
    try {
        // Tampilkan spinner loading
        document.getElementById('loadingSpinner').style.display = 'block';

        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoUrl }),
        });
        const data = await response.json();
        console.log(data);  // Log data yang diterima dari server

        // Sembunyikan spinner loading
        document.getElementById('loadingSpinner').style.display = 'none';

        if (data.videoUrl && data.thumbnailUrl) {  // Hanya periksa videoUrl dan thumbnailUrl
            const title = data.title || 'No Title';  // Beri judul default jika title tidak ada
            const fileName = `TikTok_Video_${Date.now()}.mp4`;
            const isDarkTheme = document.body.classList.contains('dark-theme');
            const cardClass = isDarkTheme ? 'bg-dark text-white' : '';
            document.getElementById('result').innerHTML = `
                <div class="card mx-auto ${cardClass}" style="width: 18rem;">
                    <img src="${data.thumbnailUrl}" class="card-img-top" alt="Video Thumbnail">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <a href="${data.videoUrl}" class="btn btn-primary" download="${fileName}">Download Video</a>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('result').textContent = 'Error: Missing video information';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('result').textContent = 'Error downloading video';
    }
});

document.getElementById('pasteButton').addEventListener('click', function() {
    navigator.clipboard.readText()
        .then(text => document.getElementById('videoUrl').value = text)
        .catch(err => console.error('Failed to read clipboard contents: ', err));
});

document.getElementById('siteName').addEventListener('click', function() {
    location.reload();
});

document.getElementById('themeToggle').addEventListener('click', function() {
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const formControl = document.querySelectorAll('.form-control');
    const themeIcon = this.querySelector('i');

    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    
    navbar.classList.toggle('navbar-dark');
    navbar.classList.toggle('navbar-light');
    navbar.classList.toggle('bg-dark');
    navbar.classList.toggle('bg-light');
    
    formControl.forEach(input => {
        input.classList.toggle('light-theme');
        input.classList.toggle('dark-theme');
    });

    // Toggle the icon between sun and moon
    if (themeIcon.classList.contains('fa-sun')) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
});
