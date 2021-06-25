const execShellCommand = require('../../utils/utils').execShellCommand;

const getPm2Hello = async () => {
    const isPm2There = await execShellCommand('pm2');
    if (isPm2There.includes('pm2 [options] <command>')) {
        return 'PM2 says hello';
    } else {
        return 'PM2 not there';
    }
};

const getPm2Version = async () => {
    const pm2Version = await execShellCommand('pm2 -v');
    return pm2Version;
};

const getJlistData = async () => {
    let pm2jlist = await execShellCommand('pm2 jlist');
    pm2jlist = pm2jlist.match(/\[.*\]/);
    return pm2jlist[0];
};

const postActionsPm2 = async (req) => {
    let res = '';
    let lines = 500;
    if (req.body.action && req.body.name) {
        switch (req.body.action) {
            case 'Restart':
                res = await execShellCommand(`pm2 restart ${req.body.name}`);
                break;
            case 'Start':
                res = await execShellCommand(`pm2 start ${req.body.name}`);
                break;
            case 'Stop':
                res = await execShellCommand(`pm2 stop ${req.body.name}`);
                break;
            case 'Logs':
                res = await execShellCommand(
                    `pm2 logs --nostream --lines ${lines} ${req.body.name}`,
                );
                return res;
            default:
                console.error('Action not found');
                return 'Action not found';
        }
        if (res) {
            return 'Action "' + req.body.action + '" launched on : ' + req.body.name;
        } else {
            return 'Action NOT launched';
        }
    } else {
        return 'There is no action or no name';
    }
};

module.exports = {
    getPm2Hello,
    getPm2Version,
    getJlistData,
    postActionsPm2,
};
