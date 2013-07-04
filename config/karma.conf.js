basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/lib/angular/angular.js',
  'app/lib/angular/angular-*.js',
  'test/lib/angular/angular-mocks.js',
  'app/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['PhantomJS'];
hostname = process.env.IP;
port = process.env.PORT;
runnerPort = 0;

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
