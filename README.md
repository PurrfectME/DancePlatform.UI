# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


Как стартовать:

FRONT:
1. yarn install
2. yarn start

Если запросы не проходят, то открыть файл constants/auth.js и сменить урл на урл сервера


BACK:
1. должен быть sql server и Microsoft SQL Management Studio
2. appsettings.json - ConnectionString Server= подставляем наш сервер БД
3. открываем в Visual Studio консоль менеджера пакетов Nuget
4. DancePlatform.API делаем стартовым проектом (ПКМ по библиотеке -> назначить стартовым проектом)
5. В консоли менеджера пакетов ставим проект по умолчанию DancePlatform.DA
6. И пишем Update-Database (после этого накатятся миграции и появится инстанс БД в SQL Management Studio)
7. Запускаем проект 
8. В БД в таблице юзерс появится запись модератора(админа). moderator@gmail.com (password: moderator)