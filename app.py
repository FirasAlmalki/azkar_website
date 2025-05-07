from flask import Flask, render_template
from datetime import datetime, timedelta

app = Flask(__name__)

@app.route("/")
def home():
    now = datetime.now()
    hour = now.hour

    if 4 <= hour < 16:
        image_file = "morning.jpg"
        # Next switch at 16:00
        next_switch = now.replace(hour=16, minute=0, second=0, microsecond=0)
    else:
        image_file = "evening.jpg"
        # Next switch at 04:00 tomorrow
        next_day = now + timedelta(days=1) if hour >= 16 else now
        next_switch = next_day.replace(hour=4, minute=0, second=0, microsecond=0)

    # Convert to timestamp in milliseconds for JS
    next_switch_timestamp = int(next_switch.timestamp() * 1000)

    return render_template("index.html", image_file=image_file, next_switch=next_switch_timestamp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
