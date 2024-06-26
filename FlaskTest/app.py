from flask import Flask, render_template, request, send_file, redirect, url_for, jsonify
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def get_filename(path):
    return os.path.basename(path)

app.jinja_env.globals.update(get_filename=get_filename)

@app.route('/')
def index():
    uploaded_files = os.listdir(app.config['UPLOAD_FOLDER'])
    return render_template('index.html', uploaded_files=uploaded_files, content=None)


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']
    if file.filename == '':
        return 'No selected file'

    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))

    return redirect(url_for('index'))


@app.route('/download_txt', methods=['POST'])
def download_txt():
    text = request.form['text']
    text = text.replace('\n', '\n')
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(debug=True)

