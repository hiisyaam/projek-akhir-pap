document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        const tabId = button.id.replace('tab-', '');
        const correspondingContent = document.getElementById(`tab-content-${tabId}`);
        if (button.id === 'tab-url') {
            button.classList.add('active-tab', 'text-violet-300', 'border-violet-300', 'font-semibold');
            button.classList.remove('text-white', 'border-transparent');
            if (correspondingContent) {
                correspondingContent.classList.remove('hidden');
            }
        } else {
            button.classList.remove('active-tab', 'text-violet-300', 'border-violet-300', 'font-semibold');
            button.classList.add('text-white', 'border-transparent');
            if (correspondingContent) {
                correspondingContent.classList.add('hidden');
            }
        }
    });


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

    if (fileInput && fileDropZone && selectedFilesDiv) {
        fileInput.addEventListener('change', function (e) {
            displaySelectedFiles(e.target.files);
        });

        fileDropZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('border-violet-500', 'bg-cyber-card/50');
            this.classList.remove('border-gray-600');
        });

        fileDropZone.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.classList.remove('border-violet-500', 'bg-cyber-card/50');
            this.classList.add('border-gray-600');
        });

        fileDropZone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('border-violet-500', 'bg-cyber-card/50');
            this.classList.add('border-gray-600');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                displaySelectedFiles(files);
            }
        });
    }


    function displaySelectedFiles(files) {
        if (!selectedFilesDiv) return;
        selectedFilesDiv.innerHTML = '';
        if (files && files.length > 0) {
            Array.from(files).forEach((file, index) => {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'flex items-center justify-between bg-gray-700/50 rounded-lg p-3 text-sm shadow'; // Sedikit penyesuaian style
                fileDiv.innerHTML = `
                            <div class="flex items-center overflow-hidden mr-2">
                                <i class="fas fa-file-alt text-violet-400 mr-2 flex-shrink-0"></i>
                                <span class="text-gray-300 truncate flex-1" title="${file.name}">${file.name}</span>
                            </div>
                            <div class="flex items-center flex-shrink-0">
                                <span class="text-gray-500 text-xs ml-2">${formatFileSize(file.size)}</span>
                                <button type="button" onclick="removeFile(${index})" class="ml-3 text-red-500 hover:text-red-400 transition-colors" title="Hapus file">
                                    <i class="fas fa-times-circle"></i>
                                </button>
                            </div>
                        `;
                selectedFilesDiv.appendChild(fileDiv);
            });
        }
    }


    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    window.removeFile = function (indexToRemove) {
        if (!fileInput) return;
        const currentFiles = Array.from(fileInput.files);
        const newFiles = currentFiles.filter((file, index) => index !== indexToRemove);
        
        const dataTransfer = new DataTransfer();
        newFiles.forEach(file => dataTransfer.items.add(file));
        
        fileInput.files = dataTransfer.files;
        displaySelectedFiles(fileInput.files);
    };
});