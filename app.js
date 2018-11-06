//  Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.set('useCreateIndex', true);



// Inicializar variables
var app = express();

//Body-parser -- parse application/x-www-formj-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',{ useNewUrlParser: true
}, ( err, res ) => {
    if( err ) throw err;
    console.log('Base de datos:\x1b[32m%s\x1b[0m',' Online');
});

//Rutas
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes); 
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', imagenesRoutes);

app.use('/', appRoutes);


app.listen(3000, () => {
    console.log('Express server en puerto 3000:\x1b[34m%s\x1b[0m',' Online');
});


