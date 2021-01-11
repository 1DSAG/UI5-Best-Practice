# DSAG UI5 best practice guide

this is not the guide itself (it's over at <https://1dsag.github.io/UI5-Best-Practice/>), but the corresponding repository with instructions on how to contribute to the guide.

Because **the DSAG UI5 best practice guide is a living document** 👨‍💻 - thriving on and with its' community 🥳

## setup local github pages site

- make sure, `ruby` 2.7 is installed on your system
- clone the repo
- switch to the document base
  `$> cd docs`
- `$> bundle install`  
  for installing the `github-pages` jekyll incarnation
- start the local gh-pages instance

  ```shell
  bundle exec jekyll serve
  Configuration file: /Users/you/UI5-Best-Practice/docs/_config.yml
              Source: /Users/you/UI5-Best-Practice/docs
         Destination: /Users/you/UI5-Best-Practice/docs/_site
   Incremental build: disabled. Enable with --incremental
        Generating...
         Jekyll Feed: Generating feed for posts
                      done in 0.233 seconds.
   Auto-regeneration: enabled for '/Users/you/UI5-Best-Practice/docs'
      Server address: http://127.0.0.1:4000/
    Server running... press ctrl-c to stop.
  ```

- point your web browser to <http://localhost:4000>

## linting of markdown content

any markdown content (in /docs) is linted via [`markdownlint`](https://github.com/DavidAnson/markdownlint) both for quality assurance and convenience.
For quality assurance,
For convenience, because small mistakes are automatically fixed via the `markdownlint` cli.

## git commit messages

commit messages are linted in order to allow for automatic later processing into `CHANGELOG` et al documents.  
The linting occurs against the standards defined in the ["conventional commit" guidelines](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional), based on the Angular project ones.
