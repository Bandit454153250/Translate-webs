window.onload = function() {
    document.getElementById('uploadButton').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', function() {
        var file = document.getElementById('fileInput').files[0];
        var fileUrl = URL.createObjectURL(file);
        document.getElementById('filePreview').src = fileUrl;
    });
};
