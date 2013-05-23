muse-platform
=============
The data format that has to be returned for the search screen to work is a json array in the format

<pre>

{
    items =     [
                {
            description = "";
            enclosure = "http://europeanastatic.eu/api/image?uri=http%3A%2F%2Fdata.rbge.org.uk%2Fimages%2F501745%2F-1&size=LARGE&type=IMAGE";
            guid = "http://www.europeana.eu/portal/record/11616/E01A01251B8D468E5F3E6F26B0BAA52E0FF2B465.html?utm_source=api&utm_medium=api&utm_campaign=ZHKKYAIMYT";
            id = "/11616/E01A01251B8D468E5F3E6F26B0BAA52E0FF2B465";
            image = "http://europeanastatic.eu/api/image?uri=http%3A%2F%2Fdata.rbge.org.uk%2Fimages%2F501745%2F-1&size=LARGE&type=IMAGE";
            rights =             (
                "http://creativecommons.org/licenses/by-sa/3.0/"
            );
            title = "Calocedrus decurrens (Torr.) Florin";
            type = IMAGE;
            url = "http://europeana.eu/api//v2/record/11616/E01A01251B8D468E5F3E6F26B0BAA52E0FF2B465.json?wskey=ZHKKYAIMYT";
        },
        ......
        { }
    ];
    perpage = 100;
    "status_msg" = "";
    totalResults = 7;
    types =     [
        "#LANGUAGE",
        "&qf=LANGUAGE:en|en (7)",
        "#PROVIDER",
        "&qf=PROVIDER:OpenUp%21|OpenUp! (7)",
        "#COUNTRY",
        "&qf=COUNTRY:\"united+kingdom\"|united kingdom (7)"
    ];
    url = "http://europeana.eu/api/v2/search.json?query=Calocedrus&rows=100&start=1&wskey=ZHKKYAIMYT&profile=portal&qf=TYPE:IMAGE&qf=DATA_PROVIDER:\"Cat%C3%A1logo+Colectivo+de+la+Red+de+Bibliotecas+de+los+Archivos+Estatales\"&qf=DATA_PROVIDER:\"Biblioteca+Virtual+del+Patrimonio+Bibliogr%C3%A1fico\"&qf=DATA_PROVIDER:\"Biblioteca+Virtual+del+Ministerio+de+Defensa\"&qf=DATA_PROVIDER:\"Rijksmuseum\"&qf=DATA_PROVIDER:\"\U0418\U043d\U0441\U0442\U0438\U0442\U0443\U0442+\U0437\U0430+\U0431\U0430\U043b\U043a\U0430\U043d\U0438\U0441\U0442\U0438\U043a\U0430+\U0441+\U0426\U0435\U043d\U0442\U044a\U0440+\U043f\U043e+\U0442\U0440\U0430\U043a\U043e\U043b\U043e\U0433\U0438\U044f\"&qf=DATA_PROVIDER:\"Central+Library+of+Bulgarian+Academy+of+Sciences\"&qf=DATA_PROVIDER:\"Museu+Nacional+de+Arqueologia\"&qf=DATA_PROVIDER:\"The+Royal+Botanic+Garden+Edinburgh\"&qf=DATA_PROVIDER:\"University+of+Tartu,+Natural+History+Museum\"&qf=DATA_PROVIDER:\"Museum+of+Geology,+University+of+Tartu\"&qf=DATA_PROVIDER:\"The+National+Library+of+Poland+-+Biblioteka+Narodowa\"&qf=DATA_PROVIDER:\"Biblioteca+Valenciana+Digital\"&qf=DATA_PROVIDER:\"Fondo+Fotogr\U00e1fico+de+la+Universidad+de+Navarra\"";
}



</pre>


<pre>
{
    description = "";
    enclosure = "http://europeanastatic.eu/api/image?uri=http%3A%2F%2Fdata.rbge.org.uk%2Fimages%2F502555%2F-1&size=LARGE&type=IMAGE";
    guid = "http://www.europeana.eu/portal/record/11616/06C84C18C79532DE75936F3FBD401BCCB54BD79F.html?utm_source=api&utm_medium=api&utm_campaign=ZHKKYAIMYT";
    id = "/11616/06C84C18C79532DE75936F3FBD401BCCB54BD79F";
    image = "http://europeanastatic.eu/api/image?uri=http%3A%2F%2Fdata.rbge.org.uk%2Fimages%2F502555%2F-1&size=LARGE&type=IMAGE";
    rights =     (
        "http://creativecommons.org/licenses/by-sa/3.0/"
    );
    title = "Calocedrus decurrens (Torr.) Florin";
    type = IMAGE;
    url = "http://europeana.eu/api//v2/record/11616/06C84C18C79532DE75936F3FBD401BCCB54BD79F.json?wskey=ZHKKYAIMYT";
}

</pre>



