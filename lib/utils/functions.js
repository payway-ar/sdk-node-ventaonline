const generateXsourceHeader = (grouper, developer) => {
    let XsourceObj = {
        service: "SDK-NODE",
        grouper: grouper,
        developer: developer
    };
    let buff = Buffer(JSON.stringify(XsourceObj))
    return  buff.toString('base64');
}

module.exports = {
    generateXsourceHeader
}