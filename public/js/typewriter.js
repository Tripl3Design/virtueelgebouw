var TxtType = function(el, toRotate, period, highlightWords) {
    this.toRotate = toRotate; // Array van strings om te typen
    this.el = el; // HTML element waar de tekst getypt wordt
    this.loopNum = 0; // Index om door de strings te lopen
    this.period = parseInt(period, 10) || 2000; // Duur van elke typcyclus
    this.txt = ''; // Huidige tekst die getypt wordt
    this.isDeleting = false; // Flag voor het verwijderen van tekst
    this.highlightWords = highlightWords || []; // Woorden om te markeren
    this.tick(); // Start het type effect
};

// Methode om het typeffect af te handelen
TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length; // Huidige string index
    var fullTxt = this.toRotate[i]; // Volledige tekst om te typen

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1); // Verwijder een karakter
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1); // Voeg een karakter toe
    }

    // Update het HTML element met de huidige tekst
    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 100 - Math.random() * 100; // Willekeurige snelheid voor typ effect

    if (this.isDeleting) { delta /= 2; } // Versnel het verwijderen

    // Als het typen klaar is, pauzeer kort en markeer dan de woorden
    if (!this.isDeleting && this.txt === fullTxt) {
        if (i !== this.toRotate.length - 1) {
            setTimeout(function() {
                that.el.innerHTML = '<span class="wrap">'+that.highlight(that.txt)+'</span>';
                setTimeout(function() {
                    that.isDeleting = true;
                    that.tick();
                }, 2000); // Pauzeer 2 seconden voordat je gaat verwijderen
            }, 500); // Pauzeer 500 milliseconden voordat je gaat markeren
        } else {
            // Voer het highlighten uit nadat de laatste string is getypt
            setTimeout(function() {
                that.el.innerHTML = '<span class="wrap">'+that.highlight(that.txt)+'</span>';
            }, 500);
        }
        return;
    // Als het verwijderen klaar is, ga naar de volgende string
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 800; // Pauzeer voordat je de volgende string typt
    }

    // Herhaal de tick methode na een vertraging
    setTimeout(function() {
        that.tick();
    }, delta);
};

// Methode om bepaalde woorden te markeren
TxtType.prototype.highlight = function(text) {
    var highlightedText = text;
    for (var i = 0; i < this.highlightWords.length; i++) {
        var word = this.highlightWords[i];
        var regex = new RegExp(`(${word})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
    }
    return highlightedText;
};

// Initialiseer het typeffect bij het laden van het venster
window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        var highlightWords = elements[i].getAttribute('data-highlight-words');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period, highlightWords ? JSON.parse(highlightWords) : []);
        }
    }
    // Injecteer CSS voor het type-cursor en gemarkeerde woorden
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.12em solid black; } .highlight { background-color: yellow; }";
    document.body.appendChild(css);
};
