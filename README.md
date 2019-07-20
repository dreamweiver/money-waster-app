# Money Waster Meeting Counter

 Nowadays meetings play a central role in most businesses. Some of us do love that, some others hate it. On whatever side you are, it's an undenieable fact, that meetings cost money. Peoples' capacities are bound and they can't spent their times on other tasks.

 **Money Waster Meeting Counter** is an Angular 8 app, which tracks the cost incurred in these meetings.

### Installing & Running Money waster app ?

conventional way ?
--------------------

+ Open terminal and clone the repo from github as below or download the project from github location, https://github.com/dreamweiver/money-waster-app

```
root-dir> git clone https://github.com/dreamweiver/money-waster-app.git
```

+ navigate to root directory of the project and run the below script to install on dependencies of the project

```
money-waster-app> $ npm install
```

+ run the below npm script to build the application.

```
money-waster-app> $ npm start
```

+ after sucessful build. Open your favourite browser and type in the url as below below

```
http://localhost:3900 
```


Using Docker ?
--------------------

+ Open terminal and clone the repo from github as below or download the project from github location, https://github.com/dreamweiver/money-waster-app

```
root-dir> git clone https://github.com/dreamweiver/money-waster-app.git
```

+ navigate to root directory of the project and run the below script to run docker build command

```
money-waster-app> docker build --rm  -f Dockerfile -t money-waster-app:v1 . 
```

+ After successfully completion of the docker build, run the below docker command to run the docker image

```
money-waster-app> docker run --rm  -d -p 80:80 money-waster-app:v1 
```

+ Open your favourite browser and go to this below url

```
http://localhost:80
```


**After launching the app, login using your google email id. application is auto sync with logged-in accounts calendar and show the event details on screen if its active else it would wait for any future events to become active and show its details automatically.**

 
## Authors

**Manoj Kumar Lakshman**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
