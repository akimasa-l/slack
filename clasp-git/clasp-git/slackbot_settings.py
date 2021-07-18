import json
with open("./settings.json") as f:
    slackbot_settings = json.load(f)["slackbot"]
API_TOKEN = slackbot_settings["API_TOKEN"]
DEFAULT_REPLY = "DEFAULT_REPLY",
PLUGINS = ["plugins"]
