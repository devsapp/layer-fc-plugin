const SYSTERMPATH = {
  PATH: ':/usr/local/bin/apache-maven/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/ruby/bin',
  DEFAULT_EXAMPLE: {
    layer: 'custom-default-code',
    code: 'default-web-code',
    customRuntimeConfig: {
      command: ['node'],
      args: ['index.js'],
    },
  },
  LAYERS: {
    nodejs17: {
      layer: 'node-v17.8.0-linux-x64',
      path: '/opt/node-v17.8.0-linux-x64/bin',
      code: 'node-web-code',
      customRuntimeConfig: {
        command: ['npm'],
        args: ['run', 'start'],
      },
    },
    nodejs16: {
      layer: 'node-v16.14.2-linux-x64',
      path: '/opt/node-v16.14.2-linux-x64/bin',
      code: 'node-web-code',
      customRuntimeConfig: {
        command: ['npm'],
        args: ['run', 'start'],
      },
    },
    nodejs14: {
      layer: 'node-v14.19.1-linux-x64',
      path: '/opt/node-v14.19.1-linux-x64/bin',
      code: 'node-web-code',
      customRuntimeConfig: {
        command: ['npm'],
        args: ['run', 'start'],
      },
    },
    nodejs12: {
      layer: 'node-v12.22.11-linux-x64',
      path: '/opt/node-v12.22.11-linux-x64/bin',
      code: 'node-web-code',
      customRuntimeConfig: {
        command: ['npm'],
        args: ['run', 'start'],
      },
    },
    nodejs10: {
      code: 'node-web-code',
      customRuntimeConfig: {
        command: ['npm'],
        args: ['run', 'start'],
      },
    },
    'python3.10': {
      layer: 'python-v3.10-linux-x64',
      path: '/opt/python-v3.10-linux-x64/bin',
      code: 'python37-web-code',
      customRuntimeConfig: {
        command: ['python'],
        args: ['app.py'],
      },
    },
    'python3.9': {
      layer: 'python-v3.9-linux-x64',
      path: '/opt/python-v3.9-linux-x64/bin',
      code: 'python37-web-code',
      customRuntimeConfig: {
        command: ['python'],
        args: ['app.py'],
      },
    },
    'python3.8': {
      layer: 'python-v3.8-linux-x64',
      path: '/opt/python-v3.8-linux-x64/bin',
      code: 'python37-web-code',
      customRuntimeConfig: {
        command: ['python'],
        args: ['app.py'],
      },
    },
    'python3.7': {
      code: 'python37-web-code',
      customRuntimeConfig: {
        command: ['python'],
        args: ['app.py'],
      },
    },
    'python3.6': {
      layer: 'python-v3.6-linux-x64',
      path: '/opt/python-v3.6-linux-x64/bin',
      code: 'python27-web-code',
      customRuntimeConfig: {
        command: ['python'],
        args: ['app.py'],
      },
    },
    'php8.1': {
      layer: 'php-v8.1-linux-x64',
      path: '/opt/php-v8.1-linux-x64/bin',
      code: 'php-web-code',
      customRuntimeConfig: {
        command: ['php'],
        args: ['-S', '0.0.0.0:9000', 'index.php'],
      },
    },
    'php8.0': {
      layer: 'php-v8.0-linux-x64',
      path: '/opt/php-v8.0-linux-x64/bin',
      code: 'php-web-code',
      customRuntimeConfig: {
        command: ['php'],
        args: ['-S', '0.0.0.0:9000', 'index.php'],
      },
    },
    'php7.4': {
      code: 'php-web-code',
      customRuntimeConfig: {
        command: ['php'],
        args: ['-S', '0.0.0.0:9000', 'index.php'],
      },
    },
    'php7.2': {
      layer: 'php-v7.2-linux-x64',
      path: '/opt/php-v7.2-linux-x64/bin',
      code: 'php-web-code',
      customRuntimeConfig: {
        command: ['php'],
        args: ['-S', '0.0.0.0:9000', 'index.php'],
      },
    },
    'php5.6': {
      layer: 'php-v5.6-linux-x64',
      path: '/opt/php-v5.6-linux-x64/bin',
      code: 'php-web-code',
      customRuntimeConfig: {
        command: ['php'],
        args: ['-S', '0.0.0.0:9000', 'index.php'],
      },
    },
    java17: {
      layer: 'java-v17.0.2-linux-x64',
      path: '/opt/java-v17.0.2-linux-x64/bin',
      code: 'java17-web-code',
      customRuntimeConfig: {
        command: ['java'],
        args: ['-Dserver.port=9000', '-jar', 'demo-0.0.1-SNAPSHOT.jar'],
      },
    },
    java11: {
      layer: 'java-v11.0.14-linux-x64',
      path: '/opt/java-v11.0.14-linux-x64/bin',
      code: 'java11-web-code',
      customRuntimeConfig: {
        command: ['java'],
        args: ['-Dserver.port=9000', '-jar', 'demo-0.0.1-SNAPSHOT.jar'],
      },
    },
    java8: {
      code: 'java8-web-code',
      customRuntimeConfig: {
        command: ['java'],
        args: ['-Dserver.port=9000', '-jar', 'demo-0.0.1-SNAPSHOT.jar'],
      },
    },
    go1: {
      code: 'go1-web-code',
      customRuntimeConfig: {
        command: ['./main'],
      },
    },
    lua: {
      code: 'lua-web-code',
      customRuntimeConfig: {
        command: ['/code/nginx'],
        args: ['-p', '/tmp', '-c', '/code/nginx.conf'],
      },
    },
    ruby: {
      code: 'ruby-web-code',
      customRuntimeConfig: {
        command: ['ruby'],
        args: ['server.rb'],
      },
    },
    typescript: {
      layer: 'node-v16.14.2-linux-x64',
      path: '/opt/node-v16.14.2-linux-x64/bin',
      code: 'ts-web-code',
      customRuntimeConfig: {
        command: ['npm'],
        args: ['run', 'start'],
      },
    },
    rust: {
      code: 'rust-web-code',
      customRuntimeConfig: {
        command: ['./server'],
      },
    },
    dart: {
      code: 'dart-web-code',
      customRuntimeConfig: {
        command: ['./server'],
      },
    },
  },
  NODEJS: ['nodejs17', 'nodejs16', 'nodejs14', 'nodejs12', 'nodejs10'],
  PYTHON: ['python3.10', 'python3.9', 'python3.8', 'python3.7', 'python3.6'],
  JAVA: ['java17', 'java11', 'java8'],
  PHP: ['php8.1', 'php8.0', 'php7.4', 'php7.2', 'php5.6'],
  GO: ['go1'],
  OTHERS: ['typescript', 'rust', 'ruby', 'dart', 'lua'],
};
module.exports = { SYSTERMPATH };
