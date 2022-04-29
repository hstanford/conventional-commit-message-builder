#!/usr/bin/env node

const { exec } = require('child_process');
const { program } = require('commander');
const inquirer = require('inquirer');
const package = require('./package.json');

function quote(s) {
  if (s === '') return `''`;
  if (!/[^%+,-.\/:=@_0-9A-Za-z]/.test(s)) return s;
  return `'` + s.replace(/'/g, `'"'`) + `'`;
}

function constructMessage(opts) {
  const questions = [
    {
      type: 'checkbox',
      name: 'format',
      when: () => !opts.scope && !opts.body && !opts.footer,
      message: 'Choose optional parts of the commit format\n',
      choices: [
        {
          name: 'Scope: contextual info',
          value: 'scope',
          checked: true,
        },
        {
          name: 'Body: the motivation for the change and contrast with previous behaviour',
          value: 'body',
          checked: false,
        },
        {
          name: 'Footer: the place for info about breaking changes and issue references',
          value: 'footer',
          checked: false,
        },
      ],
    },
    {
      type: 'list',
      name: 'type',
      message: 'What type of commit is this?\n',
      choices: [
        {
          name: 'feat: adds a new feature',
          value: 'feat',
        },
        {
          name: 'fix: fixes a bug',
          value: 'fix',
        },
        {
          name: 'refactor: rewrite/restructure of code, no behaviour change',
          value: 'refactor',
        },
        {
          name: 'perf: refactors that affect performance',
          value: 'perf',
        },
        {
          name: 'style: do no affect the meaning (white-space, formatting, missing semi-colons, etc)',
          value: 'style',
        },
        {
          name: 'test: add missing tests or correct existing tests',
          value: 'test',
        },
        {
          name: 'docs: affect documentation only',
          value: 'docs',
        },
        {
          name: 'build: affect build components like build tool, ci pipeline, dependencies, versioning etc',
          value: 'build',
        },
        {
          name: 'ops: affect infra, deployment, backup, recovery',
          value: 'ops',
        },
        {
          name: 'chore: anything else',
          value: 'chore',
        },
      ],
    },
    {
      type: 'input',
      name: 'scope',
      when: (answers) => answers.format?.includes?.('scope') || opts.scope,
      message: 'Scope: contextual info (optional)\n',
    },
    {
      type: 'input',
      name: 'subject',
      message: 'Subject: a succinct summary of the change\n',
      validate: (input) => !!input || 'Subject is mandatory',
    },
    {
      type: 'editor',
      name: 'body',
      when: (answers) => answers.format?.includes?.('body') || opts.body,
      message:
        'Body: the motivation for the change and contrast with previous behaviour\n',
    },
    {
      type: 'input',
      name: 'footer',
      when: (answers) => answers.format?.includes?.('footer') || opts.footer,
      message:
        'Footer: the place for info about breaking changes and issue references\n',
    },
  ];

  return inquirer.prompt(questions).then((answers) => {
    let message = '';
    message += answers.type;
    if (answers.scope) message += '(' + answers.scope + ')';
    message += ': ';
    message += answers.subject;
    if (answers.body) message += '\n\n' + answers.body;
    if (answers.footer) message += '\n\n' + answers.footer;

    return message;
  });
}

program
  .version(package.version)
  .option('-s, --scope', 'include scope')
  .option('-b, --body', 'include body')
  .option('-f, --footer', 'include footer');

program
  .command('commit')
  .alias('c')
  .description('commit staged changes using the build message')
  .action(() => {
    constructMessage(program.opts()).then((message) => {
      exec(`git commit -m ${quote(message)}`);
    });
  });

program
  .command('print', { isDefault: true })
  .alias('p')
  .description('commit staged changes using the build message')
  .action(() => {
    constructMessage(program.opts()).then((message) => {
      console.log(message);
    });
  });

program.addHelpText(
  'after',
  `

Remember to use the present imperative for the subject:
✓ make function print args
✗ makes function print args
✗ made function print args
`
);

program.parse(process.argv);
