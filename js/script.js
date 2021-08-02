const overview = document.querySelector(".overview");   // Where my profile info will appear
const username = "lilyyee";                             // Github username
const repoList = document.querySelector(".repo-list");   // Unordered list to display repos
const allRepos = document.querySelector(".repos");      // Section where all the repo info appears
const repoData = document.querySelector(".repo-data");  // Where the individual repo data appears
const viewReposButton = document.querySelector(".view-repos");   // Button to go back to Repo Gallery
const filterInput = document.querySelector(".filter-repos");  // Input area where you can search for repo


// Fetch GitHub user info data
const gitUserInfo = async function (){
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    //console.log(data);
    displayUserInfo(data);
};

gitUserInfo();

// Display User Info
const displayUserInfo = function (data){
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
        <figure>
            <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Bio:</strong> ${data.bio}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>
    `;
    overview.append(div);
    gitRepos();
};

// Fetch Repos
const gitRepos = async function (){
    const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await fetchRepos.json();
    //console.log(repoData);
    displayRepos(repoData);
};

// Function that displays all the repos
const displayRepos = function (repos){
    filterInput.classList.remove("hide");
    for (const repo of repos){
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

// Click event for displayed repos
repoList.addEventListener("click", function(e){
    if(e.target.matches("h3")){
        const repoName = e.target.innerText;
        //console.log(repoName);
        getRepoInfo(repoName);
    }
});

// Function to fetch specific repo info
const getRepoInfo = async function (repoName){
    const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    //console.log(repoInfo);
    
    // Grab languages
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    //console.log(languageData);

    // Make list of languages
    const languages = [];
    for (const language in languageData){
        languages.push(language);
        //console.log(languages);
    }

    displayRepoInfo(repoInfo, languages);
};

// Function to display specific repo info
const displayRepoInfo = function (repoInfo, languages){
    viewReposButton.classList.remove("hide");
    repoData.innerHTML = "";
    repoData.classList.remove("hide");
    allRepos.classList.add("hide");
    const div = document.createElement("div");
    div.innerHTML = `
        <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoData.append(div);
};

// Click event for Back to Repo Gallery button
viewReposButton.addEventListener("click", function (){
    allRepos.classList.remove("hide");
    repoData.classList.add("hide");
    viewReposButton.classList.add("hide");
});

// Add input event to search box - Dynamic Search Box
filterInput.addEventListener("input", function (e){
    const searchText = e.target.value;
    //console.log(searchText);
    const repos = document.querySelectorAll(".repo");
    const searchLowerText = searchText.toLowerCase();

    for (const repo of repos){
        const repoLowerText = repo.innerText.toLowerCase();
        if (repoLowerText.includes(searchLowerText)){
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});