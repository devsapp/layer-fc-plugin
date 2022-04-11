const Table = require('tty-table');

const tableShow = (data) => {
  const options = {
    borderStyle: 'solid',
    borderColor: 'blue',
    headerAlign: 'center',
    align: 'left',
    color: 'cyan',
    width: '100%',
  };

  const showKey = [
    'layerName',
    'description',
    'version',
    'compatibleRuntime',
    'arn',
  ];
  const header = showKey.map((value) => ({
    value,
    headerColor: 'cyan',
    color: 'cyan',
    align: 'left',
    width: 'auto',
    formatter: (v) => v,
  }));

  console.log(Table(header, data, options).render());
};

module.exports = {
  tableShow,
};
