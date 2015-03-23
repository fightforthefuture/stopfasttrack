var $c = document.createElement.bind(document);
var IMG_HEIGHT = 80;
var scroll_listeners = {};

/**
    Org Model: used to store data for an organization (eg. in the logo cloud)
**/
var Org = Composer.Model.extend({});

/**
    Orgs Collection: store a collection of Org models, and sort by org_name
**/
var OrgsCollection = Composer.Collection.extend({
    model: Org,

    sortfn: function(a, b) {
        return a.get('org_name').localeCompare(b.get('org_name'));
    },
});

/**
    LogoCloudItemController: Shows a logo cloud organization. Only loads the
    image when the user scrolls to it. Destroys scroll event listener afterwards
**/
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
        var img_y           = this.img.getBoundingClientRect().top;
        var img_height      = this.img.getBoundingClientRect().height;
        var client_height   = document.documentElement.clientHeight;
        var y_offset        = window.pageYOffset;

        if (img_y < client_height)
            this.show_image();
    },

    show_image: function() {
        var model = this.model;
        window.removeEventListener('scroll',scroll_listeners[model.get('name')]);

        var img = new Image();
        img.src = 'images/orgs/'+model.get('name')+'.png';
        img.onload = function() {
            var div = $c('div');
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
        var div = $c('div');
        div.className = 'img invisible';
        div.style.width = this.model.get('img_width') + 'px';
        div.style.height = IMG_HEIGHT + 'px';
        this.html(div);
        
        return this;
    }
});

/**
    OrgListController: Shows a list of organizations.
**/
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
        var ul = $c('ul');
        ul.className = 'orgs';
        this.html(ul);
    }
});

/**
    OrgListItemController: Shows an item in the OrgListController list of orgs.
**/
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
        var a = $c('a');
        a.href = '#';
        a.textContent = this.model.get('org_name');
        this.html(a);
    },

    show_modal: function(e) {
        e.preventDefault();
        new OrgModal({ model: this.model });
    }
});

/**
    BaseModalController: Provides common functionality for modals. All modals
    extend this.
**/
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
        var div = $c('div');
        div.className = 'overlay invisible';
        var gutter = $c('div');
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

        if (typeof this.before_hide == 'function')
            this.before_hide();
        
        setTimeout(function() {
            this.release();
        }.bind(this), 400);
        
    }
});

/**
    OrgModal: Shows a modal for an organization when the user clicks in the logo
    cloud or an org list item. This controller extends the BaseModalController.
**/
var OrgModal = BaseModalController.extend({

    events: {
        'click a.close': 'click_close'
    },

    events: {
        'click a.twitter': 'tweet'
    },

    model: null,

    init: function() {
        this.render();
        this.show()
    },

    render: function() {
        var overlay = this.base_render();

        var div = $c('div');
        div.className = 'modal';
        
        var img = $c('img');
        img.className = 'logo';
        img.src = 'images/orgs/'+this.model.get('name')+'.png';
        div.appendChild(img);

        var h2 = $c('h2');
        h2.textContent = this.model.get('org_name');
        div.appendChild(h2);

        var h3 = $c('h3');
        h3.textContent = this.model.get('headline');
        div.appendChild(h3);

        var p = $c('p');
        p.innerHTML = this.model.get('description');
        div.appendChild(p);

        var a = $c('a');
        a.className = 'close';
        a.textContent = '×';
        a.href = '#';
        div.appendChild(a);

        if (this.model.get('tweet_text')) {
            var a = $c('a');
            a.className = 'social twitter';
            a.href = '#';
            a.textContent = 'Tweet this';
            div.appendChild(a);
        }

        overlay.firstChild.appendChild(div);

        this.html(overlay);
    },

    tweet: function(e) {
        e.preventDefault();
        var txt= encodeURIComponent(this.model.get('tweet_text')+' '+SITE_URL);
        window.open('https://twitter.com/intent/tweet?text='+txt)
    }
});

/**
    ActionBarController: Provides events for the action bar (already rendered).
**/
var ActionBarController = Composer.Controller.extend({

    events: {
        'click a.twitter': 'tweet',
        'click a.facebook': 'share',
        'click a.donate': 'donate'
    },

    donate: function(e) {
        e.preventDefault();
        window.open('https://donate.fightforthefuture.org?tag='+TAG);
    },

    share: function(e) {
        e.preventDefault();
        window.open('https://www.facebook.com/sharer/sharer.php?u='+SITE_URL);
    },

    tweet: function(e) {
        e.preventDefault();
        var txt = encodeURIComponent(TWEET_TEXT+' '+SITE_URL);
        window.open('https://twitter.com/intent/tweet?text='+txt)
    }
});

/**
    CallActionController: Calls Congress
**/
var CallActionController = Composer.Controller.extend({

    elements: {
        'input[type=text]': 'phone'
    },

    events: {
        'submit form': 'submit',
        'click a.email': 'show_email_action'
    },

    submit: function(e) {
        e.preventDefault();
        
        var phone = this.phone.value;

        if (!this.validate_phone(phone))
            return alert('Please enter a valid US phone number!');

        var data = new FormData();
        data.append('campaignId', CALL_CAMPAIGN);
        data.append('userPhone', this.validate_phone(phone));

        var url = 'https://call-congress.fightforthefuture.org/create';

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('sent!', xhr.response);
            }
        }.bind(this);
        xhr.open("post", url, true);
        xhr.send(data);

        new CallActionModal();
    },

    validate_phone: function(num) {
        num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
        num = num.replace("+", "").replace(/\-/g, '');

        if (num.charAt(0) == "1")
            num = num.substr(1);

        if (num.length != 10)
            return false;

        return num;
    },

    show_email_action: function(e) {
        if (e)
            e.preventDefault();
        this.el.className += ' invisible';
        var email_el = email_controller.el;

        setTimeout(function() {
            this.el.className += ' hidden';
            email_el.className = email_el.className.replace('hidden', '');

            setTimeout(function() {
                email_el.className = email_el.className.replace('invisible','');
            }, 50);
        }.bind(this), 500);
    }
});

