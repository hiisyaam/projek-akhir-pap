
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.id.replace('tab-', '');

            tabButtons.forEach(btn => {
                btn.classList.remove('active-tab', 'text-violet-300', 'border-violet-300', 'font-semibold');
                btn.classList.add('text-white', 'border-transparent');
            });

            this.classList.add('active-tab', 'text-violet-300', 'border-violet-300', 'font-semibold');
            this.classList.remove('text-white', 'border-transparent');

            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            const activeContent = document.getElementById(`tab-content-${tabId}`);
            if (activeContent) {
                activeContent.classList.remove('hidden');
            }
        });
    });


    const fileInput = document.getElementById('file-input');
    const fileDropZone = document.getElementById('file-drop-zone');
    const selectedFilesDiv = document.getElementById('selected-files');

    fileInput.addEventListener('change', function (e) {
        displaySelectedFiles(e.target.files);
    });

    fileDropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });

    fileDropZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });

    fileDropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        displaySelectedFiles(files);
        fileInput.files = files;
    });

    function displaySelectedFiles(files) {
        selectedFilesDiv.innerHTML = '';
        if (files.length > 0) {
            Array.from(files).forEach((file, index) => {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'flex items-center justify-between bg-gray-800 rounded-lg p-3 text-sm';
                fileDiv.innerHTML = `
                            <span class="text-gray-300 truncate flex-1">${file.name}</span>
                            <span class="text-gray-500 text-xs ml-2">${formatFileSize(file.size)}</span>
                            <button onclick="removeFile(${index})" class="ml-2 text-red-400 hover:text-red-300">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        `;
                selectedFilesDiv.appendChild(fileDiv);
            });
        }
    }


    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    window.removeFile = function (index) {
        const dt = new DataTransfer();
        const files = Array.from(fileInput.files);
        files.splice(index, 1);
        files.forEach(file => dt.items.add(file));
        fileInput.files = dt.files;
        displaySelectedFiles(fileInput.files);
    };
});