from flask import Flask, render_template, Response

app = Flask(__name__, template_folder="../ui/templates/")
app.config["SECRET_KEY"] = "j9573-4952-9029-1034"

@app.route('/')
def index():
    """
    Home page of the platform
    
    Contains a list of some of the streams that are currently live and the most popular categories.
    """

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)