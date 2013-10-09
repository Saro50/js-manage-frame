var helper = require('./helper.js');

module.exports = function(grunt) {


  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    branches : grunt.file.readJSON('branches.json'),
    taskJs : grunt.file.readJSON("taskJs.json"),
    taskCss : grunt.file.readJSON("taskCss.json"),
    jshint: {
          options: {
            jshintrc: '.jshintrc'
          },
          main : {
             src: ['src/MKP_base.js']
          } 
        },
    concat: {
      // options: {
      //  // stripBanners: true, //  /* ... */ block comments are stripped, but NOT /*! ... */ comments.
      //   banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      //     '<%= grunt.template.today("yyyy-mm-dd") %> */',
      //     // define a string to put between each file in the concatenated output
      //   separator: ';'
      // },
      // basic_and_extras:{
      //   files: {
      //         // the files to concatenate
      //         'dest/MKP.all.js':['src/MKP.*.js']
      //       }
      // }
    },
    uglify : {
      options : {
        report:"gzip",
        banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>  */\n'
       },
      main : {
          m1 : {
            options : {
            banner : '/*! here banner _1 <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>  */\n',
            sourceMap : "build/base.js.map"
          },
          files: {
            'build/base.min.js':'src/MKP_base.js'
            }  
        }   
      },
      next : {
          options : {
             banner : '/*! here banner _2 <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>  */\n',
             sourceMap : "build/base2.js.map",
             sourceMapRoot : "http://localhost:"
            },
          files: {
              'build/base2.min.js':'src/MKP_base.js'
            }     
        }
      },
    cssmin : {
      main: {
        options: {
          banner: '/* My minified css file */'
        },
        files: {
          'build/style.min.css': ['src/style.css','blog.css']
        }
      }
}
  });

  grunt.log.write('Logging some stuff...').ok();

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // grunt.registerTask('default', ['jshint','concat','uglify']);
  grunt.registerTask('beforeConcat',"test log here" , function(arg1,data){
         // var done = this.async();
        // Run some sync stuff.
        // var result = grunt.task.run('jshint');
        // grunt.log.writeln('Processing task...');
        // setTimeout(function() {
        //   grunt.log.writeln('All done!');
        //    done();
        // }, 5000);
    var result = {},
        data = grunt.config.get(["prc","path"]),
        name = grunt.config.get(["pkg",'name']);
    for(var p in data){
      if( data.hasOwnProperty(p) ){
        result[data[p] + "/" + name+".js"] = ['src/MKP.*.js'];
      }
    };
    // var result =  {
    //     "D:/WN/NM/MKP.all.js":['src/MKP.*.js']
    //             };
    grunt.config.set(["concat","basic_and_extras","files"], result );
      // var prc = grunt.config.get("prc");
  });
  
  var DESC = "description" , 
      REQUIRED = "required" ,
      BASEPATH = "base",
      each = helper.each,
      type = helper.type,
      search = helper.search,
      taskQueue = [],
      taskJs = grunt.config.get(["taskJs"]),
      branches = grunt.config.get(["branches"]);

  var ProjectModel = (function(){
    var result = {
          get : function(name){
            return this[name];
          }
        };
   each( taskJs , function( v , k ){
          var taskFiles; 
          if(!result[k]){
            taskFiles = result[k] = {};
          }else{
            throw {
                message: K + " Has been existed!"
            };
          }
        each( v ,function( val , p ){
                  taskFiles[p] = {};
                  taskFiles[p].basePath = [];
                  taskFiles[p].relativePath = "",
                  taskFiles[p].path = [];
                  taskFiles[p].required = [];
                  each( val , function( val , i ){
                      if( i !== DESC ){
                        taskFiles[p].relativePath = i;
                        taskFiles[p].required = val;
                      }
                  });
                  if(type(val[DESC]) === "Object"){
                    try{
                      each( val[DESC][BASEPATH] , function( val , i ){
                        if( type( branches[val] ) === "Object" ){
                          each( branches[val] , function( v , j ){
                               taskFiles[p].path.push( v + taskFiles[p].relativePath );
                               taskFiles[p].basePath.push( v );
                          });
                        }else{
                          taskFiles[p].path.push( branches[val] + taskFiles[p].relativePath );
                          taskFiles[p].basePath.push( branches[val] );
                        }
                      });
                    }catch(e){

                    }
                  }
            });  
      });
  return result;
})();

function processFiles(files , val , options ){
  var options = options || {};
      each(val.path , function( p , i ){
        files[p] = val.required;
      });
      return files;
}

function SubTask( val , options ){
  this.files = {};
  processFiles( this.files , val );
  if(options){
    this.options;
  }
  return this;
}




/*
  @param taskName : String .ex "test"
  @param pjName : Array .ex ["dld","index"]
*/
  function processTask( taskName  ,  pjName , options ){
    var op = options || {
          description : "some task",
          jshint : true,
          concat : true,
          uglify : true
        },
        qType = ["jshint" , "concat" , "uglify"],
        des = op.description || "some task" ;
        taskQueue.push(taskName);
        var task =new SubTask( search( ProjectModel.get(pjName[0]) ,  pjName[1] ) );
        each(qType , function( name , i ){
              if(op[name] !== false ){
                grunt.config.set([name,taskName ], task );
              }
      });
  }

/*
  Process
*/

  grunt.registerTask("test" , 'test loging' , function( arg1 , data ){
      processTask( "testIndex" , [ "dld" , "testIndex"]);
      console.log("here------------>");
      console.log( grunt.config.get( ["jshint","testIndex" ] ) );
   // var MM = grunt.template.process('<%= baz %>', {data: obj})
    
  });


 

  //grunt.registerTask("default",['jshint', 'qunit', 'clean', 'concat', 'uglify']);
  //grunt.registerTask("default",[ "test" , "jshint" , "concat" , "uglify" ]);
  grunt.registerTask("default",[ "test" ,"jshint" ]);
};

