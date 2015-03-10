var IMG_HEIGHT = 80;

var scroll_listeners = {};

var Org = Composer.Model.extend({});

var OrgsCollection = Composer.Collection.extend({
    model: Org,

    sortfn: function(a, b) {
        return a.get('org_name').localeCompare(b.get('org_name'));
    },
});

var LogoCloudItemController = Composer.Controller.extend({
    
    model: null,

    el: false,

    elements: {
        '.img': 'img'
    },

    events: {
        'click div': 'show_modal'
    },

    init: function() {
        var name = this.model.get('name');
        var container = document.querySelector('.org.'+name);
        container.style.display = 'inline-block';
        this.inject = container;
        this.attach();
        this.render();

        // listen for the item to become visible on scroll
        scroll_listeners[name] = this.on_scroll.bind(this);
        window.addEventListener('scroll', scroll_listeners[name]);
        this.on_scroll();

        return this;
    },

    show_modal: function(e) {
        e.preventDefault();
        new OrgModal({ model: this.model });
    },

    on_scroll: function() {
        //console.log(this.img.getBoundingClientRect())
        var img_y           = this.img.getBoundingClientRect().top;
        var img_height      = this.img.getBoundingClientRect().height;
        var client_height   = document.documentElement.clientHeight;
        var y_offset        = window.pageYOffset;

        // console.log(img_y, img_height, client_height, y_offset);

        if (img_y < client_height)
            this.show_image();
    },

    show_image: function() {
        var model = this.model;
        window.removeEventListener('scroll',scroll_listeners[model.get('name')]);

        var img = new Image();
        img.src = 'images/orgs/'+model.get('name')+'.png';
        img.onload = function() {
            var div = document.createElement('div');
            div.style.width = model.get('img_width') + 'px';
            div.style.height = IMG_HEIGHT + 'px';
            div.style.backgroundImage = 'url('+img.src+')';
            div.style.backgroundSize = 'auto '+this.IMG_HEIGHT+'px';
            div.className = 'invisible'
            this.img.appendChild(div);
            setTimeout(function() {
                div.className = '';
                this.img.className = 'img';
            }.bind(this), 100);
        }.bind(this);
    },

    render: function()
    {
        var data = {};
        var div = document.createElement('div');
        div.className = 'img invisible';
        div.style.width = this.model.get('img_width') + 'px';
        div.style.height = IMG_HEIGHT + 'px';
        this.html(div);
        
        return this;
    }

});

var OrgListController = Composer.ListController.extend({

    elements: {'ul': 'el_list'},

    collection: null,

    init: function() {
        this.render();

        this.track(this.collection, function(model, options) {
            return new OrgListItemController({
                inject: this.el_list,
                model: model
            });
        }.bind(this));
    },

    render: function() {
        var ul = document.createElement('ul');
        ul.className = 'orgs';
        this.html(ul);
    }
});

var OrgListItemController = Composer.Controller.extend({

    tag: 'li',

    model: null,

    events: {
        'click a': 'show_modal'
    },

    init: function() {
        this.render();
    },

    render: function() {
        var a = document.createElement('a');
        a.href = '#';
        a.textContent = this.model.get('org_name');
        this.html(a);
    },

    show_modal: function(e) {
        e.preventDefault();
        new OrgModal({ model: this.model });
    }
});

var BaseModalController = Composer.Controller.extend({
    elements: {
        'div.overlay': 'overlay',
        'div.gutter': 'gutter'
    },
    events: {
        'click .gutter': 'click_close'
    },

    inject: 'body',

    base_render: function() {
        var div = document.createElement('div');
        div.className = 'overlay invisible';
        var gutter = document.createElement('div');
        gutter.className = 'gutter';
        div.appendChild(gutter);
        return div;
    },

    click_close: function(e) {
        e.preventDefault();
        if (e.target == this.gutter || e.target.className == 'close')
            this.hide();
    },

    show: function() {
        this.overlay.style.display = 'block';
        setTimeout(function() {
            this.overlay.className = 'overlay';
        }.bind(this), 50);
    },

    hide: function() {
        this.overlay.classList.add('invisible');
        
        setTimeout(function() {
            this.release();
        }.bind(this), 400);
        
    }
});

var OrgModal = BaseModalController.extend({

    events: {
        'click a.close': 'click_close'
    },

    model: null,

    init: function() {
        this.render();
        this.show()
    },

    render: function() {
        var overlay = this.base_render();

        var div = document.createElement('div');
        div.className = 'modal';
        
        var img = document.createElement('img');
        img.className = 'logo';
        img.src = 'images/orgs/'+this.model.get('name')+'.png';
        div.appendChild(img);

        var h2 = document.createElement('h2');
        h2.textContent = this.model.get('org_name');
        div.appendChild(h2);

        var h3 = document.createElement('h3');
        h3.textContent = this.model.get('headline');
        div.appendChild(h3);

        var p = document.createElement('p');
        p.innerHTML = this.model.get('description');
        div.appendChild(p);

        var a = document.createElement('a');
        a.className = 'close';
        a.textContent = '×';
        a.href = '#';
        div.appendChild(a);

        if (this.model.get('tweet_text')) {
            var a = document.createElement('a');
            a.className = 'social twitter';
            a.href = '#';
            a.textContent = 'Tweet this';
            div.appendChild(a);
        }

        overlay.firstChild.appendChild(div);

        this.html(overlay);
    }
});

var orgs = document.querySelectorAll(".org");

var orgsCollection = new OrgsCollection();

for (var i=0; i<orgs.length; i++) {

    var org_name_short = orgs[i].className.replace('org', '').trim();
    var org_name = org_name_short;
    if (orgs[i].querySelector(".org_name"))
        org_name = orgs[i].querySelector(".org_name").textContent;

    var img_width = 200;
    if (orgs[i].querySelector(".img_width"))
        img_width = orgs[i].querySelector(".img_width").textContent;

    var headline = '';
    if (orgs[i].querySelector(".headline"))
        headline = orgs[i].querySelector(".headline").textContent;

    var description = '';
    if (orgs[i].querySelector(".description"))
        description = orgs[i].querySelector(".description").innerHTML;

    var tweet_text = null;
    if (orgs[i].querySelector(".tweet_text"))
        tweet_text = orgs[i].querySelector(".tweet_text").textContent;

    var org = new Org({
        name:           org_name_short,
        org_name:       org_name,
        headline:       headline,
        description:    description,
        tweet_text:     tweet_text,
        img_width:      img_width
    });
    orgsCollection.add(org);

    var show_in_cloud = orgs[i].querySelector(".show_in_cloud");
    if (show_in_cloud && show_in_cloud.textContent.toLowerCase() == 'true')
        var controller = new LogoCloudItemController({model: org});
}

new OrgListController({
    inject: document.getElementById('org_list'),
    collection: orgsCollection
});