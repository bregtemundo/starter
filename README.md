# Starter theme

A starter theme for Drupal, but not depending on it, could be used as standalone


# Get started

### docker
First make sure [docker compose] is installed correctly

- download the docker4drupal container from [docker4drupal] 
- customize the docker settings in the .env file (url, database connection, services to use,.. are set here)
- **windows** : to allow file uploads from drupal, make sure to execute php as root, change the docker-compose.yml according to [docker4drupal root]
- start docker for first time or when changes to config are made (within project folder)
    ```sh
    $ docker-compose up
    ```
- to start an existing docker you can use
    ```sh
    $ docker-compose start
    ```
- you can then access your url (e.g. http://drupal2.docker.localhost:8000) 
- to execute php inside the container (e.g. drupal cr, composer) (**doesn't work from within WSL, does work from within powershell**)
    ```sh
    $ docker-compose exec php drupal cr
    ```

### install drupal
Use [drupal project] as starter setup:

- create a new project with composer in a temporary web2 folder, files will need to go into the root of your project folder, but if you install into ./ you will get a "folder not empty" error:
    ```sh
    $ docker-compose exec php composer create-project drupal-composer/drupal-project:8.x-dev    web2 --stability dev --no-interaction
    ```
- copy files from web2 to the root of your project
    ```sh
    $ cp -a web2/. ./
    $ rm web2 -Rf
    ```
- install drupal modules
    ```sh
    $ docker-compose exec php composer require drupal/browsersync
    ```
  - install drupal from your url (database settings are in the .env file)

### drupal development settings
turn off caching and turn on theming help for local development:
- uncomment loading local settings file in web/default/settings.php
    ```sh
    # if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
    #   include $app_root . '/' . $site_path . '/settings.local.php';
    # }
    ```
- add local settings.local.php and development.services.yml files
    - https://gist.github.com/Greg-Boggs/ff70345b7f3590228fc09be1f38d0688
    - https://gist.githubusercontent.com/jszwedko/ac203de56bd9ee5c5fa5d841b971915e/raw/bbbd9c60c91c6dc0076283fff77127af0255c03b/development.services.yml

### install theme
- download the [starter] theme to web/themes/custom folder
- rename folder to the <theme name>
- rename starter.libraries.yml to <theme name>.libraries.yml
- rename starter.info.yml to <themen name>.info.yml
- replace all accurancies of starter with <theme name>
- install npm dependencies
    ```sh
    $ npm install
    or
    $ yarn install
    ```


## Documentation

### Gulp
- gulp start
    uses browsersync to automatically update the browser on sass,js changes
    this requires the drupal/browsersync module (enabled for the theme)
    You also need to change the server url in gulp-config.json
- gulp build
    compiles and minifies the source files
- gulp test
    runs (parker) statistics on css 

### Sass
#### Documentation
There is a guide build from comments in the source files in [KSS] syntax.
It is available at: *http://<url>/themes/custom/<theman name>/docs/index.html*
You can regenerate the documentation (e.g. when sass variables are changed) with a gulp command
```sh
$ cd web/themes/custom/<theme name>
$ gulp docs
```
#### Folder structure
the theme follows the [itcss] file structure. 

Most work will be done in the component folder, the classes here don't NEED to be prefixed (objects and utils should though), When not prefixed we'll assume it's a component.

Try to keep each component in its own file (filename should align with component name).

Whenever possible use the [BEM] naming convention for classnames. object (o-) and utilities (u-) should be prefixed.

#### Configuration
Colors, breakpoints, Grid settings, fonts and (responsive) font-sizes are set in settings folder.

#### Vendor
Extra Vendor assets are preferably installed with npm (yarn) and then added with @import.
You can add the vendor folder name to gulp-config.json css > paths . This way you can simply use @import with the filename without the complete folder name.

### Js

main file is app.js, here all "modules" are created, fonts are loaded, navigation is initialized, Barba is initialized.
All modules are instanciated here and they react on the initModules event to execute when needed.

#### Vendor
Extra Vendor assets are preferably installed with npm (yarn) and then added with import or require.
You can add the vendor folder name to gulp-config.json js > paths.


## TODOS

gulp
- add a lint for testing code standards (scss, js, html?)
- visual diffing would be nice : https://meowni.ca/posts/2017-puppeteer-tests/

js 
- popup/overlay (e.g. https://sachinchoolur.github.io/lightgallery.js/)
- embedding (iframe scale, fitvid.js)



[docker compose]: <https://docs.docker.com/compose/install/>
[docker4drupal]: <https://github.com/wodby/docker4drupal>
[docker4drupal root]: <https://wodby.com/stacks/drupal/docs/local/permissions/>
[drupal project]: <https://github.com/drupal-composer/drupal-project>
[starter]: <https://github.com/bregtemundo/starter>
[KSS]: <http://warpspire.com/kss/>
[itcss]: <https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/>
[BEM]: <http://getbem.com/introduction/>
