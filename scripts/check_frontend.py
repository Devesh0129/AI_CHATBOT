import os
import subprocess
import sys

root = 'C:/Users/deves/OneDrive/Desktop/Project - September/AI_CHATBOT/frontend'
print('Frontend path:', root)
print('Exists:', os.path.exists(root))

if not os.path.exists(root):
    raise SystemExit('Frontend directory not found')

npm = 'C:/Program Files/nodejs/npm.cmd'
print('Running npm install...')
install = subprocess.run([npm, 'install'], cwd=root, capture_output=True, text=True)
print('INSTALL_RC', install.returncode)
print(install.stdout[:4000])
print(install.stderr[:4000])
if install.returncode != 0:
    raise SystemExit(install.returncode)

print('Running npm run build...')
build = subprocess.run([npm, 'run', 'build'], cwd=root, capture_output=True, text=True)
print('BUILD_RC', build.returncode)
print(build.stdout[:4000])
print(build.stderr[:4000])
if build.returncode != 0:
    raise SystemExit(build.returncode)

print('FRONTEND_CHECK_OK')
