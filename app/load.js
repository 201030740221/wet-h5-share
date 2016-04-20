
        refresher.init({
            id: "wrapper",//<------------------------------------------------------------------------------------┐
            pullDownAction: Refresh,
            pullUpAction: Load
        });
        var generatedCount = 0;
        function Refresh() {
            setTimeout(function () {    // <-- Simulate network congestion, remove setTimeout from production!
                var el, li, i;
                el = document.querySelector("#wrapper ul");
                el.innerHTML = '';
                for (i = 0; i < 11; i++) {
                    li = document.createElement('li');
                    li.appendChild(document.createTextNode('async row ' + (++generatedCount)));
                    el.insertBefore(li, el.childNodes[0]);
                }
                wrapper.refresh();/****remember to refresh after  action completed！ ---yourId.refresh(); ----| ****/
                for (var i = 0; i < document.querySelectorAll("#wrapper ul li").length; i++) {
                    document.querySelectorAll("#wrapper ul li")[i].colorfulBg();
                }
            }, 1000);

        }

        function Load() {
            setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
                var el, li, i;
                el = document.querySelector("#wrapper ul");
                for (i = 0; i < 2; i++) {
                    li = document.createElement('li');
                    li.appendChild(document.createTextNode('async row ' + (++generatedCount)));
                    el.appendChild(li, el.childNodes[0]);
                }
                wrapper.refresh();/****remember to refresh after action completed！！！   ---id.refresh(); --- ****/
                for (var i = 0; i < document.querySelectorAll("#wrapper ul li").length; i++) {
                    document.querySelectorAll("#wrapper ul li")[i].colorfulBg();
                }
            }, 1000);
        }
    