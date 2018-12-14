const Data = require('./Data');
const ModelUrl = require('./ModelUrl');
const TableHeader = require('./TableHeader');
const Link = require('./Link');

console.log(Data);

exports.ModelManager = {
    data: Data,
    modelUrl: ModelUrl,
    tableHeader: TableHeader,
    link: Link
};

exports.Table = {
    'data': ['data', 'link'],
    'modelUrl': ['modelUrl'],
    'tableHeader': ['tableHeader']
};