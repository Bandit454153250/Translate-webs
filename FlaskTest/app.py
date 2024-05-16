from document import Document
from flask import Flask, render_template, request, send_file, redirect, url_for
import os
import glob

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def get_filename(path):
    return os.path.basename(path)


app.jinja_env.globals.update(get_filename=get_filename)


@app.route('/')
def index():
    uploaded_files = os.listdir(app.config['UPLOAD_FOLDER'])

    directory_path = './uploads'
    files = glob.glob(os.path.join(directory_path, '*'))
    files.sort(key=os.path.getmtime, reverse=True)
    latest_file_path = files[0] if files else None

    return render_template('index.html', uploaded_files=uploaded_files, latest_file_path=latest_file_path)


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']
    if file.filename == '':
        return 'No selected file'

    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    return redirect(url_for('index'))


@app.route('/download/<path:filename>', methods=['GET'])
def download(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename), as_attachment=True, mimetype='text/plain; charset=utf-8')


@app.route('/get-file')
def get_file():
    file_path = './uploads/Test1.txt'
    return send_file(file_path)


@app.route('/get_uploaded_files', methods=['GET'])
def get_uploaded_files():
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    return {'files': files}


@app.route('/display_selected_file', methods=['GET'])
def display_selected_file():
    selected_file = request.args.get('selectedFile')
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], selected_file)
    if os.path.exists(file_path):
        file_extension = selected_file.rsplit('.', 1)[1].lower()
        if file_extension == 'txt':
            with open(file_path, 'r', encoding='utf-8') as file:
                file_content = file.read()
            return file_content
        elif file_extension == 'docx':
            doc = Document()
            text_content = ""
            for paragraph in doc.paragraphs:
                text_content += paragraph.text + "\n"
            return text_content
        elif file_extension == 'pdf':
            return send_file(file_path, as_attachment=False)
        else:
            return 'Unsupported file type'
    else:
        return 'File not found'


if __name__ == '__main__':
    app.run(debug=True)
