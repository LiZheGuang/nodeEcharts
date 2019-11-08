var page = require('webpage').create();
//viewportSize being the actual size of the headless browser
page.viewportSize = { width: 1024, height: 768 };
//the clipRect is the portion of the page you are taking a screenshot of
page.clipRect = { top: 0, left: 0, width: 1024, height: 768 };
//the rest of the code is the same as the previous example
page.open('http://10.8.16.145:5500/web/web.html', function (status) {
    console.log(document.getElementById('main'))
    setTimeout(function(){
        page.render('google_home.png');
        phantom.exit();
    }, 10000);
       

     
});

