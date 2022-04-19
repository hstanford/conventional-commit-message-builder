#!/usr/bin/env node

const inquirer = require('inquirer');

const questions = [
  {
    type: 'checkbox',
    name: 'format',
    message: 'Choose optional parts of the commit format\n',
    choices: [
      {
        name: 'Scope: contextual info',
        value: 'scope',
        checked: true
      },
      {
        name: 'Body: the motivation for the change and contrast with previous behaviour',
        value: 'body',
        checked: false
      },
      {
        name: 'Footer: the place for info about breaking changes and issue references',
        value: 'footer',
        checked: false
      }
    ]
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
      }
    ]
  },
  {
    type: 'input',
    name: 'scope',
    when: (answers) => answers.format.includes('scope'),
    message: 'Scope: contextual info (optional)\n'
  },
  {
    type: 'input',
    name: 'subject',
    message: 'Subject: a succint summary of the change\n',
    validate: (input) => !!input || 'Subject is mandatory'
  },
  {
    type: 'editor',
    name: 'body',
    when: (answers) => answers.format.includes('body'),
    message: 'Body: the motivation for the change and contrast with previous behaviour\n'
  },
  {
    type: 'input',
    name: 'footer',
    when: (answers) => answers.format.includes('footer'),
    message: 'Footer: the place for info about breaking changes and issue references\n'
  }
];

inquirer.prompt(questions).then((answers) => {
  let message = '';
  message += answers.type;
  if (answers.scope)
    message += '(' + answers.scope + ')';
  message += ': ';
  message += answers.subject;
  if (answers.body)
    message += '\n\n' + answers.body;
  if (answers.footer)
    message += '\n\n' + answers.footer;
  console.log(message);
});