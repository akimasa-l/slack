import shlex
import json

from slackbot.bot import respond_to

from plugins import clasp, command


@respond_to(r"^clasp\s+clone\s+\S+\s+\S+$")
def clasp_clone(message):
    directory_name, script_id = shlex.split(message.body['text'])[2:]
    processes = clasp.clasp_clone(directory_name, script_id)
    message.reply("```"+"\n".join(map(command.stringify, processes))+"```")


@respond_to(r"^list$")
def show_list(message):
    message.reply(json.dumps(clasp.get_list(), indent=4))
