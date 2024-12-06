export default async function loadGridData(gridID, cellTemplateClass) {
    const grid = document.getElementById(gridID);
    const template = document.getElementsByClassName(cellTemplateClass)[0];

    try {
        const response = await fetch('./data/projects.json');
        const data = await response.json();

        data.forEach(item => {
            const cell = template.content.cloneNode(true);
            const projectContent = cell.querySelector('.projects-content');
            // Image Preview
            cell.querySelector('.projects-preview img').src = item.image ;
            cell.querySelector('.projects-preview img').alt = item.title;

            // Title
            cell.querySelector('.project-title').innerHTML = item.title;

            // Description
            cell.querySelector('.project-description').innerHTML = item.description;


            // Tags
            const tags = item.tags;
            const tagsContainer = cell.querySelector('.project-tags-container')
            tags.forEach(tag => {
                const tagUI = document.createElement('div');
                tagUI.textContent = tag;
                tagsContainer.appendChild(tagUI);
            });

        
            // Tasks details
            const tasks = item.tasks;
            const tasksContainer = cell.querySelector('.project-tasks-container')
            tasks.forEach(task => {
                const taskUI = document.createElement('li');
                taskUI.textContent = task;
                tasksContainer.appendChild(taskUI);
            });

            grid.appendChild(cell);

            const linkButton = projectContent.querySelector('.project-link-btn');
            linkButton.style.display = "none";
            if ("link" in item) {               
                if (item.link !=""){
                    linkButton.style.display = "block";
                    linkButton.addEventListener('click', function () {
                        window.location.assign(item.link);
                    });
                }
            }

            const githubButton = projectContent.querySelector('.project-src-btn');
            githubButton.style.display = "none";
            if ("github" in item) {               
                if (item.github !=""){
                    githubButton.style.display = "block";
                    githubButton.addEventListener('click', function () {
                        window.location.assign(item.github);
                    });
                }
            }

    

        });
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}