/**
    CallActionModal: Shows instructions for calling Congress
**/
var CallActionModal = BaseModalController.extend({

    events: {
        'click a.close': 'click_close'
    },

    events: {
        'click a.twitter': 'tweet',
        'click a.facebook': 'share'
    },

    init: function() {
        this.render();
        this.show()
    },

    render: function() {
        var overlay = this.base_render();

        var div = $c('div');
        div.className = 'modal';
        
        var h2 = $c('h2');
        h2.textContent = CALL_MODAL_TITLE;
        div.appendChild(h2);

        var h3 = $c('h3');
        h3.textContent = CALL_MODAL_SUBTITLE;
        div.appendChild(h3);

        var p = $c('blockquote');
        p.innerHTML = '“' + CALL_MODAL_SCRIPT + '”';
        div.appendChild(p);

        var a = $c('a');
        a.className = 'close';
        a.textContent = '×';
        a.href = '#';
        div.appendChild(a);

        var a = $c('a');
        a.className = 'social twitter';
        a.href = '#';
        a.textContent = 'Tweet this';
        div.appendChild(a);

        var a = $c('a');
        a.className = 'social facebook';
        a.href = '#';
        a.textContent = 'Share this';
        div.appendChild(a);        

        overlay.firstChild.appendChild(div);

        this.html(overlay);
    },

    share: function(e) {
        e.preventDefault();
        window.open('https://www.facebook.com/sharer/sharer.php?u='+SITE_URL);
    },

    tweet: function(e) {
        e.preventDefault();
        var txt = encodeURIComponent(TWEET_TEXT+' '+SITE_URL);
        window.open('https://twitter.com/intent/tweet?text='+txt)
    },

    before_hide: function() {
        call_controller.show_email_action();
        email_controller.set_title(POST_CALL_TITLE);
        email_controller.set_blurb(POST_CALL_BLURB);
    }

});

/**
    EmailActionController: Emails Congress
**/
var EmailActionController = Composer.Controller.extend({
    elements: {
        'h1': 'title',
        'p.blurb': 'blurb',
        'input[name=first_name]': 'first_name',
        'input[name=email]': 'email',
        'input[name=address1]': 'address1',
        'input[name=zip]': 'zip',
        'textarea': 'action_comment',
        'div.thanks': 'thanks',
        'form': 'form'
    },

    events: {
        'submit form': 'submit',
        'click a.twitter': 'tweet',
        'click a.facebook': 'share',
    },

    set_title: function(str) {
        console.log('trol: ',str);
        this.title.innerHTML = str;
    },

    set_blurb: function(str) {
        this.blurb.innerHTML = str;
    },

    submit: function(e) {
        e.preventDefault();
        console.log('submit');

        var error = false;

        var add_error = function(el) {
            el.className = 'error';
            error = true;
        }

        if (!this.first_name.value) add_error(this.first_name);
        if (!this.email.value) add_error(this.email);
        if (!this.address1.value) add_error(this.address1);
        if (!this.zip.value) add_error(this.zip);

        if (error) return alert('Please fill out all fields :)');

        var comment = this.action_comment.value;

        if (comment.indexOf('"', comment.length - 1) !== -1)
            comment = comment.substr(0, comment.length - 1);

        if (comment.indexOf('"') === 0)
            comment = comment.substr(1);

        console.log('comment: ', comment);

        var data = new FormData();
        data.append('guard', '');
        data.append('hp_enabled', true);
        data.append('member[first_name]', this.first_name.value);
        data.append('member[email]', this.email.value);
        data.append('member[street_address]', this.address1.value);
        data.append('member[postcode]', this.zip.value);
        data.append('action_comment', comment);
        data.append('tag', TAG);

        var url = 'https://queue.fightforthefuture.org/action';

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('response:', xhr.response);
            }
        }.bind(this);
        xhr.open("post", url, true);
        xhr.send(data);

        this.title.style.display = 'none';
        this.blurb.style.display = 'none';
        this.form.style.display = 'none';
        this.thanks.style.display = 'block';
    },

    share: function(e) {
        e.preventDefault();
        window.open('https://www.facebook.com/sharer/sharer.php?u='+SITE_URL);
    },

    tweet: function(e) {
        e.preventDefault();
        var txt = encodeURIComponent(TWEET_TEXT+' '+SITE_URL);
        window.open('https://twitter.com/intent/tweet?text='+txt)
    }
});


// -----------------------------------------------------------------------------
// Actual functionality starts here :)
// -----------------------------------------------------------------------------

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

new ActionBarController({
    el: document.querySelector('.action_bar')
});

var call_controller = new CallActionController({
    el: document.querySelector('.action.call')
});

var email_controller = new EmailActionController({
    el: document.querySelector('.action.email')
});
