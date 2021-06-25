const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const execFile = util.promisify(require('child_process').execFile);

const directoryPath = './background/scripts';

const getScriptsList = async (req) => {
    let scriptsInfos = [];
    const reqType = req.query.type;
    try {
        const files = await readdir(directoryPath);
        for (let i = 0; i < files.length; i++) {
            let line = await parseScriptInfo(directoryPath, files[i]);
            if (reqType === 'Neutral' || reqType === line.scriptType) {
                scriptsInfos.push(line);
            }
        }
    } catch (err) {
        console.log(err);
    }
    return scriptsInfos;
};

async function parseScriptInfo(directoryPath, fileName) {
    let filePath = directoryPath + '/' + fileName;
    const data = await readFile(filePath, 'utf8');
    let dataArray = data.split('\n');
    // If there is no name field in the file, it takes the name of the file
    let name = fileName.split('.')[0],
        type = '',
        isAll = '',
        isActive = '';
    //replace \r by nothing allows the removal of the Carriage Return if the script file is in CRLF
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].includes('#Name :')) {
            name = dataArray[i].replace('#Name : ', '');
            name = name.replace('\r', '');
        } else if (dataArray[i].includes('#Type :')) {
            type = dataArray[i].replace('#Type : ', '');
            type = type.replace('\r', '');
        } else if (dataArray[i].includes('#All :')) {
            isAll = dataArray[i].replace('#All : ', '');
            isAll = isAll.replace('\r', '');
        } else if (dataArray[i].includes('#Active :')) {
            isActive = dataArray[i].replace('#Active : ', '');
            isActive = isActive.replace('\r', '');
        }
    }
    const scriptInfos = {
        fileName: fileName,
        scriptName: name,
        scriptType: type,
        isAll: isAll,
        isActive: isActive,
    };
    return scriptInfos;
}

const postScriptAction = async (req) => {
    const stdout = await execScriptFile(
        directoryPath + '/' + req.body.fileName,
        req.body.args,
    );
    return stdout;
};

async function execScriptFile(scriptPath, args) {
    console.log('[Script] Name : ' + scriptPath + '\nArgs : ' + args);
    const { stdout } = await execFile('sh', [scriptPath, ...args]);
    return stdout;
}

module.exports = {
    getScriptsList,
    postScriptAction,
};
