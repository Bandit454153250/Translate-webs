document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var data = new Uint8Array(event.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        var sheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheetName];
        var text = XLSX.utils.sheet_to_json(worksheet, {header: 1}).map(row => row.join(' ')).join('\n');
        document.getElementById('output').innerText = text;
        document.getElementById('trans_output').innerText = text;

        var scale = Math.min(output.clientWidth / output.scrollWidth, output.clientHeight / output.scrollHeight);
        // 应用缩放
        output.style.transform = 'scale(' + scale + ')';

    };

    reader.readAsArrayBuffer(file);
});

document.getElementById('zoomIn').addEventListener('click', function() {
    var output = document.getElementById('output');
    var currentScale = parseFloat(output.style.transform.match(/scale\((\d+(\.\d+)?)\)/)[1]);
    var newScale = currentScale + 0.1;
    output.style.transform = 'scale(' + newScale + ')';
});

document.getElementById('zoomOut').addEventListener('click', function() {
    var output = document.getElementById('output');
    var currentScale = parseFloat(output.style.transform.match(/scale\((\d+(\.\d+)?)\)/)[1]);
    var newScale = currentScale - 0.1;
    output.style.transform = 'scale(' + newScale + ')';
});

document.getElementById('trans_zoomIn').addEventListener('click', function() {
    var output = document.getElementById('trans_output');
    var currentScale = parseFloat(output.style.transform.match(/scale\((\d+(\.\d+)?)\)/)[1]);
    var newScale = currentScale + 0.1;
    output.style.transform = 'scale(' + newScale + ')';
});

document.getElementById('trans_zoomOut').addEventListener('click', function() {
    var output = document.getElementById('trans_output');
    var currentScale = parseFloat(output.style.transform.match(/scale\((\d+(\.\d+)?)\)/)[1]);
    var newScale = currentScale - 0.1;
    output.style.transform = 'scale(' + newScale + ')';
});