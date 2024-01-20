const perPageOptions = [10, 30, 50, 100];
let currentPage = 1;
let reposPerPage = 10;

function loadRepositories() {
    const username = document.getElementById('username').value;
    const repositoriesDiv = document.getElementById('repositories');
    const loaderDiv = document.getElementById('loader');
    const paginationDiv = document.getElementById('pagination');
    const welcomeDiv = document.getElementById('welcome');
    if (!username) {
        alert('Please enter a GitHub username.');
        return;
    }

    loaderDiv.style.display = 'flex';
    repositoriesDiv.innerHTML = '';
    paginationDiv.innerHTML = '';
    welcomeDiv.innerHTML = '';

    // Fetch repositories from GitHub API and sort by creation date
    fetch(`https://api.github.com/users/${username}/repos?per_page=${reposPerPage}&page=${currentPage}&sort=created`)
        .then(response => response.json())
        .then(repositories => {
            loaderDiv.style.display = 'none';
            // Sort repositories by creation date (newest first)
            repositories.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            displayRepositories(repositories);
            displayWelcomeMessage(username);
            welcomeDiv.style.display = 'block';
            createPagination(repositories.length);
        })
        .catch(error => {
            loaderDiv.style.display = 'none';
            alert('Error fetching repositories. Please check the username and try again.');
            console.error(error);
        });
}
function displayWelcomeMessage(username) {
    const welcomeDiv = document.getElementById('welcome');
    const welcomeMessage = document.createElement('div');
    welcomeMessage.innerHTML = `<p>Welcome to ${username}'s repository page.</p>`;
    welcomeDiv.appendChild(welcomeMessage);
}


function displayRepositories(repositories) {
    const repositoriesDiv = document.getElementById('repositories');

    repositories.forEach(repository => {
        const repositoryDiv = document.createElement('div');
        repositoryDiv.classList.add('repository');

        repositoryDiv.innerHTML = `
            <h3>${repository.name}</h3>
            <p>${repository.description || 'No description available.'}</p>
            <p>Language: ${repository.language || 'Not specified'}</p>
            <p>Topics: ${repository.topics.join(', ')}</p>
        `;

        repositoriesDiv.appendChild(repositoryDiv);
    });
}


function createPagination(totalRepositories) {
    const paginationDiv = document.getElementById('pagination');

    const totalPages = Math.ceil(totalRepositories / reposPerPage);

    const selectPerPage = document.createElement('select');
    selectPerPage.addEventListener('change', (event) => {
        reposPerPage = parseInt(event.target.value);
        currentPage = 1;
        loadRepositories();
    });

    perPageOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = `${option} per page`;
        if (option === reposPerPage) {
            optionElement.selected = true;
        }
        selectPerPage.appendChild(optionElement);
    });

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => changePage(-1));
    prevButton.disabled = currentPage === 1;

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => changePage(1));
    nextButton.disabled = currentPage === totalPages;

    paginationDiv.innerHTML = '';
    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(selectPerPage);
    paginationDiv.appendChild(nextButton);
}



function changePage(change) {
    currentPage += change;
    loadRepositories();
}

