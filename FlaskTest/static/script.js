document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var data = new Uint8Array(event.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        var sheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheetName];
        var text = XLSX.utils.sheet_to_json(worksheet, {header: 1}).map(row => row.join(' ')).join('\n');
        document.getElementById('xlsx_content').innerText = text;
    };

    reader.readAsArrayBuffer(file);
});
