document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const usernameInput = document.getElementById('usernameInput');
    const resultContainer = document.getElementById('resultContainer');

    searchButton.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        if (!username) {
            displayMessage('कृपया वैध उपयोगकर्ता नाम या Instagram लिंक डालें।', 'error');
            return;
        }

        displayMessage('लोड हो रहा है...', 'loading');

        try {
            const response = await fetch('/api/instagram/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'कुछ गलत हो गया।');
            }

            renderResult(data);

        } catch (error) {
            displayMessage(`त्रुटि: ${error.message}`, 'error');
        }
    });

    function renderResult(data) {
        resultContainer.innerHTML = ''; // Clear previous results

        if (data.profile) {
            const { profile } = data;
            const profileElement = document.createElement('div');
            profileElement.innerHTML = `
                <div class="profile-header">
                    <img src="${profile.photo}" alt="Profile Photo" class="profile-photo">
                    <div class="profile-info">
                        <h2>${profile.username}</h2>
                        <div class="profile-stats">
                            <span><strong>${profile.followers}</strong> फॉलोअर्स</span>
                            <span><strong>${profile.following}</strong> फॉलोइंग</span>
                        </div>
                        <p>${profile.fullName}</p>
                        <p>${profile.bio}</p>
                    </div>
                </div>
                <h3>हाल की सार्वजनिक पोस्ट</h3>
                ${profile.posts.length > 0 ? `
                    <div class="profile-posts">
                        ${profile.posts.map(post => `<div class="post"><img src="${post.imageUrl}" alt="${post.caption}"><p>${post.caption}</p></div>`).join('')}
                    </div>
                ` : '<p>कोई सार्वजनिक पोस्ट नहीं मिली।</p>'}
            `;
            resultContainer.appendChild(profileElement);
        } else if (data.message) {
            displayMessage(data.message, 'info');
        }
    }

    function displayMessage(message, type) {
        resultContainer.innerHTML = `<p class="message ${type}">${message}</p>`;
    }
});