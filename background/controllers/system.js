const si = require('systeminformation');

const getStaticSystemInformations = async () => {
    let cpuInfo = await si.cpu();
    let memInfo = await si.mem();
    let osInfo = await si.osInfo();
    let fsSize = await si.fsSize();

    let systemInfos = [
        {
            cpuInfo: cpuInfo,
            memInfo: memInfo,
            osInfo: osInfo,
            fsSize: fsSize,
        },
    ];
    return systemInfos;
};

const getDynamicSystemInformations = async () => {
    let cpuInfo = await si.cpu();
    let memInfo = await si.mem();
    let currentLoad = await si.currentLoad();
    let fsSize = await si.fsSize();
    let dockerInfo = await si.dockerInfo();

    let systemInfos = [
        {
            cpuInfo: cpuInfo,
            memInfo: memInfo,
            currentLoad: currentLoad,
            fsSize: fsSize,
            dockerInfo: dockerInfo,
        },
    ];
    return systemInfos;
};

module.exports = {
    getStaticSystemInformations,
    getDynamicSystemInformations,
};
