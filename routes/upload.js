var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medicos');
var Usuario = require('../models/usuario');


// Opciones por defecto / default options
app.use(fileUpload());

app.put('/:tipo/:id', ( req, res, next ) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if(tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok:false,
            mensaje: 'Tipo de colección no es valida',
            errors: { message: 'Tipo de colección no es valida' }
        });
    };

    if(!req.files) {
        return res.status(400).json({
            ok:false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[ nombreCortado.length -1 ]

    // Sólo se aceptan estas exteciones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if( extensionesValidas.indexOf( extensionArchivo ) < 0 ) {
        return res.status(400).json({
            ok:false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Personalizar el nombre del archivo
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;
    
    // Mover el archivo de la memoria temporal a la carpeta
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err => {
        if( err ) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }
        subirPorTipo( tipo, id, nombreArchivo, res);
     
    });
});

function subirPorTipo( tipo, id, nombreArchivo, res) {
    if(tipo === 'usuarios') {
        Usuario.findById( id, (err, usuario) => {
            if( !usuario ) {
                return res.status(400).json({
                    ok:true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'usuario no existe'}
               });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
                // Eliminando la imagen anterior en caso de que exista
                if( fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                usuario.img = nombreArchivo;
                usuario.save( (err, usuarioActualizado) => {
                    usuarioActualizado.password = ':)';
                          return res.status(200).json({
                               ok:true,
                               mensaje: 'Imagen de usuario actualizada',
                               usuario: usuarioActualizado
                          });
                });
        });
    }
    if(tipo === 'medicos') {
        Medico.findById( id, (err, medico) => {
            if( !medico ) {
                return res.status(400).json({
                    ok:true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe'}
               });
            }
            var pathViejo = './uploads/medicos/' + medico.img;
                // Eliminando la imagen anterior en caso de que exista
                if( fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                medico.img = nombreArchivo;
                medico.save( (err, medicoActualizado) => {
                          return res.status(200).json({
                               ok:true,
                               mensaje: 'Imagen de medico actualizada',
                               medico: medicoActualizado
                          });
                });
        });    
    }
    if(tipo === 'hospitales') {
        Hospital.findById( id, (err, hospital) => {
            if( !hospital) {
                return res.status(400).json({
                    ok:true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'hospital no existe'}
               });
            }
            var pathViejo = './uploads/hospitales/' + hospital.img;
                // Eliminando la imagen anterior en caso de que exista
                if( fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                hospital.img = nombreArchivo;
                hospital.save( (err, hospitalActualizado) => {
                          return res.status(200).json({
                               ok:true,
                               mensaje: 'Imagen de hospital actualizada',
                               hospital: hospitalActualizado
                          });
                });
        });   
    }
}

module.exports = app;