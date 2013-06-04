muse-platform
=============

The documentation for this project is in the wiki.  Please follow this link

* [Wiki](https://github.com/europeana/openculture/wiki/ )

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
        module platform="iphone" version="1.1">dk.napp.social
        module platform="iphone" version="1.0">de.marcelpociot.twitter
        module platform="iphone" version="1.1.1">com.onecowstanding.flurry
        module platform="android" version="1.1.1">com.onecowstanding.flurry
</pre>

License
The code is licensed under the "European Union Public Licence" 

<pre>
/*
* Copyright 2007 Europeana & Glimworm IT BV
*
* Licensed under the EUPL, Version 1.1 or – as soon they
  will be approved by the European Commission - subsequent
  versions of the EUPL (the "Licence");
* You may not use this work except in compliance with the Licence.
* You may obtain a copy of the Licence at:
*
* http://ec.europa.eu/idabc/eupl5
*
* Unless required by applicable law or agreed to in
  writing, software distributed under the Licence is
  distributed on an "AS IS" basis,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
  express or implied.
* See the Licence for the specific language governing
  permissions and limitations under the Licence.
*/
