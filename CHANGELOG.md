# Changelog

## v1.1.0

**[`v1.0.0...v1.1.0`](https://github.com/ceoss/will-mutate/compare/v1.0.0...v1.1.0)** - **2020-07-27**


### ✨ Feature


- Support arrow function concise body syntax [`7f13905`](https://github.com/ceoss/will-mutate/commit/7f13905)

### Other


- Merge pull request #18 from ceoss/concise-arrows [`0a54ed7`](https://github.com/ceoss/will-mutate/commit/0a54ed7), closes [#18](https://github.com/ceoss/will-mutate/issues/18)

## v1.0.0

**2020-07-19**


### ✨ Feature


- Proxify meta traps, mutation property tracing, new traps [`9fce41e`](https://github.com/ceoss/will-mutate/commit/9fce41e)

### ⚡ Improvement


- Adding setter and getter apply traps, fixing bugs, more tests [`cff66e0`](https://github.com/ceoss/will-mutate/commit/cff66e0)
- Better property paths for errors, using dummyTarget for read-only support [`594395f`](https://github.com/ceoss/will-mutate/commit/594395f)

### 📄 Documentation


- Add caveats and alternatives [`4c3ee6f`](https://github.com/ceoss/will-mutate/commit/4c3ee6f)
- Add usage documentation to README [`470bb1d`](https://github.com/ceoss/will-mutate/commit/470bb1d)

### 🐛 Fix


- Add linting, GitHub Actions, package meta [`1b51f3c`](https://github.com/ceoss/will-mutate/commit/1b51f3c)
- Fix descriptor recursive issue, better mutation tracing errors, many more tests [`f6ffa55`](https://github.com/ceoss/will-mutate/commit/f6ffa55)

### 📦 Package


- npm audit fix, npm update [`c18a7d6`](https://github.com/ceoss/will-mutate/commit/c18a7d6)
- npm update, fix lints [`c3b0712`](https://github.com/ceoss/will-mutate/commit/c3b0712)
- npm update, update lint [`7d6b6ad`](https://github.com/ceoss/will-mutate/commit/7d6b6ad)

### 🔧 Configuration


- Don't build in CI [`2e831c9`](https://github.com/ceoss/will-mutate/commit/2e831c9)

### Other


- Fix global variable name in tests [`6c469ee`](https://github.com/ceoss/will-mutate/commit/6c469ee)
- Merge pull request #16 from ceoss/eve-semrelease [`267e612`](https://github.com/ceoss/will-mutate/commit/267e612), closes [#16](https://github.com/ceoss/will-mutate/issues/16)
- Initial work to get Babel Plugin working [`35e943b`](https://github.com/ceoss/will-mutate/commit/35e943b)
- Added initial detection of JS body, also initial work on proxy code [`8b3dbc2`](https://github.com/ceoss/will-mutate/commit/8b3dbc2)
- Got initial Program detection working [`a0ff8aa`](https://github.com/ceoss/will-mutate/commit/a0ff8aa)
- Got Proxy.js injection working [`8a507e7`](https://github.com/ceoss/will-mutate/commit/8a507e7)
- Merge pull request #13 from ceoss/noop-plugin [`a9423a2`](https://github.com/ceoss/will-mutate/commit/a9423a2), closes [#13](https://github.com/ceoss/will-mutate/issues/13)
- Ninja away variable names [`d7cedfc`](https://github.com/ceoss/will-mutate/commit/d7cedfc)
- Detect variables to mutate [`bcd7263`](https://github.com/ceoss/will-mutate/commit/bcd7263)
- Merge pull request #12 from ceoss/eve-docs [`78f5b6e`](https://github.com/ceoss/will-mutate/commit/78f5b6e), closes [#12](https://github.com/ceoss/will-mutate/issues/12)
- Merge pull request #11 from ceoss/eve-meta [`fdf050f`](https://github.com/ceoss/will-mutate/commit/fdf050f), closes [#11](https://github.com/ceoss/will-mutate/issues/11)
- Merge pull request #10 from ceoss/eve-meta [`496e4a7`](https://github.com/ceoss/will-mutate/commit/496e4a7), closes [#10](https://github.com/ceoss/will-mutate/issues/10)
- Merge pull request #9 from ceoss/upgrade-lint [`957e685`](https://github.com/ceoss/will-mutate/commit/957e685), closes [#9](https://github.com/ceoss/will-mutate/issues/9)
- Added initial Jest config [`5b4397c`](https://github.com/ceoss/will-mutate/commit/5b4397c)
- Merge pull request #8 from evelynhathaway/proxy-apply-traps-tests [`333a252`](https://github.com/ceoss/will-mutate/commit/333a252), closes [#8](https://github.com/ceoss/will-mutate/issues/8)
- Merge pull request #7 from evelynhathaway/babel-plugin [`93e6576`](https://github.com/ceoss/will-mutate/commit/93e6576), closes [#7](https://github.com/ceoss/will-mutate/issues/7)
- Merge pull request #6 from evelynhathaway/no-flatmap [`47840b2`](https://github.com/ceoss/will-mutate/commit/47840b2), closes [#6](https://github.com/ceoss/will-mutate/issues/6)
- "Can I use goofy commit names?" "Only if you squash 'em" [`1e72c1f`](https://github.com/ceoss/will-mutate/commit/1e72c1f)
- Fix CI [`e4cf24b`](https://github.com/ceoss/will-mutate/commit/e4cf24b)
- Remove flatmap [`05f84a3`](https://github.com/ceoss/will-mutate/commit/05f84a3)
- Merge pull request #5 from evelynhathaway/babel-meta [`b02d265`](https://github.com/ceoss/will-mutate/commit/b02d265), closes [#5](https://github.com/ceoss/will-mutate/issues/5)
- Merge pull request #15 from ceoss/eve-dev [`659efbf`](https://github.com/ceoss/will-mutate/commit/659efbf), closes [#15](https://github.com/ceoss/will-mutate/issues/15)
- Remove the module.exports from the proxy code [`dac339c`](https://github.com/ceoss/will-mutate/commit/dac339c)
- Added email to Corbin [`7f86ee6`](https://github.com/ceoss/will-mutate/commit/7f86ee6)
- Merge pull request #4 from evelynhathaway/babel-proxy-objs [`aec9b2f`](https://github.com/ceoss/will-mutate/commit/aec9b2f), closes [#4](https://github.com/ceoss/will-mutate/issues/4)
- Merge branch 'babel-plugin' into babel-proxy-objs [`86decb9`](https://github.com/ceoss/will-mutate/commit/86decb9)
- Merge pull request #3 from evelynhathaway/babel-jest [`c64dff4`](https://github.com/ceoss/will-mutate/commit/c64dff4), closes [#3](https://github.com/ceoss/will-mutate/issues/3)
- Added further examples to plugin test [`4b4f73e`](https://github.com/ceoss/will-mutate/commit/4b4f73e)
- Initial work on mutating the proxied functions [`d2757c9`](https://github.com/ceoss/will-mutate/commit/d2757c9)
- Added plugin testing [`c9b81c6`](https://github.com/ceoss/will-mutate/commit/c9b81c6)
- Merge pull request #2 from evelynhathaway/eve-proxify [`653494c`](https://github.com/ceoss/will-mutate/commit/653494c), closes [#2](https://github.com/ceoss/will-mutate/issues/2)
- Merge pull request #1 from evelynhathaway/eve-meta [`08345b1`](https://github.com/ceoss/will-mutate/commit/08345b1), closes [#1](https://github.com/ceoss/will-mutate/issues/1)
- fix PR suggestions [`3e6a83f`](https://github.com/ceoss/will-mutate/commit/3e6a83f)
- Initial noop commit [`007ebdc`](https://github.com/ceoss/will-mutate/commit/007ebdc)
- Add icon and readme package update [`b621263`](https://github.com/ceoss/will-mutate/commit/b621263)
- Add semantic release, lint-staged [`15d1d10`](https://github.com/ceoss/will-mutate/commit/15d1d10)
- added initial noop plugin [`7498dbe`](https://github.com/ceoss/will-mutate/commit/7498dbe)
- Move commitlint config extends from command to package.json [`da6ae2c`](https://github.com/ceoss/will-mutate/commit/da6ae2c)
- Release in CI, remove babel config [`9dd7524`](https://github.com/ceoss/will-mutate/commit/9dd7524)
- Remove extraneous foo.js [`c8dd104`](https://github.com/ceoss/will-mutate/commit/c8dd104)
- Remove unused void0 function [`1c1d444`](https://github.com/ceoss/will-mutate/commit/1c1d444)
- Setup ESLint, package.json, license [`5320a72`](https://github.com/ceoss/will-mutate/commit/5320a72)
- Use Node 10.x in CI [`978b26d`](https://github.com/ceoss/will-mutate/commit/978b26d)
