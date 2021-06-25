const execShellCommand = require('../../utils/utils').execShellCommand;

const platform = process.platform;

const getProcessInfosByPID = async (pid) => {
    let getProcess = await execShellCommand(`ps -q ${pid} -o user,cmd`);
    getProcess = getProcess.split('\n')[1]
    getProcess = getProcess.replace(/ +(?= )/g,'').trim().split(' '); // Replace multiple spaces with a single space. Credit: https://stackoverflow.com/questions/3286874/remove-all-multiple-spaces-in-javascript-and-replace-with-single-space
    const processUser = getProcess[0];
    const processCommand = getProcess[1];
    const processPath = getProcess[2];
    const processInfos = { "pid": pid, "user": processUser, "cmd": processCommand, "path": processPath }
    return processInfos;
}

const getPorts = async () => {
    let portIndex = 3;
    let pidIndex = 6;
    let pidReg = /\d+/

    let getNetstat;
    if(platform === "win32") {
        getNetstat = await execShellCommand('netstat -atno | grep "LISTEN"'); // -o to get the PID
        portIndex = 1;
        pidIndex = 4;
    } else {
        getNetstat = await execShellCommand('netstat -atnp | grep "LISTEN"'); // -p to get the name and PID of process
    }

    getNetstat = getNetstat.split('\n');
    let line = "";
    let parsedLine = "";
    let portsInfo = [];
    for(let i=0; i<getNetstat.length; i++) {
        line = getNetstat[i].replace(/ +(?= )/g,'').trim().split(' ') // Replace multiple spaces with a single space. Credit: https://stackoverflow.com/questions/3286874/remove-all-multiple-spaces-in-javascript-and-replace-with-single-space
        
        if(line != '') {
            let address = line[1];

            let port = line[portIndex].split(':');
            port = port[port.length-1];

            let process = line[pidIndex]
            let pid = "-"
            if(process != "-") {
                pid = process.match(pidReg)[0]
            }

            let processInfos = {};
            if(platform === "win32") {
                processInfos = { "pid": pid, "user": "-", "cmd": "-", "path": "-" };
            } else if(pid != "-") {
                processInfos = await getProcessInfosByPID(pid);
            }

            parsedLine = {
                "port": port,
                "address": address,
                "ps": processInfos
            }
            portsInfo.push(parsedLine);
        }
    }

    return portsInfo;
};

module.exports = {
    getPorts
};
