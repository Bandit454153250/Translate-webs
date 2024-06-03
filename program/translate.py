from flask import Flask, render_template, request, redirect, url_for
import os
import glob

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploaded_files')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def index():
    # 获取上传文件列表
    uploaded_files = os.listdir(app.config['UPLOAD_FOLDER'])

    # 获取最新上传文件路径
    directory_path = './uploaded_files'
    files = glob.glob(os.path.join(directory_path, '*'))
    files.sort(key=os.path.getmtime, reverse=True)
    latest_file_path = files[0] if files else None

    return render_template('web.html', uploaded_files=uploaded_files, latest_file_path=latest_file_path)


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']
    if file.filename == '':
        return 'No selected file'

    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)
