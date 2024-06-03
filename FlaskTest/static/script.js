   document.getElementById('fileInput').addEventListener('change', function(event) {
      var file = event.target.files[0];
      var reader = new FileReader();

      reader.onload = function(event) {
        var fileType = file.type;
        console.log('File type:', fileType);  // Log file type

        // 检查文件类型是否为 Excel 文件
        if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          var data = new Uint8Array(event.target.result);
          var workbook = XLSX.read(data, {type: 'array'});
          var sheetName = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[sheetName];
          var text = XLSX.utils.sheet_to_json(worksheet, {header: 1}).map(row => row.join(' ')).join('\n');
          document.getElementById('output').innerText = text;
          document.getElementById('trans_output').innerText = text;
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
          });
        }
        // 检查文件类型是否为 PPT 文件
        else if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
          var arrayBuffer = event.target.result;
          var zip = new JSZip();
          zip.loadAsync(arrayBuffer).then(function(content) {
            var slidePromises = [];
            for (var i = 1; i <= content.file(/ppt\/slides\/slide\d+\.xml/).length; i++) {
              slidePromises.push(zip.file("ppt/slides/slide" + i + ".xml").async("string"));
            }
            return Promise.all(slidePromises);
          }).then(function(slideContents) {
            var text = "";
            slideContents.forEach(function(slideContent, index) {
              var parser = new DOMParser();
              var xmlDoc = parser.parseFromString(slideContent, "text/xml");
              var texts = xmlDoc.getElementsByTagName("a:t");
              text += "Slide " + (index + 1) + ":\n";
              for (var i = 0; i < texts.length; i++) {
                text += texts[i].textContent + "\n";
              }
              text += "\n";
            });
            document.getElementById('output').innerText = text;
            document.getElementById('trans_output').innerText = text;
          });
        }
        // 检查文件类型是否为 PDF 文件
        else if (fileType === 'application/pdf') {
          var typedarray = new Uint8Array(event.target.result);
          console.log('PDF file detected');  // Log PDF detection

          pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            var pagesPromises = [];
            console.log('PDF loaded, number of pages:', pdf.numPages);  // Log PDF page count

            for (var i = 1; i <= pdf.numPages; i++) {
              pagesPromises.push(pdf.getPage(i).then(function(page) {
                return page.getTextContent().then(function(textContent) {
                  return textContent.items.map(item => item.str).join(' ');
                });
              }));
            }

            Promise.all(pagesPromises).then(function(pagesText) {
              var text = pagesText.join('\n\n');
              document.getElementById('output').innerText = text;
              document.getElementById('trans_output').innerText = text;
            }).catch(function(error) {
              console.error('Error processing PDF pages:', error);
              alert('Error processing PDF pages.');
            });
          }).catch(function(error) {
            console.error('Error loading PDF:', error);
            alert('Error loading PDF file.');
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
