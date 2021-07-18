import subprocess


def exec_command(commands: list[str], cwd: str):
    return subprocess.run(commands, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True, shell=True)


def stringify(process: subprocess.CompletedProcess[str]):
    return f"""
return code:{process.returncode}
{process.stdout}
{process.stdout}
"""
