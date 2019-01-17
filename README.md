# About

It is a theme used to render a [jsonresume][jsonresume] as markdown.

It is based on the skeleton code provided by [jsonresume-theme-boilerplate][git-jsonresume-theme-boilerplate].

# How to use it

For the moment [resume-cli][git-resume-cli] has support for html and pdf output only. 
Until [my pull request][git-resume-cli-pull-request] will be merged and a new [npm package][npm-resume-cli] will be released, 
you have to use it like

```
resume export resume.html -r resume.json -t md
```

and then rename *resume.html* to *resume.md*. 

[jsonresume]: https://jsonresume.org/
[git-jsonresume-theme-boilerplate]: https://github.com/jsonresume/jsonresume-theme-boilerplate
[git-resume-cli]: https://github.com/jsonresume/resume-cli
[git-resume-cli-pull-request]: https://github.com/jsonresume/resume-cli/pull/300
[npm-resume-cli]: https://www.npmjs.com/package/resume-cli