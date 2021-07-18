import glob
import json
import os
import subprocess

from plugins import command

with open("./settings.json") as f:
    clasp_settings = json.load(f)["clasp"]


def clasp_clone(directory_name: str, script_id: str):
    cwd = clasp_settings["default_directory"]+directory_name
    os.makedirs(cwd, exist_ok=True)
    process_npm = command.exec_command(["npm", "init", "-y"], cwd)
    process_clasp = command.exec_command(
        ["clasp", "clone", script_id], cwd=cwd)
    return (process_npm, process_clasp)


def get_list():
    return {i: j for i, j in enumerate(glob.glob(clasp_settings["default_directory"]+"*"))}
