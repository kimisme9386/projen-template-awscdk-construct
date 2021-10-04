const {
  AwsCdkConstructLibrary,
  Gitpod,
  DevEnvironmentDockerImage,
} = require('projen');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  author: 'user',
  authorUrl: 'https://9incloud.com/',
  cdkVersion: '1.125.0',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: '',
  describe: '',
  repositoryUrl: '',
  cdkDependencies: ['@aws-cdk/aws-s3'],
  devDeps: ['projen-automate-it'],
  publishToPypi: {
    distName: '',
    module: '',
  },
  catalog: {
    announce: true,
  },
  stability: 'experimental',
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['kimisme9386-bot'],
  },
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve'],
      secret: AUTOMATION_TOKEN,
    },
    ignoreProjen: false,
  },
});

project.eslint.addRules({
  'comma-dangle': [
    'error',
    {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    },
  ],
});

const common_exclude = [
  'cdk.out',
  'cdk.context.json',
  'images',
  'yarn-error.log',
  'dependabot.yml',
];

project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

// gitpod
const gitpodPrebuild = project.addTask('gitpod:prebuild', {
  description: 'Prebuild setup for Gitpod',
});
gitpodPrebuild.exec('npm -g i aws-cdk');
gitpodPrebuild.exec('yarn install --frozen-lockfile --check-files');

let gitpod = new Gitpod(project, {
  dockerImage: DevEnvironmentDockerImage.fromFile('.gitpod.Dockerfile'),
  prebuilds: {
    addCheck: true,
    addBadge: true,
    addLabel: true,
    branches: true,
    pullRequests: true,
    pullRequestsFromForks: true,
  },
});

gitpod.addCustomTask({
  name: 'install package and check zsh and zsh plugin',
  init: `yarn gitpod:prebuild
sudo chmod +x ./.gitpod/oh-my-zsh.sh && ./.gitpod/oh-my-zsh.sh`,
});

gitpod.addCustomTask({
  name: 'change default shell to zsh and start zsh shell',
  command: 'sudo chsh -s $(which zsh) && zsh',
});

/* spellchecker: disable */
gitpod.addVscodeExtensions(
  'dbaeumer.vscode-eslint'
);

project.synth();
