.PHONY: install

install:
	# Check if Python is installed
	python -c "import sys" || (echo "Python not found. Downloading and installing..." && curl -s https://www.python.org/ftp/python/3.10.0/python-3.10.0-amd64.exe --output python-3.10.0-amd64.exe && .\python-3.10.0-amd64.exe /quiet && del python-3.10.0-amd64.exe && echo "Python installed successfully.")

	# Check if pip is installed
	pip --version || (echo "pip not found. Downloading and installing..." && curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python get-pip.py && del get-pip.py && echo "pip installed successfully.")

	# Check if MongoDB is installed
	mongo --version || (echo "MongoDB not found. Downloading and installing..." && curl -s https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-5.0.3-signed.msi --output mongodb-windows-x86_64-5.0.3-signed.msi && msiexec /i mongodb-windows-x86_64-5.0.3-signed.msi /quiet && del mongodb-windows-x86_64-5.0.3-signed.msi && echo "MongoDB installed successfully.")

	# Check if Node.js is installed
	node --version || (echo "Node.js not found. Downloading and installing..." && curl -sL https://nodejs.org/dist/v17.0.0/node-v17.0.0-x64.msi --output node-v17.0.0-x64.msi && msiexec /i node-v17.0.0-x64.msi /quiet && del node-v17.0.0-x64.msi && echo "Node.js installed successfully.")

	cd documentbot && npm install
	cd backend && pip install -r requirements.txt
