
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , admin = require('./routes/admin')
  , http = require('http')
  , path = require('path')
  , model = require('./classes/model')
  , mail = require('./classes/mail_sender')
  , token = require('./classes/token')
  , authentication = require('./classes/authentication');
var fs = require('fs');
var app = express();
// all environments

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { pretty: false });
app.use(express.favicon(path.join(__dirname + '/public/images/favicon.png')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.all('/api_1.0/*', authentication.verifyHeader);
app.get('/', function(req,res){res.render("login",{title:"- Login"});});


app.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next(); 
});

//Login
app.post('/Login', model.adminLogin);

//Token Addition
app.get('/Dashboard/:admin_id',token.dashboardToken);
app.get('/AppDashboard/:app_id/:admin_id/:app_name',token.appDashboardToken);
app.get('/ItemDashboard/:menuItem_id/:app_id/:admin_id',token.itemDashboardToken);
app.get('/LocationDashboard/:menuItem_id/:app_id/:admin_id',token.locationDashboardToken);

app.get('/CategoryDashboard/:app_id/:admin_id',token.categoryDashboardToken);
app.get('/CategoryFatherDashboard/:app_id/:admin_id',token.categoryFatherDashboardToken);
app.get('/CategorySonDashboard/:app_id/:admin_id/:categoryfather_id',token.categorySonDashboardToken);

app.get('/SendPushBroadcast/:app_id/:admin_id',token.pushDashboardToken);
app.get('/GetAllInfoWithAppID/:app_id', token.getAllInfoWithAppIDToken);
app.get('/AppUpdater/:admin_id/:app_id', token.appUpdaterViewToken);

//Token Addition Protected
app.get('/api_1.0/GetAllInfoWithAppID/:app_id', token.getAllInfoWithAppIDTokenProtected);


//Dashboards
app.get('/Dashboard/:admin_id/:token', model.dashboard);
app.get('/AppDashboard/:app_id/:admin_id/:app_name/:token', model.appDashboard);
app.get('/ItemDashboard/:menuItem_id/:app_id/:admin_id/:token', model.atomDashboard);
app.get('/LocationDashboard/:menuItem_id/:app_id/:admin_id/:token', model.locationDashboard);

app.get('/CategoryDashboard/:app_id/:admin_id/:token', model.categoryDashboard);
app.get('/CategoryFatherDashboard/:app_id/:admin_id/:token', model.categoryFatherDashboard);
app.get('/CategorySonDashboard/:app_id/:admin_id/:categoryfather_id/:token', model.categorySonDashboard);

app.get('/SendPushBroadcast/:app_id/:admin_id/:token', model.pushDashboard);

//Create & Update views
app.get('/AppCreator/:admin_id', model.appCreatorView);
app.get('/AppUpdater/:admin_id/:app_id/:token', model.appUpdaterView);
app.get('/AdminCreator/:admin_id', model.adminCreatorView);
app.get('/AdminAssigner/:app_id/:super_admin_id', model.adminAssignerView);
app.get('/AdminUpdater/:admin_id/:super_admin_id', model.adminUpdaterView);
app.get('/MenuItemCreator/:app_id/:admin_id', model.menuItemCreatorView);
app.get('/MenuItemUpdater/:app_id/:admin_id/:menuItem_id', model.menuItemUpdaterView);
app.get('/ItemCreator/:app_id/:admin_id/:menuItem_id', model.atomCreatorView);
app.get('/ItemUpdater/:app_id/:admin_id/:menuItem_id/:atom_id', model.atomUpdaterView);
app.get('/LocationCreator/:app_id/:admin_id/:menuItem_id', model.locationCreatorView);
app.get('/LocationUpdater/:app_id/:admin_id/:menuItem_id/:location_id', model.locationUpdaterView);

app.get('/CategoryCreator/:app_id/:admin_id', model.categoryCreatorView);
app.get('/CategoryUpdater/:app_id/:admin_id/:category_id', model.categoryUpdaterView);
app.get('/CategoryFatherCreator/:app_id/:admin_id', model.categoryFatherCreatorView);
app.get('/CategoryFatherUpdater/:app_id/:admin_id/:category_id', model.categoryFatherUpdaterView);
app.get('/CategorySonCreator/:app_id/:admin_id/:categoryfather_id', model.categorySonCreatorView);
app.get('/CategorySonUpdater/:app_id/:admin_id/:category_id/:categoryfather_id', model.categorySonUpdaterView);

