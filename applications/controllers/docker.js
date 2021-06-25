const execShellCommand = require('../../utils/utils').execShellCommand;

const getDockerHello = async () => {
    const isDockerThere = await execShellCommand('docker');
    if (isDockerThere.includes('docker [OPTIONS] COMMAND')) {
        return 'Docker says hello';
    } else {
        return 'Docker not there'; //Dockern't
    }
};

const getDockerVersion = async () => {
    const dockerVersion = await execShellCommand('docker -v');
    return dockerVersion;
};

const getDockerInformations = async () => {
    // Fields names are surrounded by hashtags so as not to confuse them with terms that are identical in their values
    const dockerFormat =
        '"#ID#":{{.ID}},"#Image#":{{.Image}},"#Created#":{{.RunningFor}},"#Status#":{{.Status}},"#Names#":{{.Names}},"#Size#":{{.Size}},"#Ports#":{{.Ports}}';
    const rawDockerInfo = await execShellCommand('docker ps -a --format ' + dockerFormat + '');
    let parsedDockerInformations = [];
    // Verifies that there is at least one docker process running and that the docker command doesn't failed (if the docker daemon is not running for example)
    if (!rawDockerInfo.includes('error during connect')) {
        parsedDockerInformations = parseDockerInformations(rawDockerInfo);
    }
    return parsedDockerInformations;
};

function parseDockerInformations(dockerInfo) {
    const dockerInfoArray = dockerInfo.split('\n');
    let dockerInfoObjectArray = [];
    for (let i = 0; i < dockerInfoArray.length; i++) {
        if (dockerInfoArray[i]) {
            let thisLine = dockerInfoArray[i];
            // Problem with the ports because there can be several commas
            let rePorts = new RegExp(/#Ports#.*/);
            let portsInfo = thisLine.match(rePorts)[0];
            thisLine = thisLine.replace(rePorts, '');
            // We replace all spaces by underscore to put spaces after all commas
            thisLine = thisLine.replace(/ /g, '_');
            thisLine = thisLine.replace(/,/g, ', ');
            // We search all words to put quotes around them
            let reEntities = new RegExp(/:\S+,/g);
            const foundEntitie = thisLine.match(reEntities);
            for (let j = 0; j < foundEntitie.length; j++) {
                let word = foundEntitie[j];
                thisLine = thisLine.replace(word, ':"' + word.slice(1, -1) + '",');
            }
            // Verify if there is a Ports value
            if (portsInfo != '#Ports#:') {
                let reAfterPorts = new RegExp(/:.*/);
                let portsInfoExtract = portsInfo.match(reAfterPorts)[0];
                portsInfoExtract = portsInfoExtract.substring(1); // Remove the :
                portsInfo = portsInfo.replace(portsInfoExtract, '"' + portsInfoExtract + '"');
                thisLine = thisLine + portsInfo;
                thisLine = thisLine.replace('#Ports#', '"Ports"');
            } else {
                // Remove the last space and the last comma
                thisLine = thisLine.slice(0, -2);
            }
            thisLine = thisLine.replace('#ID#', '"ID"');
            thisLine = thisLine.replace('#Image#', '"Image"');
            thisLine = thisLine.replace('#Created#', '"Created"');
            thisLine = thisLine.replace('#Status#', '"Status"');
            thisLine = thisLine.replace('#Names#', '"Names"');
            thisLine = thisLine.replace('#Size#', '"Size"');
            // Add brackets to have a JSON format
            thisLine = '{' + thisLine + '}';
            thisLine = JSON.parse(thisLine);
            // To have a prettier display, underscores used for parsing are replaced again by spaces
            thisLine.Created = thisLine.Created.replace(/_/g, ' ');
            thisLine.Status = thisLine.Status.replace(/_/g, ' ');
            thisLine.Size = thisLine.Size.replace(/_/g, ' ');
            dockerInfoObjectArray.push(thisLine);
        }
    }
    return dockerInfoObjectArray;
}

const getDockerFewInformations = async () => {
    const dockerFormat = '"{{.ID}}:{{.Names}}"';
    const rawDockerInfo = await execShellCommand('docker ps -a --format ' + dockerFormat + '');
    let dockerInformations = [];
    // Verifies that there is at least one docker process running
    if (rawDockerInfo) {
        dockerInformations = rawDockerInfo.split('\n');
        // Remove the last element if it is empty
        if (dockerInformations[dockerInformations.length - 1] == '') {
            dockerInformations.pop();
        }
    }
    return dockerInformations;
};

const allTypeActionsDocker = async (action) => {
    let res = '';
    const dockerAllPsArray = await getDockerFewInformations();
    for (let i = 0; i < dockerAllPsArray.length; i++) {
        let oneProcess = dockerAllPsArray[i].split(':');
        res = res + (await execShellCommand(`docker ${action} ${oneProcess[0]}`));
    }
    return res;
};

const postDockerActions = async (req) => {
    let res = '';
    let lines = 500;
    if (req.body.action && req.body.id) {
        switch (req.body.action) {
            case 'Restart':
                if (req.body.id === 'all') {
                    res = await allTypeActionsDocker('restart');
                } else {
                    res = await execShellCommand(`docker restart ${req.body.id}`);
                }
                break;
            case 'Start':
                if (req.body.id === 'all') {
                    res = await allTypeActionsDocker('start');
                } else {
                    res = await execShellCommand(`docker start ${req.body.id}`);
                }
                break;
            case 'Stop':
                if (req.body.id === 'all') {
                    res = await allTypeActionsDocker('stop');
                } else {
                    res = await execShellCommand(`docker stop ${req.body.id}`);
                }
                break;
            case 'Logs':
                if (req.body.id === 'all') {
                    const dockerAllPsArray = await getDockerFewInformations();
                    for (let i = 0; i < dockerAllPsArray.length; i++) {
                        let oneProcess = dockerAllPsArray[i].split(':');
                        res =
                            res +
                            `========== Docker Name : ${oneProcess[1]} (${oneProcess[0]}) ==========\n`;
                        res =
                            res +
                            (await execShellCommand(
                                `docker logs --tail ${lines} ${oneProcess[0]}`,
                            ));
                        res = res + '\n\n';
                    }
                } else {
                    res = await execShellCommand(`docker logs --tail ${lines} ${req.body.id}`);
                }
                return res;
            default:
                console.error('Action not found');
                return 'Action not found';
        }
        if (res) {
            return 'Action "' + req.body.action + '" launched on : ' + req.body.id;
        } else {
            return 'Action NOT launched';
        }
    } else {
        return 'There is no action or no id';
    }
};

module.exports = {
    getDockerHello,
    getDockerVersion,
    getDockerInformations,
    postDockerActions,
};
