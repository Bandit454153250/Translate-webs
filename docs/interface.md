接口列表

首页
URL: /
方法: GET
描述: 显示上传的文件列表和最新上传的文件。
返回值: 渲染模板index.html，包括上传的文件列表和最新上传的文件。
上传文件

URL: /upload
方法: POST
描述: 上传文件到服务器。
参数: 表单中的文件字段名为file
返回值: 重定向到首页(/)。
下载文件

URL: /download/<path:filename>
方法: GET
描述: 下载指定文件。
参数: 文件名
返回值: 下载指定文件。
获取文件

URL: /get-file
方法: GET
描述: 获取特定文件（示例中为Test1.txt）。
返回值: 返回特定文件的内容。
获取已上传的文件列表

URL: /get_uploaded_files
方法: GET
描述: 获取已上传文件的列表。
返回值: 返回JSON格式的已上传文件列表。
显示选定文件内容

URL: /display_selected_file
方法: GET
描述: 根据文件扩展名显示不同类型文件的内容。
参数: selectedFile（所选文件名）
返回值: 返回所选文件的内容，如果是.txt文件则返回文本内容，.docx文件则返回文档文本内容，.pdf文件则在浏览器中显示文件内容。