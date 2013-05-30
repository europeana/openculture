muse-platform
=============

The documentation for this project is in the wiki.  Please follow this link

* [Wiki](/wiki/)

In order to use the project:

* download the code and import to an Appcelerator Titanium project using Titanium Studio.
* put the _server/phpserver code on your own webserver space
* create the database structure (in the eu.php), and edit eu.php with your database password and your europeana api key
* alter the resources/etc/config file with the address of the server
* alter resource/common/css with colour changes
* alter tiapp.xml with a new application id
* run the project

prerequisits

* titanium studio (free)
* server with php / mysql (free)
* 4 x titanium components which are all free (you can remove the flurry code if you don't have or want a flurry account):
<pre>
        <module platform="iphone" version="1.1">dk.napp.social</module>
        <module platform="iphone" version="1.0">de.marcelpociot.twitter</module>
        <module platform="iphone" version="1.1.1">com.onecowstanding.flurry</module>
        <module platform="android" version="1.1.1">com.onecowstanding.flurry</module>
</pre>
