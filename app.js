document.addEventListener('DOMContentLoaded', () => {
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        tasks
            .filter(task => filter === 'all' || task.completed === (filter === 'completed'))
            .forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.innerHTML = `
                    <div>
                        <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                        <strong>${task.title}</strong> - ${task.description || 'No description'}
                    </div>
                    <div class="task-buttons">
                        <button data-action="edit" data-index="${index}">Edit</button>
                        <button data-action="delete" data-index="${index}">Delete</button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
    }

    addTaskBtn.addEventListener('click', () => {
        if (taskTitle.value.trim()) {
            tasks.push({ title: taskTitle.value, description: taskDesc.value, completed: false });
            taskTitle.value = '';
            taskDesc.value = '';
            saveTasks();
            renderTasks();
        }
    });

    taskList.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        const action = e.target.dataset.action;

        if (e.target.type === 'checkbox') {
            tasks[index].completed = e.target.checked;
        } else if (action === 'edit') {
            const task = tasks[index];
            taskTitle.value = task.title;
            taskDesc.value = task.description;
            tasks.splice(index, 1);
        } else if (action === 'delete') {
            tasks.splice(index, 1);
        }

        saveTasks();
        renderTasks();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            button.classList.add('active');
            renderTasks(button.dataset.filter);
        });
    });

    renderTasks();
});
