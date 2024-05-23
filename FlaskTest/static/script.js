
    $(document).ready(function() {
        $.ajax({
            url: '/get_uploaded_files',
            type: 'GET',
            success: function(response) {
                var files = response.files;
                var select = $('#fileSelect');
                files.forEach(function(file) {
                    select.append($('<option>', {
                        value: file,
                        text: file
                    }));
                });
            },
            error: function(error) {
                console.log(error);
                alert('获取文件列表失败！');
            }
        });

        $('#displayButton').click(function() {
            var selectedFile = $('#fileSelect').val();
            $.ajax({
                url: '/display_selected_file',
                type: 'GET',
                data: { selectedFile: selectedFile },
                success: function(response) {
                    $('#fileContent').text(response);
                },
                error: function(error) {
                    console.log(error);
                    alert('获取文件内容失败！');
                }
            });
        });

        $('#fileSelect').change(function() {
            var selectedFile = $(this).val();
            $.ajax({
                url: '/display_selected_file',
                type: 'GET',
                data: { selectedFile: selectedFile },

                success: function(response) {
                    $('#fileContent').text(response);
                },
                error: function(error) {
                    console.log(error);
                    alert('获取文件内容失败！');
                }
            });
        });
    });




