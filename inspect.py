from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

app = Flask(__name__)

@app.route("/inspect", methods=["GET"])
def inspect():
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "Please provide a URL"}), 400

    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")

        html_content = soup.prettify()
        css_files = [urljoin(url, link['href']) for link in soup.find_all('link', rel='stylesheet')]
        js_files = [urljoin(url, script['src']) for script in soup.find_all('script') if script.get('src')]
        img_files = [urljoin(url, img['src']) for img in soup.find_all('img') if img.get('src')]

        return jsonify({
            "url": url,
            "html_preview": html_content[:2000],  # First 2000 chars
            "css_files": css_files,
            "js_files": js_files,
            "images": img_files
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)