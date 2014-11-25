OPERAZIONI PER LO SVILUPPO

Configurazioni e cartelle
-----------------------------------------------------------------------------------

gruntfile.js file di "make" per lo sviluppo

bower.json configurazione di tutte le librerie 
.bowerrc opzioni di bower (cartella)

node_modules tutti i moduli npm e grunt

app/ cartella dove risiedono i sorgenti dell'applicazione

www/ cartella dove viene preparata l'applicazione per il serve

Operations
-----------------------------------------------------------------------------------

grunt init (


grunt ( esegue un jshint) con le configurazioni di .jshintrc e .jshintignore


Esegue un deploy nella cartella www/ con o senza compressione
grunt serve --consolelogs
grunt serve:compress