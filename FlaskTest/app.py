from flask import Flask, render_template, request, send_file, redirect, url_for
import os
from docx import Document

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# 提取 Word 文档内容的函数
def extract_content(file_path):
    doc = Document(file_path)
    content = ""
    for para in doc.paragraphs:
        content += para.text + "\n"
    return content


def get_filename(path):
    return os.path.basename(path)


app.jinja_env.globals.update(get_filename=get_filename)


@app.route('/')
def index():
    uploaded_files = os.listdir(app.config['UPLOAD_FOLDER'])
    uploaded_files = [f for f in uploaded_files if f.endswith('.docx')]  # 只显示 .docx 文件
    return render_template('index.html', uploaded_files=uploaded_files, content=None)


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']
    if file.filename == '':
        return 'No selected file'

    if file and file.filename.endswith('.docx'):
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))

    return redirect(url_for('index'))


@app.route('/display_selected_file', methods=['GET'])
def display_selected_file():
    selected_file = request.args.get('selectedFile')
    if selected_file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], selected_file)
        if os.path.exists(file_path):
            content = extract_content(file_path)
            uploaded_files = os.listdir(app.config['UPLOAD_FOLDER'])
            uploaded_files = [f for f in uploaded_files if f.endswith('.docx')]
            return render_template('index.html', uploaded_files=uploaded_files, content=content)
    return 'File not found'


@app.route('/download/<path:filename>', methods=['GET'])
def download(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename), as_attachment=True,
                     mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document')


if __name__ == '__main__':
    app.run(debug=True)

