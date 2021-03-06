var components=[
    "base/app-layout",
    "base/app-content",
    "app/stars",
    "app/tens",
    "app/user",
    "app/icon",
]

function listDir(path) {
    window.resolveLocalFileSystemURL(path,
        function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
                function (entries) {
                    console.log(entries);
                },
                function (err) {
                    console.log(err);
                }
            );
        }, function (err) {
            console.log(err);
        }
    );
}

function readLocalFile(file, callback, error){
    if (window.resolveLocalFileSystemURL){
        window.resolveLocalFileSystemURL(file,function(entry){
             entry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function() {
                        callback(this.result);
                };
                reader.readAsText(file);
                })
             }, error)
    }else if (error){
        error("Can't load file");
    }
}

var  audioEngine = new WebAudio();


var loadData=function(url,callback, error){

    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if(req.status == 200){
                callback(req.responseText);
            }
            else{
                if (!window.cordova){
                    if (error) {
                        error("Error loading")
                    }
                    return;
                }
                var file=cordova.file.applicationDirectory+"www/"+url;
                readLocalFile(file,callback,error);
            }
        }
    };
    req.onerror=function(err){
        if (!window.cordova){
            if(error){
                error("Error loading "+url+" "+err);
            }
            return;
        }
        var file=cordova.file.applicationDirectory+"www/"+url;
        readLocalFile(file,callback,error);
    }
    req.send(null)
}
var sass = new Sass();

var vueData={
    el: '#app',
    data: {
        contents : {
            "title" : "Loading"
        },
        appLayout: "",
        debug: false
    },
    created:function(){
        var self=this;
        this.loadComponents(components,function(){
            self.$el.className+=" loaded";
            // console.log("Components loaded");
            self.appLayout="app-layout";
        },0)
    },
    mounted:function(){
        console.log("mounted");
    },
    methods: {
        loadComponents:function(list,callback, pos){
            var self = this;
            if (!pos){
                pos=0;
            }
            if (!list[pos]){
                callback(pos);
                return;
            }
            this.loadComponent(list[pos],function(text){
                self.loadComponents(list, callback, pos+1);
            })
        },
        loadComponent:function(id, callback){
            var suffix = '?' + (new Date()).getTime();
            loadData("components/"+id+".html"+suffix,function(text){
                var e=document.createElement("div");
                e.id="component-"+id
                e.innerHTML=text
                var loaded = false
                var scripts=e.querySelectorAll("script[type='text/javascript']");
                var scssStyles=e.querySelectorAll("style[lang='scss']");
                for(var i=0; i<scssStyles.length; i++){
                    var style = scssStyles[i]
                    var scss = style.innerHTML
                    style.parentNode.removeChild(style)
                    sass.compile(scss, function(result) {
                        var st = document.createElement("style")
                        st.id="style-"+id
                        st.innerHTML = result.text
                        document.body.appendChild(st)
                        if (!loaded){
                            callback(text)
                            loaded = true
                        }
                    });
                }
                for(var i=0; i<scripts.length; i++){
                    var script=scripts[i];
                    if (script.src){
                        var sc=document.createElement("SCRIPT");
                        sc.src=script.src;
                        document.body.appendChild(sc);
                    }else{
                        var prefix="";
                        var lines = text.split("\n");
                        for(var i=0; i<lines.length; i++){
                            prefix+="\n"
                            if (lines[i].indexOf("text/javascript")>0) {
                                break;
                            }
                        }
                        eval(prefix+script.innerHTML);
                    }    
                }
                document.body.appendChild(e);
                if (!scssStyles || scssStyles.length==0){
                    callback(text);
                }
            },function(err){
                console.log('load error', err);
            })
        },
        loadView:function(view){
            var self=this;
            console.log("Load view",view);
            loadData("data/"+view+".json?"+Math.random(),function(text){
                var json=JSON.parse(text);
                self.contents=json;
                document.title=json.title;
            })
        }
    }
}

document.addEventListener("deviceready",function(){
  var app = new Vue(vueData);
});

if (!window.cordova && !window.ae){
    var event = new CustomEvent('deviceready');
    document.dispatchEvent(event);   
}

