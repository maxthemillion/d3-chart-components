'use strict';

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _memoryFs = require('memory-fs');

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _webpack3 = require('./webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var compiledFileTypes = ['js', 'jsx', 'ts', 'tsx'];

function compile(files, distRootPath, context) {
  var mainFile = files.find(function (file) {
    return file.relative === context.componentObject.mainFile;
  });
  var testFiles = files.filter(function (x) {
    return x.test;
  });
  var toCompile = _toCompile(mainFile);
  if (toCompile) {
    return runWebpack(mainFile, distRootPath, testFiles);
  }
  var distsFiles = files.map(function (file) {
    return _getDistFile(file, distRootPath);
  });

  return distsFiles;
}

function _getDistFile(file, distPath, content) {
  var distFile = file.clone();
  distFile.base = distPath;
  distFile.path = _path2.default.join(distPath, file.relative);

  if (content) {
    distFile.contents = content;
  }

  return distFile;
}

function _toCompile(file) {
  return compiledFileTypes.indexOf(file.extname.replace('.', '')) > -1;
}

function runWebpack(mainFile, distRootPath, testFiles) {
  var conf = getConfig(mainFile, distRootPath, testFiles);
  var compiler = (0, _webpack2.default)(conf);

  var fs = new _memoryFs2.default();
  compiler.outputFileSystem = fs;

  var compilationPromise = new Promise(function (resolve, reject) {
    return compiler.run(function (err, stats) {
      if (err || 0 < stats.compilation.errors.length) {
        console.log(err || stats.compilation.errors);
        reject(err || stats.compilation.errors);
        return;
      }

      resolve(stats.compilation.assets);
    });
  });

  return compilationPromise.then(function (assets) {
    return extractFiles(fs, mainFile, distRootPath, testFiles, assets);
  });
}

function extractFiles(fileSystem, mainFile, distRootPath, testFiles, assets) {
  var distPathFiles = fileSystem.readdirSync(distRootPath);

  return Object.keys(assets).map(function (assetName) {
    var asset = assets[assetName];
    var distFullPath = asset.existsAt;
    return new _vinyl2.default({
      contents: fileSystem.readFileSync(asset.existsAt),
      base: distRootPath,
      path: distFullPath,
      basename: assetName,
      test: testFiles.find(function (x) {
        return x.basename === assetName;
      }) ? true : false
    });
  });
}

function getConfig(mainFile, distRootPath, testFiles) {
  var conf = (0, _webpack4.default)();
  conf.context = __dirname;
  conf.output.path = _path2.default.join(distRootPath, _path2.default.dirname(mainFile.relative));
  conf.entry = _defineProperty({}, mainFile.stem, mainFile.path);
  testFiles.forEach(function (x) {
    return conf.entry[x.stem] = [x.path];
  });
  conf.library;

  return conf;
};

module.exports = {
  compile: compile
};

//# sourceMappingURL=index.js.map