//Create APIs
app.post('/CreateAdmin', model.createAdmin);
app.post('/CreateApp', model.createApp);
app.post('/CreateMenuItem', model.createMenuItem);
app.post('/CreateItem', model.createAtom);
app.post('/CreateLocation', model.createLocation);

app.post('/CreateCategory', model.createCategory);
app.post('/CreateCategoryFather', model.createCategoryFather);
app.post('/CreateCategorySon', model.createCategorySon);

app.post('/SendPush', model.sendPush);

//Update APIs
app.post('/UpdateApp', model.updateApp);
app.post('/UpdateAdmin', model.updateAdmin);
app.post('/UpdateItem', model.updateAtom);
app.post('/UpdateMenuItem', model.updateMenuItem);
app.post('/UpdateLocation', model.updateLocation);

app.post('/UpdateCategory', model.updateCategory);
app.post('/UpdateCategoryFather', model.updateCategoryFather);
app.post('/UpdateCategorySon', model.updateCategorySon);

//Asign APIs
app.post('/AssignAdmin', model.assignAdmin);

//Delete APIs
app.get('/DeleteApp/:app_id/:admin_id', model.deleteApp);
app.get('/DeleteAdmin/:admin_id/:super_admin_id', model.deleteAdmin);
app.get('/DeleteMenuItem/:app_id/:admin_id/:menuItem_id/:app_name', model.deleteMenuItem);
app.get('/DeleteLocation/:app_id/:admin_id/:location_id/:menuItem_id', model.deleteLocation);
app.get('/DeleteItem/:app_id/:admin_id/:atom_id/:menuItem_id', model.deleteAtom);

app.get('/DeleteCategory/:app_id/:admin_id/:category_id', model.deleteCategory);
app.get('/DeleteCategoryFather/:app_id/:admin_id/:category_id', model.deleteCategoryFather);
app.get('/DeleteCategorySon/:app_id/:admin_id/:category_id/:categoryfather_id', model.deleteCategorySon);

//Mobile APIs
app.post('/SignUp', model.signUp);
app.get('/GetAllInfoWithAppID/:app_id/:token', model.getAllInfoWithAppID);
app.get('/GetAllInfoWithAppAndUser/:app_id/:user_id', model.getAllInfoWithAppAndUser);
app.get('/GetAtomWithID/:app_id/:atom_id', model.getAtomWithID);
app.get('/GetLocationWithID/:app_id/:location_id', model.getLocationWithID);
app.get('/GetFavoritedAtomsFromUser/:app_id/:user_id', model.getFavoritedAtomsFromUser);
app.get('/GetFavoritedLocationsFromUser/:app_id/:user_id', model.getFavoritedLocationsFromUser);
app.get('/GetFavoritedItemsFromUser/:app_id/:user_id/:time', model.getFavoritedItemsFromUser);

//Favorites
app.post('/FavItem', model.favItem);
app.post('/UnFavItem',model.unFavItem);

//Mobile APIs Protected
app.post('/api_1.0/SignUp', model.signUp);
app.get('/api_1.0/GetAllInfoWithAppID/:app_id/:token', model.getAllInfoWithAppID);
app.get('/api_1.0/GetAllInfoWithAppAndUser/:app_id/:user_id', model.getAllInfoWithAppAndUser);
app.get('/api_1.0/GetAtomWithID/:app_id/:atom_id', model.getAtomWithID);
app.get('/api_1.0/GetLocationWithID/:app_id/:location_id', model.getLocationWithID);
app.get('/api_1.0/GetFavoritedAtomsFromUser/:app_id/:user_id', model.getFavoritedAtomsFromUser);
app.get('/api_1.0/GetFavoritedLocationsFromUser/:app_id/:user_id', model.getFavoritedLocationsFromUser);
app.get('/api_1.0/GetFavoritedItemsFromUser/:app_id/:user_id/:time', model.getFavoritedItemsFromUser);

//Favorites Protected
app.post('/api_1.0/FavItem', model.favItem);
app.post('/api_1.0/UnFavItem',model.unFavItem);


app.get('/Countdown', model.hiBeautiful);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});