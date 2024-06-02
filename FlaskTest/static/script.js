document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var fileType = file.type;

        // 检查文件类型是否为 Excel 文件
        if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            var data = new Uint8Array(event.target.result);
            var workbook = XLSX.read(data, {type: 'array'});
            var sheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[sheetName];
            var text = XLSX.utils.sheet_to_json(worksheet, {header: 1}).map(row => row.join(' ')).join('\n');
            document.getElementById('output').innerText = text;
            document.getElementById('trans_output').innerText = text;

            // 添加缩放效果
            var scale = Math.min(output.clientWidth / output.scrollWidth, output.clientHeight / output.scrollHeight);
            output.style.transform = 'scale(' + scale + ')';
        }
        // 检查文件类型是否为 Word 文档
        else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            var arrayBuffer = event.target.result;
            var zip = new JSZip();
            zip.loadAsync(arrayBuffer).then(function(content) {
                return zip.file("word/document.xml").async("string");
            }).then(function(xmlText) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlText, "text/xml");
                var paragraphs = xmlDoc.getElementsByTagName("w:t");
                var text = "";
                for (var i = 0; i < paragraphs.length; i++) {
                    text += paragraphs[i].textContent + "\n";
                }
                document.getElementById('output').innerText = text;
                document.getElementById('trans_output').innerText = text;

                // 添加缩放效果
                var scale = Math.min(output.clientWidth / output.scrollWidth, output.clientHeight / output.scrollHeight);
                output.style.transform = 'scale(' + scale + ')';
            });
        } else {
            alert('Unsupported file type');
        }
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